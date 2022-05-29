<script context="module" lang="ts">
    import {
        HelloDocument,
        type HelloQuery,
    } from "$lib/graphql/generated/graphql-operations";
    import { queryLoad } from "$lib/graphql/query-load";
    import type { OperationStore } from "@urql/svelte";

    export const load = queryLoad("salutations", HelloDocument, {});
</script>

<script lang="ts">
    export let salutations: OperationStore<HelloQuery>;
</script>
{$salutations.data?.helloWorld}