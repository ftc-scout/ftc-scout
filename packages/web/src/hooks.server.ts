import type { Handle } from "@sveltejs/kit";
import { THEME_COOKIE_NAME } from "./lib/constants";

export const handle: Handle = async ({ event, resolve }) => {
    let theme = event.cookies.get(THEME_COOKIE_NAME) ?? "system";

    let response = await resolve(event, {
        filterSerializedResponseHeaders: (name) => ["content-type"].indexOf(name) != -1,
        transformPageChunk: ({ html }) => html.replace("%theme%", `class="${theme}"`),
    });

    return response;
};
