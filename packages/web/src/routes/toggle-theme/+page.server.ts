import { redirect, type Actions } from "@sveltejs/kit";
import { THEME_COOKIE_AGE, THEME_COOKIE_NAME } from "../../lib/constants";

export const actions: Actions = {
    default: async ({ cookies, request }) => {
        let data = await request.formData();
        let currentTheme = data.get("currTheme");
        let nextTheme = currentTheme == "light" ? "dark" : "light";

        let currentPreference = "system";
        try {
            let val = cookies.get(THEME_COOKIE_NAME);
            currentPreference = JSON.parse(val ?? "")?.preference ?? "system";
        } catch {}
        let userPreferredColorScheme = currentPreference == "system" ? currentTheme : nextTheme;
        let nextPreference = userPreferredColorScheme == nextTheme ? "system" : nextTheme;

        cookies.set(
            THEME_COOKIE_NAME,
            JSON.stringify({
                preference: nextPreference,
                rendered: nextTheme,
            }),
            { maxAge: THEME_COOKIE_AGE, httpOnly: false }
        );

        throw redirect(301, request.headers.get("referer") ?? "/");
    },
};
