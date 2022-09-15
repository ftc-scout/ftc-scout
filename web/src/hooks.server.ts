import type { Handle } from "@sveltejs/kit";
import { IS_PROD } from "./lib/constants";

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    if (IS_PROD) {
        response.headers.append("X-Frame-Options", "SAMEORIGIN");
        response.headers.append("X-XSS-Protection", "1; mode=block");
        let canonical = event.url.toString().replace(/^https:\/\/www./, "https://");
        response.headers.set("Link", `<${canonical}>; rel="canonical"`);
    }

    return response;
};
