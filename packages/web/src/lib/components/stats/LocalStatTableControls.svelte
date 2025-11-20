<script lang="ts" context="module">
    type State<T> = {
        shownStats: Writable<NonRankStatColumn<T>[]>;
        currentSort: Writable<{ id: string; dir: SortDir }>;
        filter: Writable<FilterGroup | null>;
        rankTy: Writable<RankTy>;
    };
    let savedState: Record<string, State<any>> = {};

    function getSavedState<T>(
        saveId: string,
        stats: StatSet<T>,
        defaultStats: string[],
        defaultSort: { id: string; dir: SortDir }
    ): State<T> {
        if (!(saveId in savedState)) {
            savedState[saveId] = {
                shownStats: writable(defaultStats.map((s) => stats.getStat(s))),
                currentSort: writable(defaultSort),
                filter: writable(null),
                rankTy: writable(RankTy.NoFilter),
            };
        }

        return savedState[saveId];
    }
</script>

<script lang="ts">
    import { applyFilter } from "./filter/applyFilters";
    import { arrayMove } from "../../util/array";
    import { cycleSortDir, cycleSortDirNoNull } from "./SortButton.svelte";
    import { sortMixed } from "../../util/sorters";
    import {
        RankTy,
        type NonRankStatColumn,
        type StatData,
        StatSet,
        SortDir,
        type FilterGroup,
    } from "@ftc-scout/common";
    import StatTableControls from "./StatTableControls.svelte";
    import { writable, type Writable } from "svelte/store";

    type T = $$Generic;

    export let saveId: string;

    export let data: T[];
    export let stats: StatSet<T>;
    export let focusedTeam: number | null;

    export let defaultStats: string[];
    export let defaultSort: { id: string; dir: SortDir };

    let { shownStats, currentSort, filter, rankTy } = getSavedState<T>(
        saveId,
        stats,
        defaultStats,
        defaultSort
    );

    function calcIsDefaultStats(def: string[], curr: NonRankStatColumn<T>[]): boolean {
        if (def.length != curr.length) return false;
        for (let i = 0; i < def.length; i++) {
            if (def[i] != curr[i].id) return false;
        }
        return true;
    }

    $: isDefaultStats = calcIsDefaultStats(defaultStats, $shownStats);

    export let hideRankStats: string[] = [];
    export let hideFiltersAndStats: boolean = false;
    $: rankingByEquiv = hideRankStats.indexOf($currentSort.id) != -1;
    $: rowsDroppedByFilter = rankedData.length != data.length;
    $: showRank = !rankingByEquiv || (rowsDroppedByFilter && $rankTy != RankTy.NoFilter);

    export let csv: { filename: string; title: string };

    function changeSort(id: string) {
        let oldDir = $currentSort.id == id ? $currentSort.dir : null;
        let newDir = id == defaultSort.id ? cycleSortDirNoNull(oldDir) : cycleSortDir(oldDir);
        $currentSort = newDir == null ? defaultSort : { id, dir: newDir };
    }

    function moveColumn(from: number, to: number) {
        $shownStats = arrayMove($shownStats, from, to);
    }

    function toggleShowStat(id: string) {
        if ($shownStats.some((s) => s.id == id)) {
            $shownStats = $shownStats.filter((s) => s.id != id);
        } else {
            $shownStats = [...$shownStats, stats.getStat(id)];
        }
    }

    function assignRanks(data: StatData<T>[], sorter: NonRankStatColumn<T>, preFilter: boolean) {
        const field = preFilter ? "noFilterRank" : "filterRank";

        let rankedCount = 0;
        let lastRank = 0;
        let lastValue: number | string | null = null;

        for (let i = 0; i < data.length; i++) {
            let thisVal = sorter.getValueDistilled(data[i]);
            if (thisVal == null) {
                data[i][field] = 0;
                continue;
            }

            rankedCount++;

            if (lastRank == 0) {
                lastRank = 1;
            } else if (lastValue != thisVal) {
                lastRank = rankedCount;
            }

            data[i][field] = lastRank;
            lastValue = thisVal;
        }
    }

    function statSortFn(sorter: NonRankStatColumn<T>, dir: SortDir): (a: T, b: T) => number {
        return (a, b) => {
            let av = sorter.getNonRankValueDistilled(a);
            let bv = sorter.getNonRankValueDistilled(b);

            if (av == null && bv == null) return 0;
            if (av == null) return 1;
            if (bv == null) return -1;

            let res = sortMixed(av, bv);
            return dir == SortDir.Asc ? res : -res;
        };
    }

    function sortAndRank(
        data: T[],
        sorter: NonRankStatColumn<T>,
        dir: SortDir,
        filter: FilterGroup | null
    ): StatData<T>[] {
        let sorted = data
            .sort(statSortFn(stats.getStat(defaultSort.id), defaultSort.dir))
            .sort(statSortFn(sorter, dir))
            .map((s) => ({
                filterRank: 0,
                filterSkipRank: 0,
                noFilterRank: 0,
                noFilterSkipRank: 0,
                data: s,
            }));
        assignRanks(sorted, sorter, true);

        let filtered = applyFilter(sorted, stats, filter);
        assignRanks(filtered, sorter, false);

        return filtered;
    }

    $: rankedData = sortAndRank(data, stats.getStat($currentSort.id), $currentSort.dir, $filter);
</script>

<StatTableControls
    data={rankedData}
    {stats}
    shownStats={$shownStats}
    currentSort={$currentSort}
    filter={$filter}
    {isDefaultStats}
    {focusedTeam}
    bind:rankTy={$rankTy}
    {showRank}
    {csv}
    {hideFiltersAndStats}
    on:change_sort={(e) => changeSort(e.detail)}
    on:move_column={(e) => moveColumn(e.detail.oldPos, e.detail.newPos)}
    on:toggle-show-stat={(e) => toggleShowStat(e.detail)}
    on:new-filter={(e) => ($filter = e.detail)}
    on:reset-stats={() => ($shownStats = defaultStats.map((id) => stats.getStat(id)))}
/>
