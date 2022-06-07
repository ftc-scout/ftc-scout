<script context="module" lang="ts">
    // import {
    //     LogoutDocument,
    //     MeDocument,
    // } from "$lib/graphql/generated/graphql-operations";
    // import { queryLoad } from "$lib/graphql/query-load";

    // export const load = queryLoad("me", MeDocument, {});
</script>

<script lang="ts">
    // import type { MeQuery } from "$lib/graphql/generated/graphql-operations";
    // import { mutation, query, type OperationStore } from "@urql/svelte";

    // export let me: OperationStore<MeQuery>;
    // $: meData = $me.data?.me;
    // query(me);

    // const logoutMutation = mutation({ query: LogoutDocument });

    // async function logout() {
    //     await logoutMutation();
    //     $me.context = {};
    // }
</script>

<h1>Welcome to FTC Scout!</h1>
