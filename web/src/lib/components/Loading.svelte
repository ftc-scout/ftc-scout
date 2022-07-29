<script lang="ts">
    import WidthProvider from "./WidthProvider.svelte";
    import Skeleton from "./skeleton/Skeleton.svelte";
    import type { ApolloQueryResult } from "@apollo/client";

    export let store: ApolloQueryResult<unknown> | null;
    export let width: string;
    export let doesNotExist: boolean;
</script>

<WidthProvider {width}>
    {#if !store}
        <Skeleton />
    {:else if doesNotExist}
        doesn't exist
    {:else}
        <slot />
    {/if}
</WidthProvider>
