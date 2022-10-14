<script lang="ts" context="module">
    type S = FullScores2020Shared;
    const defaultSort: ChosenSort<S> = {
        stat: THIS_TOTAL_POINTS_STAT,
        type: SortType.HIGH_LOW,
    };
    let shownStats: Writable<Stat<S>[]> = writable([
        THIS_TOTAL_POINTS_STAT,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        THIS_ENDGAME_POINTS_STAT,
        TEAM_1,
        MATCH_DESCRIPTION_STAT as any,
        ALLIANCE_STAT as any,
    ]);
    let currentFilters: Writable<Filter<S>> = writable(emptyFilter());
    let currentSort = writable(defaultSort);
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import {
        ALLIANCE_STAT,
        MATCH_DESCRIPTION_STAT,
        STAT_SET_MATCHES_2020_SHARED,
        TEAM_1,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        THIS_ENDGAME_POINTS_STAT,
        THIS_TOTAL_POINTS_STAT,
        type FullScores2020Shared,
    } from "../../util/stats/2020/StatsSharedMatches2020";
    import { emptyFilter, type Filter } from "../../util/stats/filter";
    import type { Stat } from "../../util/stats/Stat";
    import { SortType } from "../SortButton.svelte";
    import LocallyResolvedStatsTable from "../stats/LocallyResolvedStatsTable.svelte";
    import type { ChosenSort } from "../stats/StatsTable.svelte";

    export let data: S[];
    export let selectedTeam: number | null;
    export let eventName: string;
</script>

<LocallyResolvedStatsTable
    {data}
    {shownStats}
    {defaultSort}
    bind:currentSort={$currentSort}
    bind:currentFilters={$currentFilters}
    bind:selectedTeam
    statSet={STAT_SET_MATCHES_2020_SHARED}
    fileName={`${eventName} Match Insights`}
    showRanks={true}
/>
