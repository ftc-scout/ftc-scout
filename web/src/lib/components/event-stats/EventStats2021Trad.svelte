<script lang="ts" context="module">
    type S = FullTep2021Traditional;
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
        OPR_STAT,
        MAX_STAT,
    ]);
    let currentFilters: Writable<StatFilterOrGroup<S>> = writable([]);
    let currentSort = defaultSort;
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import type { Stat } from "../../util/stats/Stat";
    import type { StatFilterOrGroup } from "../../util/stats/StatFilter";
    import { PLAYED_STAT, RANK_STAT, RP_STAT, TEAM_STAT } from "../../util/stats/StatsShared2021";
    import {
        STAT_SET_2021_TRAD,
        AVERAGE_STAT,
        type FullTep2021Traditional,
        MAX_STAT,
        OPR_STAT,
    } from "../../util/stats/StatsTrad2021";
    import { SortType } from "../SortButton.svelte";
    import EventStatsImpl, { type ChosenSort } from "./EventStatsImpl.svelte";

    export let data: S[];
    export let selectedTeam: number | null = null;
    export let eventName: string;
</script>

<EventStatsImpl
    {data}
    {shownStats}
    {defaultSort}
    bind:currentSort
    bind:currentFilters={$currentFilters}
    bind:selectedTeam
    statSet={STAT_SET_2021_TRAD}
    {eventName}
/>
