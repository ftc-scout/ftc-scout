import type { Handle } from "@sveltejs/kit";
import { IS_PROD } from "./lib/constants";

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    if (IS_PROD) {
        response.headers.set("X-Frame-Options", "SAMEORIGIN");
        response.headers.set("X-XSS-Protection", "1; mode=block");
        response.headers.set("Referrer-Policy", "same-origin");
        response.headers.set("Permissions-Policy", "camera=(), microphone=()");
        let canonical = event.url
            .toString()
            .replace(/^http:/, "https:")
            .replace(/^https:\/\/www./, "https://");
        response.headers.set("Link", `<${canonical}>; rel="canonical"`);
    }

    return response;
};
