import { redirect, type Actions } from "@sveltejs/kit";
import { THEME_COOKIE_AGE, THEME_COOKIE_NAME } from "../../lib/constants";

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        let data = await request.formData();
        let currentTheme = data.get("currTheme");
        let nextTheme = currentTheme == "light" ? "dark" : "light";
        cookies.set(THEME_COOKIE_NAME, nextTheme, { maxAge: THEME_COOKIE_AGE });

        throw redirect(301, request.headers.get("referer") ?? "/");
    },
};
