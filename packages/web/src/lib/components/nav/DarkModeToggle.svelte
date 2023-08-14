<script lang="ts" context="module">
    import { derived, writable, type Readable, type Writable } from "svelte/store";
    import Fa from "svelte-fa";
    import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
    export let currentTheme: Writable<"light" | "dark"> = writable("light");
    export let tippyTheme: Readable<"light" | "dark"> = derived(currentTheme, ($currentTheme) =>
        $currentTheme == "light" ? "dark" : "light"
    );
</script>

<script lang="ts">
    var currentIcon = faSun;

    function toggle() {
        $currentTheme = $currentTheme == "light" ? "dark" : "light";
        currentIcon = $currentTheme == "light" ? faSun : faMoon;

        if ($currentTheme == "light") {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }
    }
</script>

<button on:click={toggle}>
    <Fa icon={currentIcon} fw size="1.25x" translateX="-0.25" style="font-size: 24px" />
</button>

<style>
    button {
        padding: 0;
        border: none;
        background: none;
        color: var(--theme-text-color);
    }

    @media (max-width: 800px) {
        span {
            display: none;
        }
    }
</style>
