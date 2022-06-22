<script lang="ts">
    import type { EventPageMatchFragment } from "../../graphql/generated/graphql-operations";
    import MatchTeam from "./MatchTeam.svelte";

    export let matches: EventPageMatchFragment[];
    export let zebraStripe: boolean;

    $: team = matches[0].teams[0];
    $: scores = matches.map((m) => (m.scores as any)?.totalPoints);
    $: totalPoints = scores.reduce((a, b) => a + b, 0);
</script>

<tr class:zebra-stripe={zebraStripe}>
    <MatchTeam {team} width="" winner={false} border />

    {#each scores as score}
        <td class="score">{score}</td>
    {/each}

    <td class="total">{totalPoints}</td>
</tr>

<style>
    tr {
        display: grid;
        grid-template-columns: minmax(0, 3fr) repeat(7, minmax(0, 1fr));

        width: 100%;
        max-width: 100%;
        min-width: 100%;
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
        border-left: 2px solid lightgray;
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }
</style>
