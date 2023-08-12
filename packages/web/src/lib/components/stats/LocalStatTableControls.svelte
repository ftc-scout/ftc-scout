<script lang="ts">
    import { arrayMove } from "../../util/array";
    import { cycleSortDir, cycleSortDirNoNull } from "./SortButton.svelte";
    import { sortMixed } from "../../util/sorters";
    import { RankTy, type NonRankStatColumn, type StatData, StatSet } from "./stat-table";
    import StatTableControls, { SortDir } from "./StatTableControls.svelte";
    import { writable } from "svelte/store";

    type T = $$Generic;

    export let data: T[];
    export let stats: StatSet<T>;
    export let focusedTeam: number | null;

    export let defaultStats: string[];
    export let defaultSort: { id: string; dir: SortDir };

    let shownStats = writable(defaultStats.map((s) => stats.getStat(s)));
    let currentSort = writable(defaultSort);

    export let rankTy = RankTy.NoFilter;
    export let hideRankStats: string[] = [];
    $: showRank = hideRankStats.indexOf($currentSort.id) == -1;

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

        for (let i = 0; i < data.length; i++) {
            if (i == 0) {
                data[i][field] = i + 1;
            } else {
                let prev = data[i - 1];
                let prevVal = sorter.getValueDistilled(prev);
                let thisVal = sorter.getValueDistilled(data[i]);
                data[i][field] = prevVal == thisVal ? prev[field] : i + 1;
            }
        }
    }

    function statSortFn(sorter: NonRankStatColumn<T>, dir: SortDir): (a: T, b: T) => number {
        return (a, b) =>
            sortMixed(sorter.getNonRankValueDistilled(a), sorter.getNonRankValueDistilled(b)) *
            (dir == SortDir.Asc ? 1 : -1);
    }

    function sortAndRank(data: T[], sorter: NonRankStatColumn<T>, dir: SortDir): StatData<T>[] {
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

        return sorted;
    }

    $: rankedData = sortAndRank(data, stats.getStat($currentSort.id), $currentSort.dir);
</script>

<StatTableControls
    data={rankedData}
    {stats}
    {shownStats}
    {currentSort}
    {focusedTeam}
    {rankTy}
    {showRank}
    {csv}
    on:change_sort={(e) => changeSort(e.detail)}
    on:move_column={(e) => moveColumn(e.detail.oldPos, e.detail.newPos)}
    on:toggle-show-stat={(e) => toggleShowStat(e.detail)}
/>
