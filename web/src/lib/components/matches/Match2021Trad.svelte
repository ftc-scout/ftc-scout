<script lang="ts">
    import type {
        EventPageMatchFragment,
        FullMatchScores2021TraditionalFragment,
    } from "../../graphql/generated/graphql-operations";
    import { sortStation } from "../../util/station-ordering";
    import MatchScore from "./MatchScore.svelte";
    import MatchTeam from "./MatchTeam.svelte";

    export let match: EventPageMatchFragment;
    export let scores: FullMatchScores2021TraditionalFragment;

    $: sortedTeams = match.teams.sort((a, b) =>
        sortStation(a.station, b.station)
    );
    let winner: "RED" | "BLUE";
    $: winner =
        scores.red.totalPoints > scores.blue.totalPoints ? "RED" : "BLUE";
</script>

<td style:width="7ch" class:red={winner == "RED"} class:blue={winner == "BLUE"}>
    <strong>{match.matchDescription}</strong>
</td>

<MatchScore
    red={scores.red.totalPoints}
    blue={scores.blue.totalPoints}
    {winner}
/>

{#each sortedTeams as team}
    <MatchTeam
        {team}
        width={`calc((100% - 17ch) / ${match.teams.length})`}
        winner={team.station.startsWith(winner)}
    />
{/each}

<style>
    td {
        display: inline-block;
        padding-left: var(--gap);
    }

    .red {
        color: var(--color-team-red);
    }

    .blue {
        color: var(--color-team-blue);
    }
</style>
