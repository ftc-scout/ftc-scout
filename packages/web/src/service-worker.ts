/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
/*
 * How a request is handled: (sw.addEventListener("fetch", (event) => { )
 *
 *   POST <api>/graphql (full query) ──► posted()  network; kept copy if it fails or isn't data
 *   GET  /css, /head, /img/*.svg     ──► kept()    cache, else network
 *   GET  /_app/immutable/*           ──► kept()    cache, else network and store
 *   page navigation                  ──► page()    network, or SHELL after PATIENCE_MS / 5xx /
 *                                                  offline; the shell draws from cached code + data
 *   GET  <api>/graphql?…, /rest/v1/* ──► api()     no copy: wait for network
 *                                                  copy: network, or the copy after PATIENCE_MS
 *
 * page() and api() use waitUntil, so if the response comes after PATIENCE_MS it serves a cache but
 * still stores the new response when it comes in
 */

import { build, files, version } from "$service-worker";
import {
    SHELL,
    asksForQuery,
    hashedAddress,
    inlinedAnswers,
    keptFromTheStart,
    kindOf,
    staticKept,
    worthKeeping,
} from "$lib/pwa/requests";

const sw = self as unknown as ServiceWorkerGlobalScope;

/** Can invalidate caches on new version (if we are going to use versions). */
const CODE = `code-${version}`;

const API = "api";
const MAX_API = 150;
const PATIENCE_MS = 6000;

sw.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            let cache = await caches.open(CODE);
            await cache.addAll([...build.filter(keptFromTheStart), ...files.filter(staticKept)]);
            await cache.add(new Request(SHELL, { cache: "reload" }));
            await sw.skipWaiting();
        })()
    );
});

sw.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            for (let name of await caches.keys()) {
                if (name.startsWith("code-") && name != CODE) await caches.delete(name);
            }
            await sw.clients.claim();
        })()
    );
});

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Static assets. */
async function kept(request: Request, keep: boolean): Promise<Response> {
    let cache = await caches.open(CODE);
    let hit = await cache.match(request, { ignoreSearch: true });
    if (hit) return hit;
    let response = await fetch(request);
    if (keep && response.ok) void cache.put(request, response.clone()).catch(() => {});
    return response;
}

async function page(request: Request, event: FetchEvent): Promise<Response> {
    let shell = await (await caches.open(CODE)).match(SHELL);
    if (!shell) return fetch(request);
    let network = fetch(request);

    // If the site is too slow it will show a caches one but store the new one when it comes in
    event.waitUntil(
        network
            .then((response) => {
                if (response.ok && response.headers.get("content-type")?.includes("text/html")) {
                    return keepInlined(request.url, response.clone());
                }
            })
            .catch(() => {})
    );
    try {
        let response = await Promise.race([network, sleep(PATIENCE_MS).then(() => null)]);
        if (!response || response.status >= 500) return shell;
        return response;
    } catch {
        return shell;
    }
}

async function keepInlined(pageUrl: string, response: Response): Promise<void> {
    try {
        for (let answer of inlinedAnswers(await response.text())) {
            let url = new URL(answer.url, pageUrl);
            if (kindOf("GET", url, false, sw.location.origin) != "api") continue;
            if (!good(url, answer.status, answer.contentType, answer.body)) continue;
            await keep(
                url.href,
                new Response(answer.body, { headers: { "content-type": answer.contentType } })
            );
        }
    } catch {
        // Some pages cant be read
    }
}

/** Avoids recaching a cached response */
async function tell(event: FetchEvent, what: "kept" | "fresh"): Promise<void> {
    let client = event.clientId ? await sw.clients.get(event.clientId) : undefined;
    client?.postMessage({ ftcscout: what });
}

function good(url: URL, status: number, contentType: string | null, body: string | null): boolean {
    if (url.pathname != "/graphql") return status == 200;
    return body != null && worthKeeping(status, contentType, body);
}

async function keep(url: string, response: Response): Promise<void> {
    try {
        let cache = await caches.open(API);
        await cache.delete(url);
        await cache.put(url, response);
        let keys = await cache.keys();
        for (let old of keys.slice(0, Math.max(0, keys.length - MAX_API))) await cache.delete(old);
    } catch {}
}

async function ask(
    request: Request,
    event: FetchEvent,
    answered: Promise<Response>
): Promise<{ response: Response; isData: boolean; usable: boolean }> {
    let response = await answered;
    let url = new URL(request.url);
    if (url.pathname != "/graphql") {
        let isData = good(url, response.status, null, null);
        if (isData) event.waitUntil(keep(request.url, response.clone()));
        return { response, isData, usable: isData };
    }

    if ([204, 205, 304].includes(response.status)) {
        return { response, isData: false, usable: false };
    }

    let text = await response.text();
    let answer = () =>
        new Response(text, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
    let isData = good(url, response.status, response.headers.get("content-type"), text);
    if (isData) event.waitUntil(keep(request.url, answer()));

    return { response: answer(), isData, usable: isData || asksForQuery(text) };
}

async function api(request: Request, event: FetchEvent): Promise<Response> {
    let hit = await (await caches.open(API)).match(request.url);
    let answered = fetch(request);
    let fresh = ask(request, event, answered);
    if (!hit) {
        let { response, isData } = await fresh;
        if (isData) event.waitUntil(tell(event, "fresh"));
        return response;
    }

    let saved = () => {
        event.waitUntil(tell(event, "kept"));
        return hit!;
    };

    event.waitUntil(fresh.catch(() => {}));
    try {
        let started = await Promise.race([answered, sleep(PATIENCE_MS).then(() => null)]);
        if (!started) return saved();
        let first = await fresh;
        if (!first.usable) return saved();
        if (first.isData) event.waitUntil(tell(event, "fresh"));
        return first.response;
    } catch {
        return saved();
    }
}

async function posted(request: Request, event: FetchEvent): Promise<Response> {
    let key = hashedAddress(request.url, await request.clone().text());
    if (!key) return fetch(request);
    let saved = async () => {
        let hit = await (await caches.open(API)).match(key!);
        if (hit) event.waitUntil(tell(event, "kept"));
        return hit;
    };
    let response: Response;
    try {
        response = await fetch(request);
    } catch (e) {
        let hit = await saved();
        if (hit) return hit;
        throw e;
    }
    let text = await response.text();
    let type = response.headers.get("content-type");
    if (!worthKeeping(response.status, type, text)) {
        let hit = await saved();
        if (hit) return hit;
    } else {
        let copy = new Response(text, { headers: { "content-type": type ?? "application/json" } });
        event.waitUntil(keep(key, copy).then(() => tell(event, "fresh")));
    }
    return new Response(text, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    });
}

sw.addEventListener("fetch", (event) => {
    let request = event.request;
    let url = new URL(request.url);
    if (
        request.method == "POST" &&
        url.origin != sw.location.origin &&
        url.pathname == "/graphql" &&
        !url.search
    ) {
        event.respondWith(posted(request, event));
        return;
    }
    if (url.origin == sw.location.origin && request.method == "GET" && staticKept(url.pathname)) {
        event.respondWith(kept(request, false));
        return;
    }
    switch (kindOf(request.method, url, request.mode == "navigate", sw.location.origin)) {
        case "immutable":
            event.respondWith(kept(request, true));
            break;
        case "page":
            event.respondWith(page(request, event));
            break;
        case "api":
            event.respondWith(api(request, event));
            break;
    }
});
