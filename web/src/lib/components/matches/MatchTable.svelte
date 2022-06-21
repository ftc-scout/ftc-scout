<script lang="ts">
    import {
        TournamentLevel,
        type EventPageMatchFragment,
    } from "../../graphql/generated/graphql-operations";
    import Match from "./Match.svelte";
    import MatchTableHeader from "./MatchTableHeader.svelte";
    import SectionRow from "./SectionRow.svelte";

    export let matches: EventPageMatchFragment[];

    $: qualsMatches = matches.filter(
        (m) => m.tournamentLevel == TournamentLevel.Quals
    );
    $: semisMatches = matches.filter(
        (m) => m.tournamentLevel == TournamentLevel.Semis
    );
    $: finalsMatches = matches.filter(
        (m) => m.tournamentLevel == TournamentLevel.Finals
    );
</script>

<table>
    <MatchTableHeader />

    {#if finalsMatches.length}
        <SectionRow level={TournamentLevel.Finals} />
    {/if}

    {#each finalsMatches as match, i}
        {#if match}
            <Match {match} zebraStripe={i % 2 == 1} />
        {/if}
    {/each}

    {#if semisMatches.length}
        <SectionRow level={TournamentLevel.Semis} />
    {/if}

    {#each semisMatches as match, i}
        {#if match}
            <Match {match} zebraStripe={i % 2 == 1} />
        {/if}
    {/each}

    {#if qualsMatches.length && (semisMatches.length || finalsMatches.length)}
        <SectionRow level={TournamentLevel.Quals} />
    {/if}

    {#each qualsMatches as match, i}
        {#if match}
            <Match {match} zebraStripe={i % 2 == 1} />
        {/if}
    {/each}
</table>

<style>
    table {
        border-spacing: 0;
        width: 100%;
        display: block;

        border: 1px solid lightgray;
        clip-path: inset(0 0 0 0 round 8px);
    }
</style>
