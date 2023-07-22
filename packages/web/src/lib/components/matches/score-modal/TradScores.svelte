<script lang="ts">
    import type { TradScoresTy } from "../MatchScore.svelte";
    import TradScoresHeader from "./TradScoresHeader.svelte";

    export let scores: TradScoresTy;
    // $: season = scores.season as Season;
</script>

<table>
    <thead>
        <TradScoresHeader {scores} />
    </thead>
    <tbody>
        <!-- {#each DESCRIPTORS[season].scoreTree as prop}
            <TradScoreLine {scores} {prop} />
        {/each} -->
    </tbody>
</table>

<style>
    table,
    thead,
    tbody {
        display: block;
    }

    table :global(tr) {
        display: grid;
        grid-template-columns: 1fr 100px 100px;
    }

    @media (max-width: 800px) {
        table :global(tr) {
            grid-template-columns: 1fr 80px 80px;
        }
    }
</style>
