<script context="module" lang="ts">
    import { customCreateClient } from "$lib/graphql/client";
    import {
        operationStore,
        type OperationContext,
        type OperationStore,
        type TypedDocumentNode,
    } from "@urql/svelte";
    import type { Load } from "@sveltejs/kit";

    export const load: Load = async function ({ fetch, stuff }) {
        const client = customCreateClient(fetch);

        return {
            stuff: {
                ...stuff,
                client,
                query: async (
                    query: string | DocumentNode | TypedDocumentNode<any, any>,
                    variables?: any,
                    context?: Partial<OperationContext & { pause: boolean }>
                ): Promise<OperationStore> => {
                    const store = operationStore(query, variables, context);
                    const result = await client
                        .query(store.query, store.variables, store.context)
                        .toPromise();
                    Object.assign(get(store), result);
                    return store;
                },
            },
            props: { client },
        };
    };
</script>

<script lang="ts">
    import type { Client } from "@urql/svelte";
    import { setClient } from "@urql/svelte";
    import type { DocumentNode } from "graphql";
    import { get } from "svelte/store";

    export let client: Client;
    setClient(client);
</script>

<slot />

<style>
    :global(:root) {
        --theme-color: #2c666e;
        font-family: sans-serif;
    }
</style>
