<script lang="ts">
    import { getContext } from "svelte";
    import { REQUESTED_WIDTH } from "./WidthProvider.svelte";
    import type { Readable } from "svelte/store";

    export let style = "";

    let requestedWidth: Readable<string> = getContext(REQUESTED_WIDTH);
    $: minWidth = `min(${$requestedWidth}, 100% - 2 * var(--lg-gap))`;
</script>

<div style:min-width={minWidth} {style}>
    <slot />
</div>

<style>
    div {
        background-color: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 8px;

        padding: var(--lg-pad);
        margin: var(--lg-gap) auto;
        margin-bottom: var(--vl-gap);

        position: relative;
        width: min-content;
        max-width: calc(100% - 2 * var(--lg-gap));
    }
</style>
