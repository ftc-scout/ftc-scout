import { env } from "$env/dynamic/public";
import { browser } from "$app/environment";
import type { AfterNavigate } from "@sveltejs/kit";

const ANALYTICS_URL = "http://" + env.PUBLIC_SERVER_ORIGIN! + "/analytics";

let lastPath = "";
let lastRest = "";
let sessionId = crypto.randomUUID();
let timeout: NodeJS.Timeout;

export function sendAnalyticsRequest(navigate: AfterNavigate) {
    if (!browser) return;

    let toUrl = navigate.to?.url;
    if (!toUrl) return;
    let fromUrl = navigate.from?.url;

    let path = toUrl.pathname;
    let rest = toUrl.search + toUrl.hash;

    let payload = {
        url: path + rest,
        from: fromUrl ? fromUrl.pathname + fromUrl.search + fromUrl.hash : null,
        time: Date.now(),
        pathChanged: lastPath != path,
        sessionId: sessionId,
    };

    if (lastPath != path) {
        navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(payload));
        lastPath = path;
        lastRest = rest;
    } else if (lastRest != rest) {
        clearTimeout(timeout);
        timeout = setTimeout(
            () => navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(payload)),
            500
        );
        lastRest = rest;
    }
}
