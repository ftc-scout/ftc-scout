<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { THEME_COOKIE_NAME, UNREACHABLE } from "$lib/constants";
    import ErrorPage from "$lib/components/ErrorPage.svelte";

    const TRIED = "offline-tried";
    let here = false;
    let unknown = false;
    let online = true;

    function tried(address: string): boolean {
        try {
            let was = sessionStorage.getItem(TRIED) == address;
            if (was) sessionStorage.removeItem(TRIED);
            else sessionStorage.setItem(TRIED, address);
            return was;
        } catch {
            return true;
        }
    }

    function applyTheme() {
        try {
            let cookie = document.cookie.match(
                new RegExp("(?:^|; )" + THEME_COOKIE_NAME + "=([^;]*)")
            );
            let preference = cookie && JSON.parse(decodeURIComponent(cookie[1])).preference;
            if (preference == "light" || preference == "dark" || preference == "system") {
                document.body.className = preference;
            }
        } catch {}
    }

    onMount(() => {
        applyTheme();
        online = navigator.onLine;
        let address = location.pathname + location.search;
        if (location.pathname == "/offline") here = true;
        else if (tried(address)) unknown = true;
        else {
            goto(address + location.hash, { replaceState: true }).then(() => {
                try {
                    sessionStorage.removeItem(TRIED);
                } catch {}
            });
        }
    });
</script>

<svelte:head>
    <meta name="robots" content="noindex" />
</svelte:head>

{#if here}
    <ErrorPage status={404} message="Not Found" />
{:else if unknown}
    <ErrorPage message={online ? UNREACHABLE : null} />
{/if}
