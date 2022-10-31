<script lang="ts" context="module">
    type Data = FullTep2022;

    let DEFAULT_SHOWN_STATS: Stat<Data>[] = [
        TEAM_STAT,
        NP_OPR_STAT,
        AUTO_OPR_STAT,
        TELEOP_OPR_STAT,
        ENDGAME_OPR_STAT,
        NP_AVERAGE_STAT,
        EVENT_RANK_STAT,
        EVENT_STAT_2022 as any,
        RECORD_STAT,
    ];

    let shownStats: Writable<Stat<Data>[]> = writable([
        TEAM_STAT,
        NP_OPR_STAT,
        AUTO_OPR_STAT,
        TELEOP_OPR_STAT,
        ENDGAME_OPR_STAT,
        NP_AVERAGE_STAT,
        EVENT_RANK_STAT,
        EVENT_STAT_2022 as any,
        RECORD_STAT,
    ]);
    export const DEFAULT_SORT_TEAM_2022: ChosenSort<Data> = { stat: NP_OPR_STAT, type: SortType.HIGH_LOW };

    let currentFilters: Writable<Filter<Data>> = writable(emptyFilter());

    let currentSort: Writable<ChosenSort<Data>> = writable(DEFAULT_SORT_TEAM_2022);

    export function getStatSet2022Teams(_eventTypes: EventTypes): StatSet<unknown, unknown> {
        return [...STAT_SET_TEAMS_2022, ...STAT_SET_EVENT_2022];
    }

    function getCurrentSortFromUrl(url: URL): ChosenSort<Data> {
        let eventTypes = EventTypes.Trad;
        let statSet = getStatSet2022Teams(eventTypes);

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

    export let team2022SearchParams: string = "";

    export function resetTeam2022SearchParams() {
        shownStats.set([
            TEAM_STAT,
            NP_OPR_STAT,
            AUTO_OPR_STAT,
            TELEOP_OPR_STAT,
            ENDGAME_OPR_STAT,
            NP_AVERAGE_STAT,
            EVENT_RANK_STAT,
            EVENT_STAT_2022 as any,
            RECORD_STAT,
        ]);
        currentSort.set(DEFAULT_SORT_TEAM_2022);
        currentFilters.set(emptyFilter());
        team2022SearchParams = "";
    }
</script>

<script lang="ts">
    import { get, writable, type Writable } from "svelte/store";
    import { EventTypes, Region } from "../../graphql/generated/graphql-operations";
    import type { Stat } from "../../util/stats/Stat";
    import {
        AUTO_OPR_STAT,
        NP_AVERAGE_STAT,
        ENDGAME_OPR_STAT,
        NP_OPR_STAT,
        EVENT_RANK_STAT,
        STAT_SET_TEAMS_2022,
        TEAM_STAT,
        TELEOP_OPR_STAT,
        RECORD_STAT,
    } from "../../util/stats/2022/StatsTeams2022";
    import { SortType } from "../SortButton.svelte";
    import StatsTable, { type ChosenSort, type StatData } from "../stats/StatsTable.svelte";
    import { findInStatSet, type StatSet } from "../../util/stats/StatSet";
    import TeamSelectionBar from "../TeamSelectionBar.svelte";
    import { emptyFilter, filterToSimpleJson, isEmpty, simpleJsonToFilter, type Filter } from "../../util/stats/filter";
    import { EVENT_STAT_2022, STAT_SET_EVENT_2022 } from "$lib/util/stats/StatsEvent";
    import { changeParam } from "./changeParams";
    import { page } from "$app/stores";
    import { arraysEqual } from "$lib/util/array-eq";
    import { regionToString } from "$lib/util/regions";
    import { dateToStr } from "$lib/util/format/pretty-print-date";
    import { eventTypesToStr } from "../../../routes/records/[season=season]/[tab=records_tab]/+page";
    import type { FullTep2022 } from "../../util/stats/2022/StatsTeams2022";

    export let eventTypes: EventTypes;
    export let region: Region;
    export let data: StatData<Data>[];
    export let currPage: number;
    export let totalCount: number;
    export let pageSize: number;
    export let startDate: Date | null;
    export let endDate: Date | null;

    let statSet: StatSet<unknown, unknown> = getStatSet2022Teams(eventTypes);
    $: statSet = getStatSet2022Teams(eventTypes);

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
        $currentSort.type == DEFAULT_SORT_TEAM_2022.type &&
        $currentSort.stat.identifierName == DEFAULT_SORT_TEAM_2022.stat.identifierName;
    $: isDefaultShownStats = arraysEqual(
        DEFAULT_SHOWN_STATS.map((s) => s.identifierName),
        $shownStats.map((s) => s.identifierName)
    );
    $: if ($page.params.tab == "teams")
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
    $: if ($page.params.tab == "teams") team2022SearchParams = $page.url.searchParams.toString();

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
    defaultSort={DEFAULT_SORT_TEAM_2022}
    bind:currentSort={$currentSort}
    bind:currentFilters={$currentFilters}
    fileName={"Team Season Records 2022"}
    pagination
    bind:page={currPage}
    {totalCount}
    {pageSize}
    on:change={change}
/>
