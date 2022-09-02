<script lang="ts">
    import type { EventPageMatchFragment } from "../../graphql/generated/graphql-operations";
    import MatchTeam from "./MatchTeam.svelte";

    export let matches: EventPageMatchFragment[];
    export let zebraStripe: boolean;
    export let selectedTeam: number | null;
    export let frozen = false;
    export let showScoresFn: ((_: EventPageMatchFragment) => void) | null = null;
    export let eventCode: string;

    $: team = matches[0].teams[0];
    $: noShows = matches.map((m) => m.teams[0].noShow);
    $: scores = matches.map((m) => (m.scores as any)?.totalPoints);
    $: totalPoints = scores.reduce((a, b) => a + b, 0);

    $: notReported = matches.some((m) => !m.scores);

    function show(scores: EventPageMatchFragment) {
        if (showScoresFn && !scores.teams[0].noShow) showScoresFn(scores);
    }
</script>

<tr class:zebra-stripe={zebraStripe} class:scores-row={!notReported} class:not-reported={notReported}>
    <MatchTeam {team} width="" winner={false} border bind:selectedTeam {frozen} {eventCode} />

    {#if !notReported}
        {#each scores as score, i}
            <td class:score={!noShows[i]} on:click={() => show(matches[i])}>
                {#if !noShows[i]}
                    {score}
                {/if}
            </td>
        {/each}

        <td class="total">{totalPoints}</td>
    {:else}
        <td colspan="7">Scores have not yet been reported.</td>
    {/if}
</tr>

<style>
    tr {
        display: grid;

        width: 100%;
        max-width: 100%;
        min-width: 100%;

        min-height: 28px;
    }

    .scores-row {
        grid-template-columns: minmax(0, 3fr) repeat(7, minmax(0, 1fr));
    }

    @media (max-width: 1000px) {
        .scores-row {
            grid-template-columns: minmax(0, 1.5fr) repeat(7, minmax(0, 1fr));
        }

        .not-reported {
            grid-template-columns: minmax(0, 1.5fr) 7fr !important;
        }
    }

    .not-reported {
        grid-template-columns: minmax(0, 3fr) 7fr;
    }

    td {
        display: flex;
        justify-content: center;
        align-items: center;

        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;

        overflow: hidden;
    }

    .score {
        cursor: pointer;
    }

    .score:hover {
        outline: 2px solid var(--color-team-neutral);
        z-index: 1;
    }

    .total {
        border-left: 2px solid var(--neutral-separator-color);
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }
</style>
