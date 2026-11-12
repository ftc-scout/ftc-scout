<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { beforeNavigate } from "$app/navigation";

    let offline = false;
    let kept = false; // if data request failed

    beforeNavigate(() => (kept = false));

    onMount(() => {
        let update = () => (offline = !navigator.onLine);
        let told = (e: MessageEvent) => {
            if (e.data?.ftcscout == "kept") kept = true;
            else if (e.data?.ftcscout == "fresh") kept = false;
        };
        update();
        addEventListener("online", update);
        addEventListener("offline", update);
        navigator.serviceWorker?.addEventListener("message", told);
        return () => {
            removeEventListener("online", update);
            removeEventListener("offline", update);
            navigator.serviceWorker?.removeEventListener("message", told);
        };
    });
</script>

{#if (offline || kept) && !$page.error}
    <div class="offline" role="status">
        {offline ? "Offline" : "The server can't be reached"}: now showing old cached data.
    </div>
{/if}

<style>
    .offline {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 50;

        padding: var(--md-pad);
        padding-bottom: calc(var(--md-pad) + env(safe-area-inset-bottom, 0px));

        background: var(--theme-color);
        color: var(--theme-text-color);
        font-size: var(--md-font-size);
        text-align: center;
    }
</style>
