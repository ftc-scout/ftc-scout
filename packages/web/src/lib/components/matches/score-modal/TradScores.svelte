<script lang="ts">
    import { DESCRIPTORS, Season, TournamentLevel } from "@ftc-scout/common";
    import type { TradScoresTy } from "../MatchScore.svelte";
    import TradScoresHeader from "./TradScoresHeader.svelte";
    import TradScoreLine from "./TradScoreLine.svelte";
    import FieldVis from "../vis/FieldVis.svelte";
    import type { SimpleTeamMatchParticipation } from "../vis/2022/HoverInfo.svelte";
    import RankingPoints from "./rp/RankingPoints.svelte";

    export let scores: TradScoresTy;
    export let teams: SimpleTeamMatchParticipation[];
    export let matchDescription: string;
    export let level: TournamentLevel | undefined;
    $: season = scores.season as Season;
</script>

<table>
    <thead>
        <TradScoresHeader {scores} />
    </thead>
    <tbody>
        {#each DESCRIPTORS[season].scoreModalTree as tree}
            <TradScoreLine {scores} prop={tree.val} heading />
            {#each tree.children as sub}
                <TradScoreLine {scores} prop={sub.val} children={sub.children.map((c) => c.val)} />
            {/each}
        {/each}
    </tbody>
</table>

{#if level == "Quals"}
    <RankingPoints {scores} />
{/if}

<FieldVis {scores} {matchDescription} {teams} />

<style>
    table,
    thead,
    tbody {
        display: block;
    }

    @media (max-width: 550px) {
        table {
            --md-font-size: 14px;
            font-size: var(--md-font-size);
        }
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
