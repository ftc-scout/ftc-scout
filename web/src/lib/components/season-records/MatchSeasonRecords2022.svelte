<script lang="ts" context="module">
    import { get, writable, type Writable } from "svelte/store";
    import { Region } from "../../graphql/generated/graphql-operations";
    import { emptyFilter, filterToSimpleJson, isEmpty, simpleJsonToFilter, type Filter } from "../../util/stats/filter";
    import type { Stat } from "../../util/stats/Stat";
    import { findInStatSet, type StatSet } from "../../util/stats/StatSet";
    import { SortType } from "../SortButton.svelte";
    import type { ChosenSort, StatData } from "../stats/StatsTable.svelte";

    type Data = FullScores2022Shared;

    let DEFAULT_SHOWN_STATS: Stat<Data>[] = [
        THIS_TOTAL_POINTS_NP_STAT,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        THIS_ENDGAME_POINTS_STAT,
        THIS_AUTO_CONE_POINTS,
        THIS_CIRCUIT_POINTS,
        TEAM_1,
        TEAM_2,
        TEAM_3,
        MATCH_DESCRIPTION_STAT as any,
        ALLIANCE_STAT as any,
        EVENT_STAT as any,
    ];

    let shownStats: Writable<Stat<Data>[]> = writable([
        THIS_TOTAL_POINTS_NP_STAT,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        THIS_ENDGAME_POINTS_STAT,
        THIS_AUTO_CONE_POINTS,
        THIS_CIRCUIT_POINTS,
        TEAM_1,
        TEAM_2,
        TEAM_3,
        MATCH_DESCRIPTION_STAT as any,
        ALLIANCE_STAT as any,
        EVENT_STAT as any,
    ]);
    export const DEFAULT_SORT_MATCH_2022: ChosenSort<Data> = {
        stat: THIS_TOTAL_POINTS_NP_STAT,
        type: SortType.HIGH_LOW,
    };

    let currentFilters: Writable<Filter<Data>> = writable(emptyFilter());

    let currentSort: Writable<ChosenSort<Data>> = writable(DEFAULT_SORT_MATCH_2022);

    export function getStatSet2022Matches(): StatSet<unknown, unknown> {
        return [...STAT_SET_MATCHES_2022];
    }

    function getCurrentSortFromUrl(url: URL): ChosenSort<Data> {
        let statSet = getStatSet2022Matches();

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

    export let match2022SearchParams: string = "";

    export function resetMatch2022SearchParams() {
        shownStats.set([
            THIS_TOTAL_POINTS_NP_STAT,
            THIS_AUTO_POINTS_STAT,
            THIS_DC_POINTS_STAT,
            THIS_ENDGAME_POINTS_STAT,
            THIS_AUTO_CONE_POINTS,
            THIS_CIRCUIT_POINTS,
            TEAM_1,
            TEAM_2,
            TEAM_3,
            MATCH_DESCRIPTION_STAT as any,
            ALLIANCE_STAT as any,
            EVENT_STAT as any,
        ]);
        currentSort.set(DEFAULT_SORT_MATCH_2022);
        currentFilters.set(emptyFilter());
        match2022SearchParams = "";
    }
</script>

<script lang="ts">
    import TeamSelectionBar from "../TeamSelectionBar.svelte";
    import { page } from "$app/stores";
    import { arraysEqual } from "../../util/array-eq";
    import { changeParam } from "./changeParams";
    import { regionToString } from "../../util/regions";
    import { dateToStr } from "../../util/format/pretty-print-date";
    import StatsTable from "../stats/StatsTable.svelte";
    import {
        ALLIANCE_STAT,
        EVENT_STAT,
        MATCH_DESCRIPTION_STAT,
        STAT_SET_MATCHES_2022,
        THIS_AUTO_CONE_POINTS,
        THIS_CIRCUIT_POINTS,
        TEAM_1,
        TEAM_2,
        TEAM_3,
        THIS_AUTO_POINTS_STAT,
        THIS_DC_POINTS_STAT,
        THIS_ENDGAME_POINTS_STAT,
        THIS_TOTAL_POINTS_NP_STAT,
        type FullScores2022Shared,
    } from "../../util/stats/2022/StatsMatches2022";

    export let region: Region;
    export let data: StatData<Data>[];
    export let currPage: number;
    export let totalCount: number;
    export let pageSize: number;
    export let startDate: Date | null;
    export let endDate: Date | null;

    let statSet: StatSet<unknown, unknown> = getStatSet2022Matches();
    $: statSet = getStatSet2022Matches();

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
        $currentSort.type == DEFAULT_SORT_MATCH_2022.type &&
        $currentSort.stat.identifierName == DEFAULT_SORT_MATCH_2022.stat.identifierName;
    $: isDefaultShownStats = arraysEqual(
        DEFAULT_SHOWN_STATS.map((s) => s.identifierName),
        $shownStats.map((s) => s.identifierName)
    );
    $: if ($page.params.tab == "matches")
        changeParam({
            sort: isDefaultSort ? null : $currentSort.stat.identifierName,
            ["sort-dir"]: isDefaultSort || $currentSort.type == SortType.HIGH_LOW ? null : "reverse",
            filter: isEmpty($currentFilters) ? null : JSON.stringify(filterToSimpleJson($currentFilters)),
            ["shown-stats"]: isDefaultShownStats ? null : JSON.stringify($shownStats.map((s) => s.identifierName)),
            region: region == Region.All ? null : regionToString(region),
            page: currPage == 1 ? null : "" + currPage,
            start: dateToStr(startDate),
            end: dateToStr(endDate),
        });
    $: if ($page.params.tab == "matches") match2022SearchParams = $page.url.searchParams.toString();

    export function change() {
        currPage = 1;
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
    defaultSort={DEFAULT_SORT_MATCH_2022}
    bind:currentSort={$currentSort}
    bind:currentFilters={$currentFilters}
    fileName={"Match Season Records 2022"}
    pagination
    bind:page={currPage}
    {totalCount}
    {pageSize}
    on:change={change}
/>
