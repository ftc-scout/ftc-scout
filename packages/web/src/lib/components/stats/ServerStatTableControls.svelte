<script lang="ts">
    import { RANK_TY_EC_DC } from "../../util/search-params/rank-ty";
    import {
        FILTER_EC_DC,
        SORT_DIR_EC_DC,
        STATS_EC_DC,
        STAT_EC_DC,
    } from "../../util/search-params/stats";
    import { PAGE_EC_DC } from "../../util/search-params/int";
    import {
        commitQueryParamBatch,
        queryParam,
        queryParams,
        startQueryParamBatch,
    } from "../../util/search-params/search-params";
    import { arrayMove } from "../../util/array";
    import { cycleSortDir, cycleSortDirNoNull } from "./SortButton.svelte";
    import {
        type NonRankStatColumn,
        type StatData,
        type StatSet,
        type SortDir,
        type FilterGroup,
        RankTy,
    } from "@ftc-scout/common";
    import StatTableControls from "./StatTableControls.svelte";
    import PageChooser from "../PageChooser.svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let stats: StatSet<T>;
    export let focusedTeam: number | null;

    export let defaultStats: string[];
    export let defaultSort: { id: string; dir: SortDir };

    $: shownStats = queryParam("shown", STATS_EC_DC(stats, defaultStats));
    $: currentSort = queryParams({
        id: { ...STAT_EC_DC(stats, defaultSort.id), urlName: "sort" },
        dir: { ...SORT_DIR_EC_DC, urlName: "sort-dir" },
    });
    $: filter = queryParam("filter", FILTER_EC_DC(stats));
    let rankTy = queryParam("rank-ty", RANK_TY_EC_DC);

    let page = queryParam("page", PAGE_EC_DC);
    export let pageCount: number;

    function calcIsDefaultStats(def: string[], curr: NonRankStatColumn<T>[]): boolean {
        if (def.length != curr.length) return false;
        for (let i = 0; i < def.length; i++) {
            if (def[i] != curr[i].id) return false;
        }
        return true;
    }

    $: isDefaultStats = calcIsDefaultStats(defaultStats, $shownStats);

    export let csv: { filename: string; title: string };

    function changeSort(id: string) {
        let oldDir = $currentSort.id == id ? $currentSort.dir : null;
        let newDir = id == defaultSort.id ? cycleSortDirNoNull(oldDir) : cycleSortDir(oldDir);

        startQueryParamBatch();
        $currentSort = newDir == null ? defaultSort : { id, dir: newDir };
        $page = 1;
        commitQueryParamBatch();
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

    function newFilter(f: FilterGroup | null) {
        startQueryParamBatch();
        $filter = f;
        $page = 1;
        if (f == null && $rankTy == RankTy.FilterSkip) $rankTy = RankTy.NoFilterSkip;
        if (f == null && $rankTy == RankTy.Filter) $rankTy = RankTy.NoFilter;
        commitQueryParamBatch();
    }
</script>

<StatTableControls
    {data}
    {stats}
    shownStats={$shownStats}
    currentSort={$currentSort}
    filter={$filter}
    {isDefaultStats}
    {focusedTeam}
    bind:rankTy={$rankTy}
    includeSkipRankTys
    showRank
    {csv}
    on:change_sort={(e) => changeSort(e.detail)}
    on:move_column={(e) => moveColumn(e.detail.oldPos, e.detail.newPos)}
    on:toggle-show-stat={(e) => toggleShowStat(e.detail)}
    on:new-filter={(e) => newFilter(e.detail)}
    on:reset-stats={() => ($shownStats = defaultStats.map((id) => stats.getStat(id)))}
/>

<div>
    <PageChooser bind:page={$page} totalPageCount={pageCount} />
</div>

<style>
    div {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        margin-top: var(--lg-gap);
    }
</style>
