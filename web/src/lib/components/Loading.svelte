<script lang="ts">
    import MaxWidth from "./MaxWidth.svelte";
    import Skeleton from "./skeleton/Skeleton.svelte";
    import type { ApolloQueryResult } from "@apollo/client";

    export let store: ApolloQueryResult<unknown>;
    export let width: string;
    export let doesNotExist: boolean;
</script>

<MaxWidth {width}>
    {#if store.loading}
        <Skeleton />
    {:else if store.data == null || doesNotExist}
        doesn't exist
    {:else}
        <slot />
    {/if}
</MaxWidth>
