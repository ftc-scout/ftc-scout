<script lang="ts">
    import { DESCRIPTORS, Season } from "@ftc-scout/common";
    import type { RemoteScoresTy } from "../MatchScore.svelte";
    import RemoteScoresHeader from "./RemoteScoresHeader.svelte";
    import RemoteScoreLine from "./RemoteScoreLine.svelte";
    import FieldVis from "../vis/FieldVis.svelte";
    import type { SimpleTeamMatchParticipation } from "../vis/2022/HoverInfo.svelte";

    export let scores: RemoteScoresTy;
    export let teams: SimpleTeamMatchParticipation[];
    export let matchDescription: string;
    export let teamNumber: number;
    $: season = scores.season as Season;
</script>

<table>
    <thead>
        <RemoteScoresHeader {scores} {teamNumber} />
    </thead>
    <tbody>
        {#each DESCRIPTORS[season].scoreModalTreeRemote as tree}
            <RemoteScoreLine {scores} prop={tree.val} heading />
            {#each tree.children as sub}
                <RemoteScoreLine
                    {scores}
                    prop={sub.val}
                    children={sub.children.map((c) => c.val)}
                />
            {/each}
        {/each}
    </tbody>
</table>

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
        grid-template-columns: 1fr 150px;
    }

    @media (max-width: 800px) {
        table :global(tr) {
            grid-template-columns: 1fr 100px;
        }
    }
</style>
