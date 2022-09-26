<script lang="ts" context="module">
    type S = FullTep2021Remote;
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
    import { PLAYED_STAT, EVENT_RANK_STAT, RP_STAT, TEAM_STAT } from "../../util/stats/StatsSharedTeams2021";
    import {
        AVERAGE_STAT,
        MAX_STAT,
        STAT_SET_2021_REMOTE,
        type FullTep2021Remote,
    } from "../../util/stats/StatsRemoteTeams2021";
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
    statSet={STAT_SET_2021_REMOTE}
    fileName={`${eventName} Rankings`}
    showRanks={["Event Ranking", "Ranking Points (RP)", "Total Points Average"].indexOf(
        $currentSort.stat.identifierName
    ) == -1}
/>
