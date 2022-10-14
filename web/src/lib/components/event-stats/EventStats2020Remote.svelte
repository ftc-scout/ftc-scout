<script lang="ts" context="module">
    type S = FullTep2020Shared;
    const defaultSort: ChosenSort<S> = {
        stat: EVENT_RANK_STAT,
        type: SortType.LOW_HIGH,
    };
    let shownStats: Writable<Stat<S>[]> = writable([
        EVENT_RANK_STAT,
        TEAM_STAT,
        RP_STAT,
        PLAYED_STAT,
        AVERAGE_STAT,
        MAX_STAT,
    ]);
    let currentFilters: Writable<Filter<S>> = writable(emptyFilter());
    let currentSort = writable(defaultSort);
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import type { Stat } from "../../util/stats/Stat";
    import {
        PLAYED_STAT,
        EVENT_RANK_STAT,
        RP_STAT,
        TEAM_STAT,
        AVERAGE_STAT,
        MAX_STAT,
        STAT_SET_TEAMS_2020_SHARED,
        type FullTep2020Shared,
    } from "../../util/stats/2020/StatsSharedTeams2020";
    import { SortType } from "../SortButton.svelte";
    import LocallyResolvedStatsTable from "../stats/LocallyResolvedStatsTable.svelte";
    import type { ChosenSort } from "../stats/StatsTable.svelte";
    import { emptyFilter, type Filter } from "../../util/stats/filter";

    export let data: S[];
    export let selectedTeam: number | null = null;
    export let eventName: string;
</script>

<LocallyResolvedStatsTable
    {data}
    {shownStats}
    {defaultSort}
    bind:currentFilters={$currentFilters}
    bind:currentSort={$currentSort}
    bind:selectedTeam
    statSet={STAT_SET_TEAMS_2020_SHARED}
    fileName={`${eventName} Rankings`}
    showRanks={["Event Ranking", "Ranking Points (RP)", "Total Points Average"].indexOf(
        $currentSort.stat.identifierName
    ) == -1}
/>
