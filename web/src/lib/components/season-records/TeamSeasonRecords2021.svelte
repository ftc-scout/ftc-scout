<script lang="ts" context="module">
    type Data = FullTep2021Traditional | FullTep2021Remote;

    let shownStats: Writable<Stat<Data>[]> = writable([]);
    let currentFilters: Writable<StatFilterOrGroup<Data>> = writable([]);
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { EventTypes } from "../../graphql/generated/graphql-operations";
    import type { Stat } from "../../util/stats/Stat";
    import type { StatFilterOrGroup } from "../../util/stats/StatFilter";
    import { STAT_SET_2021_REMOTE, type FullTep2021Remote } from "../../util/stats/StatsRemote2021";
    import { OPR_STAT, STAT_SET_2021_SHARED } from "../../util/stats/StatsShared2021";
    import { STAT_SET_2021_TRAD, type FullTep2021Traditional } from "../../util/stats/StatsTrad2021";
    import { SortType } from "../SortButton.svelte";
    import StatsTable, { type ChosenSort } from "../stats/StatsTable.svelte";
    import { filterStatSet } from "../../util/stats/StatsSet";

    export let eventTypes: EventTypes;
    export let data: Data[];

    $: statSet =
        eventTypes == EventTypes.Remote
            ? STAT_SET_2021_REMOTE
            : eventTypes == EventTypes.Trad
            ? STAT_SET_2021_TRAD
            : STAT_SET_2021_SHARED;

    $: $shownStats = filterStatSet(statSet as any, $shownStats);

    const defaultSort: ChosenSort<Data> = { stat: OPR_STAT, type: SortType.HIGH_LOW };
    let currentSort: ChosenSort<Data> = defaultSort;

    let selectedTeam: number | null = null;
</script>

<StatsTable
    {statSet}
    {data}
    {shownStats}
    bind:selectedTeam
    {defaultSort}
    {currentSort}
    bind:currentFilters={$currentFilters}
    fileName={"Team Season Records 2021"}
/>
