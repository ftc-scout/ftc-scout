<script lang="ts">
    import MaxWidth from "./MaxWidth.svelte";
    import Skeleton from "./skeleton/Skeleton.svelte";
    import type { ApolloQueryResult } from "@apollo/client";

    export let store: ApolloQueryResult<unknown> | null;
    export let width: string;
    export let doesNotExist: boolean;
</script>

<MaxWidth {width}>
    {#if !store}
        <Skeleton />
    {:else if doesNotExist}
        doesn't exist
    {:else}
        <slot />
    {/if}
</MaxWidth>
