<script context="module" lang="ts">
    import { graphqlSetupLoad } from "../lib/graphql/graphql-setup-load";

    export let load = combineLoads(
        graphqlSetupLoad,
        queryLoad("me", MeDocument, {})
    );
</script>

<script lang="ts">
    import { get, type Readable, type Writable } from "svelte/store";
    import { combineLoads } from "../lib/combine-loads";
    import { queryLoad } from "../lib/graphql/query-load";
    import {
        MeDocument,
        type MeQuery,
    } from "../lib/graphql/generated/graphql-operations";
    import type { QueryDataStore } from "../lib/graphql/graphql-data";
    import {
        Client,
        query,
        setClient,
        type OperationStore,
    } from "@urql/svelte";

    export let client: Client;
    setClient(client);

    export let serverError: Writable<Readable<any | undefined>>;
    $: currentServerError = get($serverError);

    export let me: OperationStore<MeQuery>;
    export let meData: QueryDataStore<MeQuery>;
    $: query(me);
</script>

<p>{$meData?.username ? "Logged in as " + $meData.username : "Logged Out"}</p>

{#if currentServerError === undefined}
    <slot />
{:else}
    <h1>There was an error while contacting the server</h1>
    <pre>{currentServerError}</pre>
{/if}

<style>
    :global(:root) {
        font-family: sans-serif;

        --background-color: #f5f6f7;
        --foreground-color: #ffffff;
        --theme-color: #2c666e;

        --text-color: #000000;
        --secondary-text-color: #636466;
    }
</style>
