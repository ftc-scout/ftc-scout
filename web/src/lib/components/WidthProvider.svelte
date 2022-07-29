<script lang="ts">
    import { setContext } from "svelte";

    import { writable } from "svelte/store";

    export let width: string;

    let requestedWidth = writable(width);
    $: $requestedWidth = width;
    setContext("REQUESTED_WIDTH", requestedWidth);
</script>

<slot />
