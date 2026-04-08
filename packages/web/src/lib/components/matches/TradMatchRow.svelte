<script lang="ts">
    import {
        Alliance,
        TournamentLevel,
        type FullMatchFragment,
    } from "../../graphql/generated/graphql-operations";
    import { sortTeams } from "../../util/sorters";
    import DeLives from "./DELives.svelte";
    import MatchScore, { computeWinner } from "./MatchScore.svelte";
    import MatchTeam from "./MatchTeam.svelte";
    import PlaceholderMatchTeam from "./PlaceholderMatchTeam.svelte";

    export let match: FullMatchFragment;
    export let eventCode: string;
    export let season: number;
    export let timeZone: string;
    export let focusedTeam: number | null;
    export let zebraStripe: boolean;
    export let teamCount = 0;
    export let showNonPenaltyScores = false;

    $: teams = match.teams;
    $: redTeams = teams.filter((t) => t.alliance == Alliance.Red);
    $: blueTeams = teams.filter((t) => t.alliance == Alliance.Blue);

    $: redExtras = Array(Math.max(2 - redTeams.length, 0)).fill(Alliance.Red);
    $: reds = [...redTeams, ...redExtras].sort(sortTeams);
    $: blueExtras = Array(Math.max(2 - blueTeams.length, 0)).fill(Alliance.Blue);
    $: blues = [...blueTeams, ...blueExtras].sort(sortTeams);

    $: isDoubleElim = match.tournamentLevel == TournamentLevel.DoubleElim;
    $: isNewRound = isDoubleElim && checkIsNewRound(match.series, match.matchNum, teamCount);

    $: winner = computeWinner(match.scores);

    function hasAlreadyLost(series: number, teamCount: number, alliance: Alliance): boolean {
        if (teamCount <= 10) {
            return false;
        } else if (teamCount <= 20) {
            return (
                series == 3 ||
                series == 5 ||
                (series == 6 && alliance == Alliance.Blue) ||
                series == 7
            );
        } else if (teamCount <= 40) {
            return (
                series == 5 ||
                series == 6 ||
                series == 8 ||
                series == 9 ||
                (series == 10 && alliance == Alliance.Blue) ||
                series == 11
            );
        } else {
            return (
                series == 5 ||
                series == 6 ||
                series == 9 ||
                series == 10 ||
                series == 12 ||
                series == 13 ||
                (series == 14 && alliance == Alliance.Blue) ||
                series == 15
            );
        }
    }

    function checkIsNewRound(series: number, matchNum: number, teamCount: number): boolean {
        if (matchNum != 1) {
            return false;
        }

        if (teamCount <= 10) {
            return false;
        } else if (teamCount <= 20) {
            return series == 3 || series == 5 || series == 6;
        } else if (teamCount <= 40) {
            return series == 3 || series == 5 || series == 7 || series == 9 || series == 10;
        } else {
            return series == 5 || series == 9 || series == 11 || series == 13 || series == 14;
        }
    }
</script>

<tr class:zebraStripe class:isDoubleElim class:new-round={isNewRound}>
    <MatchScore {match} {timeZone} {showNonPenaltyScores} />

    {#if isDoubleElim}
        <DeLives
            alliance={Alliance.Red}
            alreadyLost={hasAlreadyLost(match.series, teamCount, Alliance.Red)}
            lostThis={winner == Alliance.Blue}
        />
    {/if}

    {#each reds as team}
        {#if team == Alliance.Red}
            <PlaceholderMatchTeam alliance={team} span={6 / reds.length} />
        {:else}
            <MatchTeam
                {team}
                {eventCode}
                {season}
                {focusedTeam}
                winner={winner == Alliance.Red}
                span={6 / reds.length}
            />
        {/if}
    {/each}

    {#if isDoubleElim}
        <DeLives
            alliance={Alliance.Blue}
            alreadyLost={hasAlreadyLost(match.series, teamCount, Alliance.Blue)}
            lostThis={winner == Alliance.Red}
        />
    {/if}

    {#each blues as team}
        {#if team == Alliance.Blue}
            <PlaceholderMatchTeam alliance={team} span={6 / blues.length} />
        {:else}
            <MatchTeam
                {team}
                {eventCode}
                {season}
                {focusedTeam}
                winner={winner == Alliance.Blue}
                span={6 / blues.length}
            />
        {/if}
    {/each}
</tr>

<style>
    tr {
        display: grid;
        grid-template-columns: 10.75em repeat(12, 1fr);

        min-height: 28px;
    }

    tr.isDoubleElim {
        grid-template-columns: 10.75em auto repeat(6, 1fr) auto repeat(6, 1fr);
    }

    tr.new-round {
        border-top: 1px solid var(--sep-color);
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 9.75em repeat(12, 1fr);
        }

        tr.isDoubleElim {
            grid-template-columns: 9.75em auto repeat(6, 1fr) auto repeat(6, 1fr);
        }
    }

    .zebraStripe {
        background: var(--zebra-stripe-color);
    }
</style>
