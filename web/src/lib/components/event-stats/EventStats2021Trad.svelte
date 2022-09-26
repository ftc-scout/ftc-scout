<script lang="ts" context="module">
    type S = FullTep2021Traditional;
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
        OPR_STAT,
        MAX_STAT,
    ]);
    let currentFilters: Writable<Filter<S>> = writable(emptyFilter());
    let currentSort = writable(defaultSort);
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { emptyFilter, type Filter } from "../../util/stats/filter";
    import type { Stat } from "../../util/stats/Stat";
    import { PLAYED_STAT, EVENT_RANK_STAT, RP_STAT, TEAM_STAT } from "../../util/stats/2021/teams/StatsSharedTeams2021";
    import {
        STAT_SET_2021_TRAD,
        AVERAGE_STAT,
        type FullTep2021Traditional,
        MAX_STAT,
        OPR_STAT,
    } from "../../util/stats/2021/teams/StatsTradTeams2021";
    import { SortType } from "../SortButton.svelte";
    import LocallyResolvedStatsTable from "../stats/LocallyResolvedStatsTable.svelte";
    import type { ChosenSort } from "../stats/StatsTable.svelte";

    export let data: S[];
    export let selectedTeam: number | null = null;
    export let eventName: string;
</script>

<LocallyResolvedStatsTable
    {data}
    {shownStats}
    {defaultSort}
    bind:currentSort={$currentSort}
    bind:currentFilters={$currentFilters}
    bind:selectedTeam
    statSet={STAT_SET_2021_TRAD}
    fileName={`${eventName} Rankings`}
    showRanks={["Event Ranking", "Ranking Points (RP)", "Total Points Average"].indexOf(
        $currentSort.stat.identifierName
    ) == -1}
/>
