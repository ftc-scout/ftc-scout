<script lang="ts">
    import type { Stat } from "../../util/stats/Stat";

    import {
        AVG_STAT,
        OPR_STAT,
        PLAYED_STAT,
        RANK_STAT,
        RP_STAT,
        STAT_SET_2021_TRAD,
        TBP2_STAT,
        TBP_STAT,
        TEAM_STAT,
        type FullTep2021Traditional,
    } from "../../util/stats/StatsTrad2021";
    import { SortType } from "../SortButton.svelte";
    import EventStatsImpl, { type ChosenSort } from "./EventStatsImpl.svelte";

    type S = FullTep2021Traditional;

    const defaultStats: Stat<S>[] = [
        RANK_STAT,
        TEAM_STAT,
        RP_STAT,
        TBP_STAT,
        TBP2_STAT,
        PLAYED_STAT,
        AVG_STAT,
        OPR_STAT,
    ];
    const defaultSort: ChosenSort<S> = {
        stat: RANK_STAT,
        type: SortType.LOW_HIGH,
    };

    export let data: S[];
    export let selectedTeam: number | null = null;
</script>

<EventStatsImpl {data} shownStats={defaultStats} {defaultSort} bind:selectedTeam statSet={STAT_SET_2021_TRAD} />
