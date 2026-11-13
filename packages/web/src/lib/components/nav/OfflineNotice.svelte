<script lang="ts">
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { kept } from "$lib/pwa/kept";

    let offline = false;

    onMount(() => {
        let update = () => (offline = !navigator.onLine);
        update();
        addEventListener("online", update);
        addEventListener("offline", update);
        return () => {
            removeEventListener("online", update);
            removeEventListener("offline", update);
        };
    });
</script>

{#if (offline || $kept) && !$page.error}
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
