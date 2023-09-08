<script lang="ts">
    import { Alliance, type FullMatchFragment } from "../../graphql/generated/graphql-operations";
    import { sortTeams } from "../../util/sorters";
    import MatchScore, { computeWinner } from "./MatchScore.svelte";
    import MatchTeam from "./MatchTeam.svelte";
    import PlaceholderMatchTeam from "./PlaceholderMatchTeam.svelte";

    export let match: FullMatchFragment;
    export let eventCode: string;
    export let season: number;
    export let timeZone: string;
    export let focusedTeam: number | null;
    export let zebraStripe: boolean;

    $: teams = match.teams;
    $: redTeams = teams.filter((t) => t.alliance == Alliance.Red);
    $: blueTeams = teams.filter((t) => t.alliance == Alliance.Blue);

    $: redExtras = Array(Math.max(2 - redTeams.length, 0)).fill(Alliance.Red);
    $: reds = [...redTeams, ...redExtras].sort(sortTeams);
    $: blueExtras = Array(Math.max(2 - blueTeams.length, 0)).fill(Alliance.Blue);
    $: blues = [...blueTeams, ...blueExtras].sort(sortTeams);

    $: winner = computeWinner(match.scores);
</script>

<tr class:zebraStripe>
    <MatchScore {match} {timeZone} />

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

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 9.75em repeat(12, 1fr);
        }
    }

    .zebraStripe {
        background: var(--zebra-stripe-color);
    }
</style>
