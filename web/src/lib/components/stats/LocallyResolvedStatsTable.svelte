<script lang="ts">
    import { distillStatRead, type Stat } from "../../util/stats/Stat";
    import { SortType } from "../SortButton.svelte";
    import type { StatSet } from "../../util/stats/StatSet";
    import type { Writable } from "svelte/store";
    import StatsTable, { type ChosenSort, type StatData } from "./StatsTable.svelte";
    import { emptyFilter, filterStatDataList, type Filter } from "../../util/stats/filter";

    type T = $$Generic;

    export let statSet: StatSet<T, unknown>;

    export let data: T[];
    export let shownStats: Writable<Stat<T>[]>;
    export let selectedTeam: number | null = null;

    export let defaultSort: ChosenSort<T>;
    export let currentSort: ChosenSort<T> = defaultSort;
    export let currentFilters: Filter<T> = emptyFilter();

    export let fileName: string;

    export let showRanks = true;

    function makeSortFunction<T>(sort: {
        stat: Stat<T>;
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    }): (a: StatData<T>, b: StatData<T>) => number {
        return (a: StatData<T>, b: StatData<T>) => {
            let { stat, type } = sort;
            let readA = stat.read(a);
            let readB = stat.read(b);
            let dataA = distillStatRead(readA);
            let dataB = distillStatRead(readB);

            let bothNumber = typeof dataA == "number" && typeof dataB == "number";

            if (type == SortType.LOW_HIGH) {
                return bothNumber ? (dataA as number) - (dataB as number) : ("" + dataA).localeCompare("" + dataB);
            } else {
                return bothNumber ? (dataB as number) - (dataA as number) : ("" + dataB).localeCompare("" + dataA);
            }
        };
    }

    function assignRanks(data: StatData<T>[], pre: boolean, stat: Stat<T>): StatData<T>[] {
        const field = pre ? "preFilterRank" : "rank";

        for (let i = 0; i < data.length; i++) {
            if (i == 0) {
                data[i][field] = i + 1;
            } else {
                let prev = data[i - 1];
                let prevValue = distillStatRead(stat.read(prev));
                let thisValue = distillStatRead(stat.read(data[i]));
                data[i][field] = prevValue == thisValue ? prev[field] : i + 1;
            }
        }

        return data;
    }

    function sortAndRank(
        data: StatData<T>[],
        currentSort: ChosenSort<T>,
        defaultSort: ChosenSort<T>,
        filters: Filter<T>
    ): StatData<T>[] {
        let sortedData = data.sort(makeSortFunction(defaultSort)).sort(makeSortFunction(currentSort ?? defaultSort));
        assignRanks(sortedData, true, currentSort.stat);

        let filteredData = filterStatDataList(sortedData, filters);
        assignRanks(filteredData, false, currentSort.stat);

        return filteredData;
    }

    $: statData = data.map((d) => ({ rank: 0, preFilterRank: 0, data: d }));
    $: sortedData = sortAndRank(statData, currentSort, defaultSort, currentFilters);
</script>

<StatsTable
    bind:statSet
    data={sortedData}
    bind:shownStats
    bind:selectedTeam
    {defaultSort}
    bind:currentFilters
    bind:currentSort
    {fileName}
    {showRanks}
/>
