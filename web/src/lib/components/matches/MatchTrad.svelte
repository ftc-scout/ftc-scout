<script lang="ts">
    import {
        Station,
        type EventPageMatchFragment,
        type FullMatchScores2021TraditionalFragment,
    } from "../../graphql/generated/graphql-operations";
    import MatchScore from "./MatchScore.svelte";
    import MatchTeam from "./MatchTeam.svelte";
    import PlaceholderMatchTeam from "./PlaceholderMatchTeam.svelte";

    export let match: EventPageMatchFragment;
    export let selectedTeam: number | null = null;
    export let zebraStripe: boolean;
    export let frozen = false;
    export let showScoresFn: ((_: EventPageMatchFragment) => void) | null = null;
    export let eventCode: string;

    $: scores = match.scores as FullMatchScores2021TraditionalFragment;
    // $: sortedTeams = [...match.teams].sort((a, b) => sortStation(a.station, b.station));
    $: sortedTeams = [
        match.teams.find((t) => t.station == Station.Red_1) ?? "red",
        match.teams.find((t) => t.station == Station.Red_2) ?? "red",
        match.teams.find((t) => t.station == Station.Red_3),
        match.teams.find((t) => t.station == Station.Blue_1) ?? "blue",
        match.teams.find((t) => t.station == Station.Blue_2) ?? "blue",
        match.teams.find((t) => t.station == Station.Blue_3),
    ].filter((t) => t);
    let winner: "RED" | "BLUE" | "TIE" | "X";
    $: winner = scores
        ? scores.red.totalPoints > scores.blue.totalPoints
            ? "RED"
            : scores.blue.totalPoints > scores.red.totalPoints
            ? "BLUE"
            : "TIE"
        : "X";

    $: width = `calc((100% - 10.75em) / ${match.teams.length})`;

    function show() {
        if (showScoresFn && scores) showScoresFn(match);
    }
</script>

<tr class:zebra-stripe={zebraStripe}>
    <MatchScore {match} description={match.matchDescription} on:click={show} />

    {#each sortedTeams as team}
        {#if team == "red" || team == "blue"}
            <PlaceholderMatchTeam {width} color={team} />
        {:else if typeof team == "object"}
            <MatchTeam {team} {width} winner={team.station.startsWith(winner)} bind:selectedTeam {frozen} {eventCode} />
        {/if}
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
