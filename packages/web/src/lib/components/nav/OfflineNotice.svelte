<script lang="ts">
    import { onMount } from "svelte";
    import { beforeNavigate } from "$app/navigation";
    import { page } from "$app/stores";
    import { UNREACHABLE } from "$lib/constants";
    import { kept, navigated } from "$lib/pwa/kept";
    import { keptLine } from "$lib/pwa/shown";

    let offline = false;

    beforeNavigate(navigated);

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

    $: line = keptLine($kept, offline, UNREACHABLE, new Date());
</script>

{#if line && !$page.error}
    <div class="offline" role="status">{line}</div>
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
