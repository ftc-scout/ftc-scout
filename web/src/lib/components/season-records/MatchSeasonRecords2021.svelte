<script lang="ts" context="module">
    import { get, writable, type Writable } from "svelte/store";
    import { EventTypes, Region } from "../../graphql/generated/graphql-operations";
    import {
        STAT_SET_MATCHES_2021_SHARED,
        THIS_TOTAL_POINTS_STAT,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        type FullScores2021Shared,
        THIS_ENDGAME_POINTS_STAT,
        THIS_AUTO_FREIGHT_STAT,
        THIS_DC_ALLIANCE_3_STAT,
        THIS_DC_SHARED_STAT,
        THIS_END_SHARED_STAT,
        THIS_END_DELIVERED_STAT,
        THIS_END_CAPPED_STAT,
    } from "../../util/stats/2021/StatsSharedMatches2021";
    import { emptyFilter, filterToSimpleJson, isEmpty, simpleJsonToFilter, type Filter } from "../../util/stats/filter";
    import type { Stat } from "../../util/stats/Stat";
    import { findInStatSet, type StatSet } from "../../util/stats/StatSet";
    import { SortType } from "../SortButton.svelte";
    import type { ChosenSort, StatData } from "../stats/StatsTable.svelte";

    type Data = FullScores2021Shared;

    let DEFAULT_SHOWN_STATS: Stat<Data>[] = [
        THIS_TOTAL_POINTS_STAT,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        THIS_ENDGAME_POINTS_STAT,
        THIS_AUTO_FREIGHT_STAT,
        THIS_DC_ALLIANCE_3_STAT,
        THIS_DC_SHARED_STAT,
        THIS_END_SHARED_STAT,
        THIS_END_DELIVERED_STAT,
        THIS_END_CAPPED_STAT,
    ];

    let shownStats: Writable<Stat<Data>[]> = writable([
        THIS_TOTAL_POINTS_STAT,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        THIS_ENDGAME_POINTS_STAT,
        THIS_AUTO_FREIGHT_STAT,
        THIS_DC_ALLIANCE_3_STAT,
        THIS_DC_SHARED_STAT,
        THIS_END_SHARED_STAT,
        THIS_END_DELIVERED_STAT,
        THIS_END_CAPPED_STAT,
    ]);
    export const DEFAULT_SORT_MATCH_2021: ChosenSort<Data> = { stat: THIS_TOTAL_POINTS_STAT, type: SortType.HIGH_LOW };

    let currentFilters: Writable<Filter<Data>> = writable(emptyFilter());

    let currentSort: Writable<ChosenSort<Data>> = writable(DEFAULT_SORT_MATCH_2021);

    export function getStatSet2021Matches(): StatSet<unknown, unknown> {
        return [...STAT_SET_MATCHES_2021_SHARED];
    }

    function getCurrentSortFromUrl(url: URL): ChosenSort<Data> {
        let statSet = getStatSet2021Matches();

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
        return get(currentSort);
    }

    export let match2021SearchParams: string = "";
</script>

<script lang="ts">
    import TeamSelectionBar from "../TeamSelectionBar.svelte";
    import { page } from "$app/stores";
    import { arraysEqual } from "../../util/array-eq";
    import { changeParam } from "./changeParams";
    import { eventTypesToStr } from "../../../routes/records/[season=season]/[tab=records_tab]/+page";
    import { regionToString } from "../../util/regions";
    import { dateToStr } from "../../util/format/pretty-print-date";
    import StatsTable from "../stats/StatsTable.svelte";

    export let eventTypes: EventTypes;
    export let region: Region;
    export let data: StatData<Data>[];
    export let currPage: number;
    export let totalCount: number;
    export let pageSize: number;
    export let startDate: Date | null;
    export let endDate: Date | null;

    let statSet: StatSet<unknown, unknown> = getStatSet2021Matches();
    $: statSet = getStatSet2021Matches();

    try {
        let startFilter = simpleJsonToFilter(JSON.parse($page.url.searchParams.get("filter") ?? ""), statSet);
        if (startFilter) $currentFilters = startFilter;
    } catch {}

    try {
        let parsed = JSON.parse($page.url.searchParams.get("shown-stats") ?? "");
        let stats = parsed.map((s: string) => findInStatSet(statSet, s));
        $shownStats = stats;
    } catch {}

    $currentSort = getCurrentSortFromUrl($page.url);

    let selectedTeam: number | null = null;
    let selectedTeamName: string | null = null;

    $: isDefaultSort =
        $currentSort.type == DEFAULT_SORT_MATCH_2021.type &&
        $currentSort.stat.identifierName == DEFAULT_SORT_MATCH_2021.stat.identifierName;
    $: isDefaultShownStats = arraysEqual(
        DEFAULT_SHOWN_STATS.map((s) => s.identifierName),
        $shownStats.map((s) => s.identifierName)
    );
    $: if ($page.params.tab == "matches")
        changeParam({
            sort: isDefaultSort ? null : $currentSort.stat.identifierName,
            ["sort-dir"]: isDefaultSort || $currentSort.type == SortType.HIGH_LOW ? null : "reverse",
            filter: isEmpty($currentFilters) ? null : JSON.stringify(filterToSimpleJson($currentFilters)),
            ["event-types"]: eventTypes == EventTypes.TradAndRemote ? null : eventTypesToStr(eventTypes),
            ["shown-stats"]: isDefaultShownStats ? null : JSON.stringify($shownStats.map((s) => s.identifierName)),
            region: region == Region.All ? null : regionToString(region),
            page: currPage == 1 ? null : "" + currPage,
            start: dateToStr(startDate),
            end: dateToStr(endDate),
        });
    $: if ($page.params.tab == "matches") match2021SearchParams = $page.url.searchParams.toString();

    function change() {
        currPage = 0;
    }
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
    defaultSort={DEFAULT_SORT_MATCH_2021}
    bind:currentSort={$currentSort}
    bind:currentFilters={$currentFilters}
    fileName={"Match Season Records 2021"}
    pagination
    bind:page={currPage}
    {totalCount}
    {pageSize}
    on:change={change}
/>
