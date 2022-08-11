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
        EVENT_STAT as any,
    ]);
    export const DEFAULT_SORT_TEAM_2021: ChosenSort<Data> = { stat: OPR_STAT, type: SortType.HIGH_LOW };

    let currentFilters: Writable<Filter<Data>> = writable(emptyFilter());

    export function getStatSet2021Teams(eventTypes: EventTypes): StatSet<unknown, unknown> {
        return [
            ...(eventTypes == EventTypes.Remote
                ? STAT_SET_2021_REMOTE
                : eventTypes == EventTypes.Trad
                ? STAT_SET_2021_TRAD
                : STAT_SET_2021_SHARED),
            ...STAT_SET_EVENT,
        ];
    }

    function getCurrentSortFromUrl(url: URL): ChosenSort<Data> {
        let eventTypes = EventTypes.Trad;
        let statSet = getStatSet2021Teams(eventTypes);

        let sortStatIdenName = url.searchParams.get("sort") ?? null;
        if (sortStatIdenName) {
            let sortStat = findInStatSet(statSet, sortStatIdenName);
            let direction = url.searchParams.get("sort-dir") == "reverse" ? SortType.LOW_HIGH : SortType.HIGH_LOW;
            if (sortStat) {
                return {
                    stat: sortStat,
                    type: direction,
                };
            }
        }
        return DEFAULT_SORT_TEAM_2021;
    }

    export let team2021SearchParams: string = "";
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
    import { filterStatSet, findInStatSet, type StatSet } from "../../util/stats/StatSet";
    import TeamSelectionBar from "../TeamSelectionBar.svelte";
    import { emptyFilter, filterToSimpleJson, isEmpty, simpleJsonToFilter, type Filter } from "../../util/stats/filter";
    import { EVENT_STAT, STAT_SET_EVENT } from "$lib/util/stats/StatsEvent";
    import { changeParam } from "./changeParams";
    import { page } from "$app/stores";

    export let eventTypes: EventTypes;
    export let data: Data[];
    export let currPage: number;
    export let totalCount: number;
    export let pageSize: number;

    let statSet: StatSet<unknown, unknown> = getStatSet2021Teams(eventTypes);
    $: statSet = getStatSet2021Teams(eventTypes);

    try {
        let startFilter = simpleJsonToFilter(JSON.parse($page.url.searchParams.get("filter") ?? ""), statSet);
        if (startFilter) $currentFilters = startFilter;
    } catch {}

    $: $shownStats = filterStatSet(statSet as any, $shownStats);

    let currentSort: ChosenSort<Data> = getCurrentSortFromUrl($page.url);

    let selectedTeam: number | null = null;
    let selectedTeamName: string | null = null;

    $: isDefualtSort =
        currentSort.type == DEFAULT_SORT_TEAM_2021.type &&
        currentSort.stat.identifierName == DEFAULT_SORT_TEAM_2021.stat.identifierName;
    $: if ($page.params.tab == "teams")
        changeParam({
            sort: isDefualtSort ? null : currentSort.stat.identifierName,
            ["sort-dir"]: isDefualtSort || currentSort.type == SortType.HIGH_LOW ? null : "reverse",
            filter: isEmpty($currentFilters) ? null : JSON.stringify(filterToSimpleJson($currentFilters)),
        });
    $: if ($page.params.tab == "teams") team2021SearchParams = $page.url.searchParams.toString();
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
    defaultSort={DEFAULT_SORT_TEAM_2021}
    bind:currentSort
    bind:currentFilters={$currentFilters}
    fileName={"Team Season Records 2021"}
    pagination
    bind:page={currPage}
    {totalCount}
    {pageSize}
/>
