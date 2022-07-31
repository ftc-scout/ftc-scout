<script lang="ts" context="module">
    type S = FullTep2021Remote;
    const defaultSort: ChosenSort<S> = {
        stat: RANK_STAT,
        type: SortType.LOW_HIGH,
    };
    let shownStats: Writable<Stat<S>[]> = writable([
        RANK_STAT,
        TEAM_STAT,
        RP_STAT,
        PLAYED_STAT,
        AVERAGE_STAT,
        MAX_STAT,
    ]);
    let currentFilters: Writable<StatFilterOrGroup<S>> = writable([]);
    let currentSort = defaultSort;
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import type { Stat } from "../../util/stats/Stat";
    import { PLAYED_STAT, RANK_STAT, RP_STAT, TEAM_STAT } from "../../util/stats/StatsShared2021";
    import {
        AVERAGE_STAT,
        MAX_STAT,
        STAT_SET_2021_REMOTE,
        type FullTep2021Remote,
    } from "../../util/stats/StatsRemote2021";
    import { SortType } from "../SortButton.svelte";
    import type { StatFilterOrGroup } from "../../util/stats/StatFilter";
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
    bind:currentFilters={$currentFilters}
    bind:currentSort
    bind:selectedTeam
    statSet={STAT_SET_2021_REMOTE}
    {eventName}
/>
