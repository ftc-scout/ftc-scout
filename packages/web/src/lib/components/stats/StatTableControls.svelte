<script lang="ts" context="module">
    export const SortDir = {
        Asc: "Asc",
        Desc: "Desc",
    } as const;
    export type SortDir = (typeof SortDir)[keyof typeof SortDir];
</script>

<script lang="ts">
    import type { FilterGroup } from "./filter/filter";
    import { faEdit, faFilter, faXmark } from "@fortawesome/free-solid-svg-icons";
    import ViewStatsModal from "./view-stats/ViewStatsModal.svelte";
    import ChooseStatsModal from "./choose-stats/ChooseStatsModal.svelte";
    import { RANK_STATS, StatSet, RankTy, type StatData, NonRankStatColumn } from "./stat-table";
    import StatTable from "./StatTable.svelte";
    import Button from "../ui/Button.svelte";
    import { createEventDispatcher } from "svelte";
    import FilterModal from "./filter/FilterModal.svelte";
    import Select from "../ui/form/Select.svelte";
    import ExportCsv from "./ExportCsv.svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let stats: StatSet<T>;
    export let focusedTeam: number | null;
    export let rankTy: RankTy;
    export let showRank: boolean;

    export let shownStats: NonRankStatColumn<T>[];
    export let currentSort: { id: string; dir: SortDir };
    export let filter: FilterGroup | null;

    export let isDefaultStats: boolean;

    export let csv: { filename: string; title: string };

    let dispatch = createEventDispatcher();

    let viewStatsModalShown = false;
    let viewStatsData: StatData<T>;

    function rowClick(e: CustomEvent) {
        viewStatsModalShown = true;
        viewStatsData = e.detail;
    }

    let chooseStatsModalShown = false;
    let filtersShown = false;
</script>

<ViewStatsModal bind:shown={viewStatsModalShown} {stats} data={viewStatsData?.data} />
<ChooseStatsModal
    bind:shown={chooseStatsModalShown}
    selectedStats={shownStats.map((s) => s.id)}
    {stats}
    on:choose-stat={(e) => dispatch("toggle-show-stat", e.detail)}
/>
<FilterModal bind:shown={filtersShown} root={filter} {stats} on:new-filter />

<div class="controls" class:extras={!isDefaultStats || filter != null}>
    <Button icon={faEdit} on:click={() => (chooseStatsModalShown = true)}>Statistics</Button>
    {#if !isDefaultStats}
        <Button icon={faXmark} on:click={() => dispatch("reset-stats")}>Reset Stats</Button>
    {/if}

    <Button icon={faFilter} on:click={() => (filtersShown = true)}>Filters</Button>
    {#if filter != null}
        <Button icon={faXmark} on:click={() => dispatch("new-filter", null)}>Clear Filters</Button>
        <Select
            bind:value={rankTy}
            options={[
                { value: RankTy.NoFilter, name: "Rank Before Filters" },
                { value: RankTy.Filter, name: "Rank After Filters" },
            ]}
        />
    {/if}

    <div>
        <ExportCsv {data} {shownStats} {csv} />
    </div>
</div>

<StatTable
    {data}
    stats={shownStats}
    {currentSort}
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
        justify-content: left;
        flex-wrap: wrap;
        gap: var(--md-gap);

        margin-bottom: var(--lg-gap);
    }

    .controls :last-child {
        margin-left: auto;
    }

    @media (max-width: 600px) {
        .controls.extras :last-child {
            margin-left: 0;
        }
    }

    .controls :global(select) {
        width: min-content;
        padding-top: calc(var(--md-pad) * 0.9);
        padding-bottom: calc(var(--md-pad) * 0.9);
        background-color: var(--form-bg-color);
    }

    .controls :global(select:hover) {
        background-color: var(--form-hover-bg-color);
    }
</style>
