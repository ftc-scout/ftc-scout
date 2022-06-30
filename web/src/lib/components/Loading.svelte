<script lang="ts">
    import type { OperationStore } from "@urql/svelte";

    export let store: OperationStore;
</script>

{#if $store.fetching}
    <!--  -->
{:else if $store.data == null}
    doesn't exist
{:else}
    <slot />
{/if}
