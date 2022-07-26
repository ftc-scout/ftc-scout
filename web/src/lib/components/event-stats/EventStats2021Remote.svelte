<script lang="ts">
    import type { StatList } from "../../util/stats/Stat";
    import {
        AVG_STAT,
        PLAYED_STAT,
        RANK_STAT,
        RP_STAT,
        TBP2_STAT,
        TBP_STAT,
        type FullStats_TeamEventStats2021Remote_Fragment,
    } from "../../util/stats/StatsRemote2021";
    import { SortType } from "../SortButton.svelte";
    import EventStatsImpl, { type ChosenSort, type StatData } from "./EventStatsImpl.svelte";

    type S = FullStats_TeamEventStats2021Remote_Fragment;

    const defaultStats: StatList<S> = [RANK_STAT, "team", RP_STAT, TBP_STAT, TBP2_STAT, PLAYED_STAT, AVG_STAT];
    const defaultSort: ChosenSort<S> = {
        stat: RANK_STAT,
        type: SortType.LOW_HIGH,
    };

    export let stats: StatData<S>[];
    export let selectedTeam: number | null = null;
</script>

<EventStatsImpl {stats} shownStats={defaultStats} {defaultSort} bind:selectedTeam />
