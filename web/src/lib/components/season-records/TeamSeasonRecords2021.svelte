<script lang="ts" context="module">
    type Data = FullTep2021Traditional | FullTep2021Remote;

    let shownStats: Writable<Stat<Data>[]> = writable([
        TEAM_STAT,
        OPR_STAT,
        NP_OPR_STAT,
        AUTO_OPR_STAT,
        TELEOP_OPR_STAT,
        ENDGAME_OPR_STAT,
        AVERAGE_STAT,
        RANK_STAT,
    ]);
    let currentFilters: Writable<Filter<Data>> = writable(emptyFilter());
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { EventTypes } from "../../graphql/generated/graphql-operations";
    import type { Stat } from "../../util/stats/Stat";
    import { STAT_SET_2021_REMOTE, type FullTep2021Remote } from "../../util/stats/StatsRemote2021";
    import {
        AUTO_OPR_STAT,
        AVERAGE_STAT,
        ENDGAME_OPR_STAT,
        NP_OPR_STAT,
        OPR_STAT,
        RANK_STAT,
        STAT_SET_2021_SHARED,
        TEAM_STAT,
        TELEOP_OPR_STAT,
    } from "../../util/stats/StatsShared2021";
    import { STAT_SET_2021_TRAD, type FullTep2021Traditional } from "../../util/stats/StatsTrad2021";
    import { SortType } from "../SortButton.svelte";
    import StatsTable, { type ChosenSort } from "../stats/StatsTable.svelte";
    import { filterStatSet } from "../../util/stats/StatsSet";
    import TeamSelectionBar from "../TeamSelectionBar.svelte";
    import { emptyFilter, type Filter } from "../../util/stats/filter";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";

    export let eventTypes: EventTypes;
    export let data: Data[];
    export let page: number;
    export let totalCount: number;
    export let pageSize: number;

    $: if (browser) {
        let url = `?page=${page}`;
        goto(url);
    }

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
    let selectedTeamName: string | null = null;
</script>

{#if selectedTeam && selectedTeamName}
    <TeamSelectionBar tep={null} number={selectedTeam} name={selectedTeamName} />
{/if}

<StatsTable
    {statSet}
    {data}
    {shownStats}
    bind:selectedTeam
    bind:selectedTeamName
    {defaultSort}
    {currentSort}
    bind:currentFilters={$currentFilters}
    fileName={"Team Season Records 2021"}
    pagination
    bind:page
    {totalCount}
    {pageSize}
/>
