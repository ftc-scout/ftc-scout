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

    function makeSortFunction(sort: { stat: Stat<T>; type: SortType.HIGH_LOW | SortType.LOW_HIGH }) {
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

    function assignRanks(data: StatData<T>[], pre: boolean): StatData<T>[] {
        const field = pre ? "preFilterRank" : "rank";

        for (let i = 0; i < data.length; i++) {
            // TODO make duplicate values have the same rank
            data[i][field] = i + 1;
        }

        return data;
    }

    $: statData = data.map((d) => ({ rank: 0, preFilterRank: 0, data: d }));

    // Sort by default first for consistent ordering.
    $: preFilterSortedData = statData
        .sort(makeSortFunction(defaultSort))
        .sort(makeSortFunction(currentSort ?? defaultSort));

    $: sortedData = assignRanks(filterStatDataList(assignRanks(preFilterSortedData, true), currentFilters), false);
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
