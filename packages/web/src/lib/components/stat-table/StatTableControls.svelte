<script lang="ts" context="module">
    export const SortDir = {
        Asc: "Asc",
        Desc: "Desc",
    } as const;
    export type SortDir = (typeof SortDir)[keyof typeof SortDir];
</script>

<script lang="ts">
    import type { Readable } from "svelte/motion";
    import { RANK_STATS, type RankTy, type StatColumn, type StatData } from "./stat-table";
    import StatTable from "./StatTable.svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let allStats: StatColumn<T>[];
    export let focusedTeam: number | null;
    export let rankTy: RankTy;
    export let showRank: boolean;

    export let shownStats: Readable<StatColumn<T>[]>;
    export let currentSort: Readable<{ id: string; dir: SortDir }>;
</script>

<StatTable
    {data}
    stats={$shownStats}
    currentSort={$currentSort}
    {focusedTeam}
    rankStat={showRank ? RANK_STATS[rankTy] : null}
    on:change_sort
    on:move_column
/>
