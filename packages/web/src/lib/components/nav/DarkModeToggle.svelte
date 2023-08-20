<script lang="ts" context="module">
    function getSystemColorScheme(): "light" | "dark" {
        return browser
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
            : "light";
    }

    function loadThemePreference(): {
        preference: "system" | "light" | "dark";
        rendered: "light" | "dark";
    } {
        let cookie = browser ? parse(document.cookie)[THEME_COOKIE_NAME] : undefined;
        let parsed = undefined;
        try {
            parsed = JSON.parse(cookie ?? "");
        } catch {}
        return (
            parsed ?? {
                preference: "system" as const,
                rendered: getSystemColorScheme(),
            }
        );
    }

    export let theme = writable(loadThemePreference());

    export let tippyTheme: Readable<"light" | "dark"> = derived(theme, ($theme) =>
        $theme.rendered == "light" ? "dark" : "light"
    );
</script>

<script lang="ts">
    import { serialize, parse } from "cookie";
    import { derived, writable, type Readable } from "svelte/store";
    import Fa from "svelte-fa";
    import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
    import { THEME_COOKIE_AGE, THEME_COOKIE_NAME } from "../../constants";
    import { browser } from "$app/environment";

    function handleThemeChange(newTheme: typeof $theme) {
        if (!browser) return;

        document.body.classList.remove("dark");
        document.body.classList.remove("light");
        document.body.classList.remove("system");
        document.body.classList.add(newTheme.preference);

        document.cookie = serialize(THEME_COOKIE_NAME, JSON.stringify(newTheme), {
            path: "/",
            maxAge: THEME_COOKIE_AGE,
            httpOnly: false,
        });
    }

    function setTheme(next: "light" | "dark") {
        $theme = {
            preference: getSystemColorScheme() == next ? ("system" as const) : next,
            rendered: next,
        };
        handleThemeChange($theme);
    }
</script>

<form method="POST" action="/toggle-theme">
    <button
        class="render-light"
        name="currTheme"
        value="light"
        on:click|preventDefault={() => setTheme("dark")}
    >
        <Fa icon={faMoon} fw size="1.25x" translateX="-0.25" style="font-size: 24px" />
    </button>

    <button
        class="render-dark"
        name="currTheme"
        value="dark"
        on:click|preventDefault={() => setTheme("light")}
    >
        <Fa icon={faSun} fw size="1.25x" translateX="-0.25" style="font-size: 24px" />
    </button>
</form>

<style>
    button {
        padding: 0;
        border: none;
        background: none;
        color: var(--theme-text-color);

        cursor: pointer;
    }
</style>
