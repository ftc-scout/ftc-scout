import type { Handle } from "@sveltejs/kit";
import { IS_PROD } from "./lib/constants";

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);

    if (IS_PROD) {
        response.headers.append("X-Frame-Options", "SAMEORIGIN");
        response.headers.append("X-XSS-Protection", "1; mode=block");
        response.headers.append(
            "Content-Security-Policy",
            "default-src 'self' ftc-scout-server.fly.dev www.google-analytics.com; script-src 'self' 'unsafe-inline' www.googletagmanager.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; img-src 'self' fonts.googleapis.com; font-src 'self' fonts.gstatic.com fonts.googleapis.com; frame-ancestors 'self'; upgrade-insecure-requests"
        );

        let canonical = event.url.toString().replace(/^https:\/\/www./, "https://");
        response.headers.set("Link", `<${canonical}>; rel="canonical"`);
    }

    return response;
};
