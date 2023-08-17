<script lang="ts">
    import { getContext } from "svelte";
    import { REQUESTED_WIDTH } from "./WidthProvider.svelte";
    import type { Readable } from "svelte/store";

    export let style = "";
    export let classList = "";

    let requestedWidth: Readable<string> = getContext(REQUESTED_WIDTH);
</script>

<div style:--requested-width={$requestedWidth} {style} class={classList}>
    <slot />
</div>

<style>
    div {
        position: relative;
        width: min-content;
        max-width: calc(100%);
        min-width: min(var(--requested-width), 100%);
    }
</style>
