<script context="module" lang="ts">
    import { graphqlSetupLoad } from "../lib/graphql/graphql-setup-load";

    export let load = graphqlSetupLoad;
</script>

<script lang="ts">
    import type { Client } from "@urql/svelte";
    import { setClient } from "@urql/svelte";
    import { get, type Readable, type Writable } from "svelte/store";

    export let client: Client;
    setClient(client);

    export let serverError: Writable<Readable<any | undefined>>;
    $: currentServerError = get($serverError);
</script>

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
