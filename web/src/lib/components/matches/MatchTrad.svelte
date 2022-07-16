<script lang="ts">
    import type {
        EventPageMatchFragment,
        FullMatchScores2021TraditionalFragment,
    } from "../../graphql/generated/graphql-operations";
    import { sortStation } from "../../util/station-ordering";
    import MatchScore from "./MatchScore.svelte";
    import MatchTeam from "./MatchTeam.svelte";

    export let match: EventPageMatchFragment;
    export let selectedTeam: number | null = null;
    export let zebraStripe: boolean;
    export let frozen = false;
    export let showScoresFn: ((_: EventPageMatchFragment) => void) | null =
        null;

    $: scores = match.scores as FullMatchScores2021TraditionalFragment;
    $: sortedTeams = [...match.teams].sort((a, b) =>
        sortStation(a.station, b.station)
    );
    let winner: "RED" | "BLUE" | "TIE";
    $: winner =
        scores.red.totalPoints > scores.blue.totalPoints
            ? "RED"
            : scores.blue.totalPoints > scores.red.totalPoints
            ? "BLUE"
            : "TIE";

    function show() {
        if (showScoresFn) showScoresFn(match);
    }
</script>

<tr class:zebra-stripe={zebraStripe}>
    <!-- <MatchDescription {winner} description={match.matchDescription} /> -->

    <MatchScore
        red={scores.red.totalPoints}
        blue={scores.blue.totalPoints}
        {winner}
        description={match.matchDescription}
        on:click={show}
    />

    {#each sortedTeams as team}
        <MatchTeam
            {team}
            width={`calc((100% - 10.75em) / ${match.teams.length})`}
            winner={team.station.startsWith(winner)}
            bind:selectedTeam
            {frozen}
        />
    {/each}
</tr>

<style>
    tr {
        display: table;
        table-layout: fixed;
        width: 100%;
        max-width: 100%;
        min-width: 100%;
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }
</style>
