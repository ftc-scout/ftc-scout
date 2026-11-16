import type { Handle, HandleServerError } from "@sveltejs/kit";
import { THEME_COOKIE_NAME, UNREACHABLE, isUnreachable } from "./lib/constants";

export const handle: Handle = async ({ event, resolve }) => {
    let theme = "system";
    try {
        let cookieVal = event.cookies.get(THEME_COOKIE_NAME);
        theme = JSON.parse(cookieVal ?? "").preference ?? "system";
    } catch {}

    let response = await resolve(event, {
        filterSerializedResponseHeaders: (name) => ["content-type"].indexOf(name) != -1,
        transformPageChunk: ({ html }) => html.replace("%theme%", `class="${theme}"`),
    });

    return response;
};

export const handleError: HandleServerError = ({ error }) => {
    if (isUnreachable(error)) return { message: UNREACHABLE };
    console.error(error);
    return { message: "Internal Error" };
};
