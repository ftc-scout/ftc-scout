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
    import {
        Client,
        query,
        setClient,
        type OperationStore,
    } from "@urql/svelte";
    import Navbar from "$lib/components/Navbar.svelte";

    export let client: Client;
    setClient(client);

    export let serverError: Writable<Readable<any | undefined>>;
    $: currentServerError = get($serverError);

    export let me: OperationStore<MeQuery>;
    $: meData = $me?.data?.me;
    // It seems that if a subpage queries me then this page inherits the me prop.
    // Thus we need to resubscribe to it each time. Hence this is reactive.
    $: query(me);
</script>

<Navbar {meData} />

{#if currentServerError === undefined}
    <div class="content">
        <slot />
    </div>
{:else}
    <h1>There was an error while contacting the server</h1>
    <pre>{currentServerError}</pre>
{/if}

<style>
    @import "@fontsource/inter/400.css";

    .content {
        margin-top: var(--navbar-size);
        padding: var(--padding);
    }

    :global(:root) {
        /* Colors */
        --background-color: #f5f6f7;
        --foreground-color: #ffffff;
        --theme-color: #2c666e;
        --darkened-theme-color: #225157;

        --text-color: #000000;
        --secondary-text-color: #636466;
        --theme-text-color: #ffffff;

        --error-color: red;

        --shadow-color: #888888;

        /* Fonts */
        --main-font: "Inter", sans-serif;
        --small-font-size: 13px;
        --font-size: 16px;
        --large-font-size: 19px;

        /* Sizes */
        --navbar-size: 60px;

        --small-gap: 4px;
        --medium-hap: 6px;
        --gap: 8px;
        --large-gap: 12px;
        --xl-gap: 32px;

        --small-padding: 4px;
        --ms-padding: 6px;
        --padding: 8px;
        --ml-padding: 10px;
        --large-padding: 12px;

        /* Utility */
        --pill-border-radius: 999999px; /* Using an overly large value produces a pill shape. */
    }

    :global(body) {
        background-color: var(--background-color);

        color: var(--text-color);
        font-family: var(--main-font);
        font-size: var(--defualt-font-size);
    }

    :global(*) {
        box-sizing: border-box;
    }

    :global(h1) {
        font-size: 32px;
        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
    }

    :global(a) {
        text-decoration: none;
    }

    :global(a:hover) {
        text-decoration: underline;
    }
</style>
