<script context="module" lang="ts">
    import { queryLoad } from "$lib/graphql/query-load";
    import { GreetDocument } from "$lib/graphql/generated/graphql-operations";

    export const load = queryLoad("greeting", GreetDocument, {
        name: "Daniel",
    });
</script>

<script lang="ts">
    import type { GreetQuery } from "$lib/graphql/generated/graphql-operations";
    import { query, type OperationStore } from "@urql/svelte";

    export let greeting: OperationStore<GreetQuery>;
    query(greeting);

    let name = $greeting.variables.name;
    $: $greeting.variables = { name };
</script>

<h1>From the server: {$greeting?.data?.greet}</h1>
<input bind:value={name} />
