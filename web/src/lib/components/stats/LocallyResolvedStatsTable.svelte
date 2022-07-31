<script lang="ts">
    import type { Stat } from "../../util/stats/Stat";
    import { SortType } from "../SortButton.svelte";
    import type { StatsSet } from "../../util/stats/StatsSet";
    import type { Writable } from "svelte/store";
    import { filterStatDataList, type StatFilterOrGroup } from "../../util/stats/StatFilter";
    import StatsTable, { type ChosenSort } from "./StatsTable.svelte";

    type T = $$Generic;

    export let statSet: StatsSet<T, unknown>;

    export let data: T[];
    export let shownStats: Writable<Stat<T>[]>;
    export let selectedTeam: number | null = null;

    export let defaultSort: ChosenSort<T>;
    export let currentSort: ChosenSort<T> = defaultSort;
    export let currentFilters: StatFilterOrGroup<T> = [];

    export let eventName: string;

    function makeSortFunction(sort: { stat: Stat<T>; type: SortType.HIGH_LOW | SortType.LOW_HIGH }) {
        return (a: T, b: T) => {
            let { stat, type } = sort;
            let readA = stat.read(a);
            let readB = stat.read(b);
            let dataA = typeof readA == "object" ? readA.number : readA;
            let dataB = typeof readB == "object" ? readB.number : readB;

            if (type == SortType.LOW_HIGH) {
                return dataA - dataB;
            } else {
                return dataB - dataA;
            }
        };
    }

    // Sort by default first for consistent ordering.
    $: sortedData = filterStatDataList(data, currentFilters)
        .sort(makeSortFunction(defaultSort))
        .sort(makeSortFunction(currentSort ?? defaultSort));
</script>

<StatsTable
    bind:statSet
    data={sortedData}
    bind:shownStats
    bind:selectedTeam
    {defaultSort}
    bind:currentFilters
    bind:currentSort
    {eventName}
/>
