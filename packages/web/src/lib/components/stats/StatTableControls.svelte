<script lang="ts" context="module">
    export const SortDir = {
        Asc: "Asc",
        Desc: "Desc",
    } as const;
    export type SortDir = (typeof SortDir)[keyof typeof SortDir];
</script>

<script lang="ts">
    import ViewStatsModal from "./view-stats/ViewStatsModal.svelte";
    import type { Readable } from "svelte/motion";
    import {
        RANK_STATS,
        StatSet,
        type RankTy,
        type StatData,
        NonRankStatColumn,
    } from "./stat-table";
    import StatTable from "./StatTable.svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let stats: StatSet<T>;
    export let focusedTeam: number | null;
    export let rankTy: RankTy;
    export let showRank: boolean;

    export let shownStats: Readable<NonRankStatColumn<T>[]>;
    export let currentSort: Readable<{ id: string; dir: SortDir }>;

    let viewStatsModalShown = false;
    let viewStatsData: StatData<T>;

    function rowClick(e: CustomEvent) {
        viewStatsModalShown = true;
        viewStatsData = e.detail;
    }
</script>

<ViewStatsModal bind:shown={viewStatsModalShown} {stats} data={viewStatsData?.data} />

<StatTable
    {data}
    stats={$shownStats}
    currentSort={$currentSort}
    {focusedTeam}
    rankStat={showRank ? RANK_STATS[rankTy] : null}
    on:change_sort
    on:move_column
    on:row_click={rowClick}
/>
