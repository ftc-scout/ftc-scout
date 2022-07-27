<script lang="ts">
    import { writable, type Writable } from "svelte/store";

    import type { Stat } from "../../util/stats/Stat";
    import {
        AVG_STAT,
        PLAYED_STAT,
        RANK_STAT,
        RP_STAT,
        TBP2_STAT,
        TBP_STAT,
        TEAM_STAT,
        type FullTep2021Remote,
    } from "../../util/stats/StatsRemote2021";
    import { SortType } from "../SortButton.svelte";
    import EventStatsImpl, { type ChosenSort } from "./EventStatsImpl.svelte";

    type S = FullTep2021Remote;

    const defaultStats: Writable<Stat<S>[]> = writable([
        RANK_STAT,
        TEAM_STAT,
        RP_STAT,
        TBP_STAT,
        TBP2_STAT,
        PLAYED_STAT,
        AVG_STAT,
    ]);
    const defaultSort: ChosenSort<S> = {
        stat: RANK_STAT,
        type: SortType.LOW_HIGH,
    };

    export let stats: Stat<S>[];
    export let selectedTeam: number | null = null;
</script>

<EventStatsImpl data={stats} shownStats={defaultStats} {defaultSort} bind:selectedTeam />
