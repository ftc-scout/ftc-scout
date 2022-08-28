<script lang="ts">
    import { getContext } from "svelte";
    import type { Readable } from "svelte/store";

    export let border = true;

    let requestedWidth: Readable<string> = getContext("REQUESTED_WIDTH");
    $: minWidth = `min(${$requestedWidth}, 100% - 2 * var(--large-gap))`;
</script>

<div class:card={border} style:min-width={minWidth}>
    <slot />
</div>

<style>
    .card {
        background-color: var(--foreground-color);
        box-shadow: -2px 2px 10px 3px #e0e0e0;
        border-radius: 8px;

        padding: var(--large-padding);
    }

    div {
        margin: var(--large-gap) auto;
        margin-bottom: var(--xl-gap);

        position: relative;

        max-width: calc(100% - 2 * var(--large-gap));
        width: min-content;
    }
</style>
