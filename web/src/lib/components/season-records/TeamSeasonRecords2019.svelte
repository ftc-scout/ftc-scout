<script lang="ts" context="module">
    type Data = FullTep2019;

    let DEFAULT_SHOWN_STATS: Stat<Data>[] = [
        TEAM_STAT,
        OPR_STAT,
        NP_OPR_STAT,
        AUTO_OPR_STAT,
        TELEOP_OPR_STAT,
        ENDGAME_OPR_STAT,
        AVERAGE_STAT,
        EVENT_RANK_STAT,
        EVENT_STAT_2019 as any,
        RECORD_STAT,
    ];

    let shownStats: Writable<Stat<Data>[]> = writable([
        TEAM_STAT,
        OPR_STAT,
        NP_OPR_STAT,
        AUTO_OPR_STAT,
        TELEOP_OPR_STAT,
        ENDGAME_OPR_STAT,
        AVERAGE_STAT,
        EVENT_RANK_STAT,
        EVENT_STAT_2019 as any,
        RECORD_STAT,
    ]);
    export const DEFAULT_SORT_TEAM_2019: ChosenSort<Data> = { stat: OPR_STAT, type: SortType.HIGH_LOW };

    let currentFilters: Writable<Filter<Data>> = writable(emptyFilter());

    let currentSort: Writable<ChosenSort<Data>> = writable(DEFAULT_SORT_TEAM_2019);

    export function getStatSet2019Teams(): StatSet<unknown, unknown> {
        return [...STAT_SET_TEAMS_2019, ...STAT_SET_EVENT_2019];
    }

    function getCurrentSortFromUrl(url: URL): ChosenSort<Data> {
        let statSet = getStatSet2019Teams();

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

    export let team2019SearchParams: string = "";
</script>

<script lang="ts">
    import { get, writable, type Writable } from "svelte/store";
    import { Region } from "../../graphql/generated/graphql-operations";
    import type { Stat } from "../../util/stats/Stat";
    import { SortType } from "../SortButton.svelte";
    import StatsTable, { type ChosenSort, type StatData } from "../stats/StatsTable.svelte";
    import { findInStatSet, type StatSet } from "../../util/stats/StatSet";
    import TeamSelectionBar from "../TeamSelectionBar.svelte";
    import { emptyFilter, filterToSimpleJson, isEmpty, simpleJsonToFilter, type Filter } from "../../util/stats/filter";
    import { EVENT_STAT_2019, STAT_SET_EVENT_2019 } from "$lib/util/stats/StatsEvent";
    import { changeParam } from "./changeParams";
    import { page } from "$app/stores";
    import { arraysEqual } from "$lib/util/array-eq";
    import { regionToString } from "$lib/util/regions";
    import { dateToStr } from "$lib/util/format/pretty-print-date";
    import {
        AUTO_OPR_STAT,
        AVERAGE_STAT,
        ENDGAME_OPR_STAT,
        EVENT_RANK_STAT,
        NP_OPR_STAT,
        OPR_STAT,
        RECORD_STAT,
        STAT_SET_TEAMS_2019,
        TEAM_STAT,
        TELEOP_OPR_STAT,
        type FullTep2019,
    } from "../../util/stats/2019/StatsTeams2019";

    export let region: Region;
    export let data: StatData<Data>[];
    export let currPage: number;
    export let totalCount: number;
    export let pageSize: number;
    export let startDate: Date | null;
    export let endDate: Date | null;

    let statSet: StatSet<unknown, unknown> = getStatSet2019Teams();
    $: statSet = getStatSet2019Teams();

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
        $currentSort.type == DEFAULT_SORT_TEAM_2019.type &&
        $currentSort.stat.identifierName == DEFAULT_SORT_TEAM_2019.stat.identifierName;
    $: isDefaultShownStats = arraysEqual(
        DEFAULT_SHOWN_STATS.map((s) => s.identifierName),
        $shownStats.map((s) => s.identifierName)
    );
    $: if ($page.params.tab == "teams")
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
    $: if ($page.params.tab == "teams") team2019SearchParams = $page.url.searchParams.toString();

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
    defaultSort={DEFAULT_SORT_TEAM_2019}
    bind:currentSort={$currentSort}
    bind:currentFilters={$currentFilters}
    fileName={"Team Season Records 2019"}
    pagination
    bind:page={currPage}
    {totalCount}
    {pageSize}
    on:change={change}
/>
