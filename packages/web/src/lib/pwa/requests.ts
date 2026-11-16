// The page that gets rendered if offline
export const SHELL = "/offline";

// Dont prefetch, because BIG
const ON_DEMAND = /draco|basis_transcoder|\.wasm$/;

export function keptFromTheStart(file: string): boolean {
    return !ON_DEMAND.test(file);
}

export function staticKept(file: string): boolean {
    if (/^\/head\/banner\./.test(file)) return false;
    return /^\/(css|head)\//.test(file) || /^\/img\/[^/]+\.svg$/.test(file);
}

export type Kind = "page" | "immutable" | "api" | "other";

/**
 * `navigate`: the browser is opening a page (not the site's own code fetching something).
 * `origin`: the site's.
 */
export function kindOf(method: string, url: URL, navigate: boolean, origin: string): Kind {
    if (method != "GET") return "other";
    if (url.origin == origin) {
        if (url.pathname.startsWith("/_app/immutable/")) return "immutable";
        if (navigate && !/\.[a-z0-9]+$/i.test(url.pathname) && url.pathname != "/toggle-theme") {
            return "page";
        }
        return "other";
    }
    // Post graphql queries are handled before kindOf()
    if (url.pathname == "/graphql") return url.search ? "api" : "other";
    if (url.pathname.startsWith("/rest/v1/")) return "api";
    return "other";
}

export function worthKeeping(status: number, contentType: string | null, body: string): boolean {
    if (status != 200 || !/json/i.test(contentType ?? "")) return false;
    try {
        let answer = JSON.parse(body);
        if (answer == null || typeof answer != "object" || answer.data == null) return false;
        return answer.errors == null || (Array.isArray(answer.errors) && !answer.errors.length);
    } catch {
        return false;
    }
}

export function asksForQuery(body: string): boolean {
    return /PERSISTED_QUERY_NOT_FOUND|PersistedQueryNotFound/.test(body.slice(0, 500));
}

/* Creates the hashed address for a persistent query from a post request
 * Makes it so a persistent query request is also cached from a post query.
 * https://api…/graphql?operationName=Team&variables=%7B%22number%22%3A123%7D&extensions=%7B%22persistedQuery%22%3A…%
 */
export function hashedAddress(url: string, body: string): string | null {
    try {
        let sent = JSON.parse(body);
        if (typeof sent?.extensions?.persistedQuery?.sha256Hash != "string") return null;
        let parts: string[] = [];
        if (sent.operationName) {
            parts.push(`operationName=${encodeURIComponent(sent.operationName)}`);
        }
        if (sent.variables) {
            parts.push(`variables=${encodeURIComponent(JSON.stringify(sent.variables))}`);
        }
        parts.push(`extensions=${encodeURIComponent(JSON.stringify(sent.extensions))}`);
        return `${url.split("#")[0]}${url.includes("?") ? "&" : "?"}${parts.join("&")}`;
    } catch {
        return null;
    }
}

export type Inlined = { url: string; status: number; contentType: string; body: string };

const INLINED =
    /<script type="application\/json" data-sveltekit-fetched data-url="([^"]*)"[^>]*>([\s\S]*?)<\/script>/g;

/**
 * Extracts ssr api requests
 */
export function inlinedAnswers(html: string): Inlined[] {
    let out: Inlined[] = [];
    for (let [, rawUrl, json] of html.matchAll(INLINED)) {
        try {
            let answer = JSON.parse(json);
            if (typeof answer.body != "string") continue;
            out.push({
                url: rawUrl.replace(/&quot;/g, '"').replace(/&amp;/g, "&"),
                status: answer.status,
                contentType: answer.headers?.["content-type"] ?? "application/json",
                body: answer.body,
            });
        } catch {}
    }
    return out;
}
