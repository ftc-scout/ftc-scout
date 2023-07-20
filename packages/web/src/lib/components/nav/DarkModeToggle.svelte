<script lang="ts" context="module">
    import { derived, writable, type Readable, type Writable } from "svelte/store";

    export let currentTheme: Writable<"light" | "dark"> = writable("light");
    export let tippyTheme: Readable<"light" | "dark"> = derived(currentTheme, ($currentTheme) =>
        $currentTheme == "light" ? "dark" : "light"
    );
</script>

<script lang="ts">
    function toggle() {
        $currentTheme = $currentTheme == "light" ? "dark" : "light";

        if ($currentTheme == "light") {
            document.body.classList.remove("dark");
        } else {
            document.body.classList.add("dark");
        }
    }
</script>

<button on:click={toggle}> Toggle Dark Mode </button>
