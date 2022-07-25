<script lang="ts">
    import StatRow from "./StatRow.svelte";
    import StatHeaders from "./StatHeaders.svelte";
    import type { Stat, StatList } from "../../util/stats/Stat";
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
    import { SortType } from "../SortButton.svelte";

    type StatData = {
        team: {
            number: number;
            name: string;
        };
        stats: FullStats_TeamEventStats2021Traditional_Fragment;
    };

    export let stats: StatData[];

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

    type ChosenSort = {
        stat: Stat<FullStats_TeamEventStats2021Traditional_Fragment>;
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    };

    export let defaultSort: ChosenSort = {
        stat: RANK_STAT,
        type: SortType.LOW_HIGH,
    };
    let sort: ChosenSort = defaultSort;

    function makeSortFunction(sort: {
        stat: Stat<FullStats_TeamEventStats2021Traditional_Fragment> | "team";
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    }) {
        return (a: StatData, b: StatData) => {
            let { stat, type } = sort;
            let dataA = stat == "team" ? a.team.number : stat.read(a.stats);
            let dataB = stat == "team" ? b.team.number : stat.read(b.stats);

            if (type == SortType.LOW_HIGH) {
                return dataA - dataB;
            } else {
                return dataB - dataA;
            }
        };
    }

    // Sort by default first for consistent ordering.
    $: sorted = stats.sort(makeSortFunction(defaultSort)).sort(makeSortFunction(sort ?? defaultSort));
</script>

<table>
    <StatHeaders {shownStats} bind:sort {defaultSort} />
    <tbody>
        {#each sorted as team, i (team.team.number)}
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
