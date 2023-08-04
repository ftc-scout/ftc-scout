<script lang="ts">
    import { getContext } from "svelte";
    import type { Readable } from "svelte/store";
    import { TAB_CONTEXT } from "./TabbedCard.svelte";

    export let name: string;

    let selectedTabStore: Readable<string> = getContext(TAB_CONTEXT);
    $: shouldRender = $selectedTabStore.toLowerCase() == name.toLowerCase();
</script>

{#if shouldRender}
    <slot />
{/if}
