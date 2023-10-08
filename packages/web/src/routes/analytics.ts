import { env } from "$env/dynamic/public";
import { browser } from "$app/environment";
import type { AfterNavigate } from "@sveltejs/kit";

const ANALYTICS_URL = env.PUBLIC_SERVER_ORIGIN! + "/analytics";

let lastUrl = "";
let sessionId = crypto.randomUUID();

export function sendAnalyticsRequest(navigate: AfterNavigate) {
    if (!browser) return;

    let toUrl = navigate.to?.url;
    if (!toUrl) return;
    let fromUrl = navigate.from?.url;

    let payload = {
        url: toUrl.pathname + toUrl.search,
        from: fromUrl ? fromUrl.pathname + fromUrl.search : null,
        time: Date.now(),
        sessionId: sessionId,
    };

    if (lastUrl != payload.url) {
        navigator.sendBeacon(ANALYTICS_URL, JSON.stringify(payload));
        lastUrl = payload.url;
    }
}
