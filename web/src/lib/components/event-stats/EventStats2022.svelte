<script lang="ts" context="module">
    type S = FullTep2022;
    const defaultSort: ChosenSort<S> = {
        stat: EVENT_RANK_STAT,
        type: SortType.LOW_HIGH,
    };
    let shownStats: Writable<Stat<S>[]> = writable([
        EVENT_RANK_STAT,
        TEAM_STAT,
        RP_STAT,
        TBP_STAT,
        PLAYED_STAT,
        NP_AVERAGE_STAT,
        NP_OPR_STAT,
        NP_MAX_STAT,
    ]);
    let currentFilters: Writable<Filter<S>> = writable(emptyFilter());
    let currentSort = writable(defaultSort);
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { emptyFilter, type Filter } from "../../util/stats/filter";
    import type { Stat } from "../../util/stats/Stat";
    import {
        NP_AVERAGE_STAT,
        EVENT_RANK_STAT,
        NP_MAX_STAT,
        NP_OPR_STAT,
        PLAYED_STAT,
        RP_STAT,
        STAT_SET_TEAMS_2022,
        TBP_STAT,
        TEAM_STAT,
        type FullTep2022,
    } from "../../util/stats/2022/StatsTeams2022";
    import { SortType } from "../SortButton.svelte";
    import LocallyResolvedStatsTable from "../stats/LocallyResolvedStatsTable.svelte";
    import type { ChosenSort } from "../stats/StatsTable.svelte";

    export let data: S[];
    export let selectedTeam: number | null = null;
    export let eventName: string;

    console.log(data);
</script>

<LocallyResolvedStatsTable
    {data}
    {shownStats}
    {defaultSort}
    bind:currentSort={$currentSort}
    bind:currentFilters={$currentFilters}
    bind:selectedTeam
    statSet={STAT_SET_TEAMS_2022}
    fileName={`${eventName} Rankings`}
    showRanks={["Event Ranking", "Ranking Points (RP)", "Total Points Average"].indexOf(
        $currentSort.stat.identifierName
    ) == -1}
/>
