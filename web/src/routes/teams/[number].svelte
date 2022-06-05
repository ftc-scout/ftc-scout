<script context="module" lang="ts">
    import { page } from "$app/stores";
    import {
        TeamDocument,
        type TeamQuery,
    } from "$lib/graphql/generated/graphql-operations";
    import { query, type OperationStore } from "@urql/svelte";
    import { queryLoad } from "../../lib/graphql/query-load";

    export const load = queryLoad("team", TeamDocument, ({ params }) => ({
        number: +params.number,
    }));
</script>

<script lang="ts">
    export let team: OperationStore<TeamQuery>;
    query(team);
</script>

{$page.params.number}
{#if !$team?.data?.teamByNumber}
    That team doesn't exist
{:else}
    <!-- Add goto command for team search and remove hudson block -->
    {$team.data.teamByNumber?.name}
{/if}
