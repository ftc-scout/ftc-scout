import { type Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    response.headers.append("Content-Security-Policy", "frame-ancestors 'self'");
    response.headers.append("X-Frame-Options", "SAMEORIGIN");
    response.headers.append("X-XSS-Protection", "1; mode=block");
    return response;
};
