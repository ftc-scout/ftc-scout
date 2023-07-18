<script lang="ts">
    import type { ApolloQueryResult } from "@apollo/client";
    import Skeleton from "./skeleton/Skeleton.svelte";

    type T = $$Generic;

    export let store: ApolloQueryResult<T> | null;
    export let checkExists: (_: T) => boolean;
</script>

{#if !store}
    <slot name="loading">
        <Skeleton />
    </slot>
{:else if store?.data && !checkExists(store.data)}
    <slot name="error" />
{:else}
    <slot />
{/if}
