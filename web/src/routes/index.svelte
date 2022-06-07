<script context="module" lang="ts">
    import {
        LogoutDocument,
        MeDocument,
    } from "$lib/graphql/generated/graphql-operations";
    import { queryLoad } from "$lib/graphql/query-load";

    export const load = queryLoad("me", MeDocument, {});
</script>

<script lang="ts">
    import type { MeQuery } from "$lib/graphql/generated/graphql-operations";
    import { mutation, query, type OperationStore } from "@urql/svelte";

    export let me: OperationStore<MeQuery>;
    $: meData = $me.data?.me;
    query(me);

    const logoutMutation = mutation({ query: LogoutDocument });

    async function logout() {
        await logoutMutation();
        $me.context = {};
    }
</script>

{#if meData}
    <h1>Logged in as {meData.username}</h1>
    <button on:click={logout}>Log Out</button>
{:else}
    <h1>Logged Out</h1>
    <a href="login">Log In</a>
    <a href="register">Register</a>
{/if}
