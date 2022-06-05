<script context="module" lang="ts">
    import { graphqlSetupLoad } from "../lib/graphql/graphql-setup-load";

    export let load = graphqlSetupLoad;
</script>

<script lang="ts">
    import type { Client } from "@urql/svelte";
    import { setClient } from "@urql/svelte";

    export let client: Client;
    setClient(client);
</script>

<slot />

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
