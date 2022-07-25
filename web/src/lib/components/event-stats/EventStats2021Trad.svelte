<script lang="ts">
    import StatRow from "./StatRow.svelte";
    import StatHeader from "./StatHeader.svelte";
    import type { StatList } from "../../util/stats/Stat";
    import {
        AVG_STAT,
        OPR_STAT,
        PLAYED_STAT,
        RANK_STAT,
        RP_STAT,
        TBP2_STAT,
        TBP_STAT,
        type FullStats_TeamEventStats2021Traditional_Fragment,
    } from "../../util/stats/StatsTrad2021";

    export let stats: {
        team: {
            number: number;
            name: string;
        };
        stats: FullStats_TeamEventStats2021Traditional_Fragment;
    }[];

    let shownStats: StatList<FullStats_TeamEventStats2021Traditional_Fragment> = [
        RANK_STAT,
        "team",
        RP_STAT,
        TBP_STAT,
        TBP2_STAT,
        PLAYED_STAT,
        AVG_STAT,
        OPR_STAT,
    ];

    export let selectedTeam: number | null = null;

    $: sorted = stats.sort((a, b) => a.stats.rank - b.stats.rank);
</script>

<table>
    <StatHeader {shownStats} />
    <tbody>
        {#each sorted as team, i}
            <StatRow {team} {shownStats} zebraStripe={i % 2 == 1} bind:selectedTeam />
        {/each}
    </tbody>
</table>

<style>
    table {
        border-spacing: 0;

        border: 1px solid lightgray;
        border-radius: 8px;

        display: block;
        width: 100%;
        max-width: 100%;
        overflow: auto;
    }
</style>
