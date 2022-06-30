<script lang="ts">
    import type { OperationStore } from "@urql/svelte";
    import MaxWidth from "./MaxWidth.svelte";
    import Skeleton from "./skeleton/Skeleton.svelte";

    export let store: OperationStore;
    export let width: string;
</script>

<MaxWidth {width}>
    {#if $store.fetching}
        <Skeleton />
    {:else if $store.data == null}
        doesn't exist
    {:else}
        <slot />
    {/if}
</MaxWidth>
