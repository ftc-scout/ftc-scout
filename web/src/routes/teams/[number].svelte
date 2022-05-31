<script context="module" lang="ts">
    import { page } from "$app/stores";
    import {
        TeamDocument,
        type TeamQuery,
    } from "$lib/graphql/generated/graphql-operations";
    import type { Load } from "@sveltejs/kit";
    import { query, type OperationStore } from "@urql/svelte";

    export const load: Load = async function load({ stuff, params }) {
        return {
            props: {
                team: await stuff.query!(
                    TeamDocument,
                    { number: +(params.number) },
                    undefined
                ),
            },
        };
    };
</script>

<script lang="ts">
    export let team: OperationStore<TeamQuery>;
    query(team);
</script>

{$page.params.number}
{#if !$team?.data?.teamByNumber || $page.params.number == "18253"}
    That team doesn't exist
{:else}
    {$team.data.teamByNumber?.name}
{/if}
