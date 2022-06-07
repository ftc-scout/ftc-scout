<script context="module" lang="ts">
    import { query, type OperationStore } from "@urql/svelte";
    import {
        TeamDocument,
        type TeamQuery,
    } from "../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../lib/graphql/query-load";

    export const load = queryLoad("team", TeamDocument, ({ params }) => ({
        number: +params.number,
    }));
</script>

<script lang="ts">
    export let team: OperationStore<TeamQuery>;
    query(team);
    $: teamData = $team.data?.teamByNumber;
</script>

{#if !teamData}
    That team doesn't exist
{:else}
    <!-- Add goto command for team search and remove hudson block -->
    <h1>{teamData.number}: {teamData.name}</h1>
{/if}
