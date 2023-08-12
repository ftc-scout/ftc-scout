<script lang="ts" context="module">
    export const SortDir = {
        Asc: "Asc",
        Desc: "Desc",
    } as const;
    export type SortDir = (typeof SortDir)[keyof typeof SortDir];
</script>

<script lang="ts">
    import { faEdit, faFileDownload, faFilter } from "@fortawesome/free-solid-svg-icons";
    import ViewStatsModal from "./view-stats/ViewStatsModal.svelte";
    import ChooseStatsModal from "./choose-stats/ChooseStatsModal.svelte";
    import type { Readable } from "svelte/motion";
    import {
        RANK_STATS,
        StatSet,
        type RankTy,
        type StatData,
        NonRankStatColumn,
    } from "./stat-table";
    import StatTable from "./StatTable.svelte";
    import Button from "../ui/Button.svelte";
    import { createEventDispatcher } from "svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let stats: StatSet<T>;
    export let focusedTeam: number | null;
    export let rankTy: RankTy;
    export let showRank: boolean;

    export let shownStats: Readable<NonRankStatColumn<T>[]>;
    export let currentSort: Readable<{ id: string; dir: SortDir }>;

    let dispatch = createEventDispatcher();

    let viewStatsModalShown = false;
    let viewStatsData: StatData<T>;

    function rowClick(e: CustomEvent) {
        viewStatsModalShown = true;
        viewStatsData = e.detail;
    }

    let chooseStatsModalShown = false;
</script>

<ViewStatsModal bind:shown={viewStatsModalShown} {stats} data={viewStatsData?.data} />
<ChooseStatsModal
    bind:shown={chooseStatsModalShown}
    selectedStats={$shownStats.map((s) => s.id)}
    {stats}
    on:choose-stat={(e) => dispatch("toggle-show-stat", e.detail)}
/>

<div class="controls">
    <div>
        <Button icon={faEdit} on:click={() => (chooseStatsModalShown = true)}>Statistics</Button>
        <Button icon={faFilter}>Filters</Button>
    </div>

    <div>
        <Button icon={faFileDownload}>Export CSV</Button>
    </div>
</div>

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

<style>
    .controls {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-bottom: var(--lg-gap);
    }

    .controls div {
        display: flex;
        gap: var(--md-gap);
    }
</style>
