<script lang="ts">
    import type { EventPageMatchFragment } from "../../graphql/generated/graphql-operations";
    import { sortStation } from "../../util/station-ordering";
    import MatchScore from "./MatchScore.svelte";
    import MatchTeam from "./MatchTeam.svelte";

    export let match: EventPageMatchFragment;
    // export let scores: FullMatchScores2021TraditionalFragment;
    export let scores: {
        red: { totalPoints: number };
        blue: { totalPoints: number };
    };

    $: sortedTeams = match.teams.sort((a, b) =>
        sortStation(a.station, b.station)
    );
    let winner: "RED" | "BLUE" | "TIE";
    $: winner =
        scores.red.totalPoints > scores.blue.totalPoints
            ? "RED"
            : scores.blue.totalPoints > scores.red.totalPoints
            ? "BLUE"
            : "TIE";
</script>

<td
    style:width="4.5em"
    class:red={winner == "RED"}
    class:blue={winner == "BLUE"}
    class:tie={winner == "TIE"}
>
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
        width={`calc((100% - 10.75em) / ${match.teams.length})`}
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

    .tie {
        color: var(--color-team-neutral);
    }
</style>
