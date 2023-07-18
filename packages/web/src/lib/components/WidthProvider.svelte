<script lang="ts" context="module">
    export const REQUESTED_WIDTH = {};
</script>

<script lang="ts">
    import { setContext } from "svelte";
    import { writable } from "svelte/store";

    export let width = "1000px";

    let requestedWidth = writable(width);
    $: $requestedWidth = width;
    setContext(REQUESTED_WIDTH, requestedWidth);
</script>

<slot />
