<script lang="ts" context="module">
    export const load: Load = (event) => {
        let { params, url } = event;

        if (params.tab == "teams") {
            let eventTypes = eventTypesFromStr(url.searchParams.get("event-types") ?? "") ?? EventTypes.Trad;
            let statSet = getStatSet2021Teams(eventTypes);

            let region = regionFromStr(url.searchParams.get("region") ?? "All") ?? Region.All;

            let take = +(url.searchParams.get("take") ?? "50");
            let page = +(url.searchParams.get("page") ?? "1");

            let order: Tep2021Ordering[] = [
                {
                    field: DEFAULT_SORT_TEAM_2021.stat.apiField,
                    order: DEFAULT_SORT_TEAM_2021.type == SortType.HIGH_LOW ? Order.Desc : Order.Asc,
                },
            ];
            let sortStatIdenName = url.searchParams.get("sort") ?? null;
            if (sortStatIdenName) {
                let sortStat = findInStatSet(statSet, sortStatIdenName);
                if (sortStat) {
                    let field = sortStat.apiField;
                    let direction = url.searchParams.get("sort-dir") == "reverse" ? Order.Asc : Order.Desc;
                    order = [{ field, order: direction }, ...order];
                }
            }

            let filter = emptyFilter();
            let filterParam = url.searchParams.get("filter") ?? null;
            if (filterParam != null) {
                try {
                    let parsed = JSON.parse(filterParam);
                    let urlFilter = simpleJsonToFilter(parsed, statSet);
                    if (urlFilter) filter = urlFilter;
                } catch {}
            }
            let apiFilter = filterToApiFilter(filter);

            return queryLoad("teams2021", TeamSeasonRecords2021Document, {
                skip: Math.max((page - 1) * take, 0),
                take,
                filter: apiFilter,
                order,
                eventTypes,
                region,
            })(event);
        } else if (params.tab == "matches") {
            return {};
        } else {
            throw "impossible";
        }
    };

    export function eventTypesFromStr(str: string): EventTypes | null {
        switch (str) {
            case "Traditional":
                return EventTypes.Trad;
            case "Remote":
                return EventTypes.Remote;
            case "Traditional and Remote":
                return EventTypes.TradAndRemote;
            default:
                return null;
        }
    }

    export function eventTypesToStr(str: EventTypes): "Traditional" | "Remote" | "Traditional and Remote" {
        switch (str) {
            case EventTypes.Trad:
                return "Traditional";
            case EventTypes.Remote:
                return "Remote";
            default:
                return "Traditional and Remote";
        }
    }
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import RegionsDropdown from "$lib/components/season-records/RegionsDropdown.svelte";
    import { SortType } from "$lib/components/SortButton.svelte";
    import { regionFromStr, regionToString } from "$lib/util/regions";
    import { emptyFilter, filterToApiFilter, simpleJsonToFilter } from "$lib/util/stats/filter";
    import type { StatData } from "$lib/util/stats/Stat";
    import { findInStatSet } from "$lib/util/stats/StatSet";
    import type { ApolloQueryResult } from "@apollo/client";
    import type { Load } from "@sveltejs/kit";
    import type { Readable } from "svelte/store";
    import Card from "../../../lib/components/Card.svelte";
    import Dropdown from "../../../lib/components/Dropdown.svelte";
    import TeamSeasonRecords2021, {
        DEFAULT_SORT_TEAM_2021,
        getStatSet2021Teams,
        team2021SearchParams,
    } from "../../../lib/components/season-records/TeamSeasonRecords2021.svelte";
    import SkeletonRow from "../../../lib/components/skeleton/SkeletonRow.svelte";
    import TabbedCard from "../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../lib/components/tabs/TabContent.svelte";
    import WidthProvider from "../../../lib/components/WidthProvider.svelte";
    import {
        EventTypes,
        Order,
        Region,
        TeamSeasonRecords2021Document,
        type TeamSeasonRecords2021Query,
        type Tep2021Ordering,
    } from "../../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../../lib/graphql/query-load";
    import { TEAMS_ICON, MATCHES_ICON } from "../../../lib/icons";
    import { prettyPrintSeason } from "../../../lib/util/format/pretty-print-season";
    import type { FullTep2021Remote } from "../../../lib/util/stats/StatsRemote2021";
    import type { FullTep2021Traditional } from "../../../lib/util/stats/StatsTrad2021";

    function gotoSubPage(name: string) {
        if (browser && $page.routeId == "records/[season=season]/[tab=records_tab]") {
            let searchParams = name.toLowerCase() == "teams" ? team2021SearchParams : null;
            goto(`/records/${$page.params.season}/${name.toLowerCase()}${searchParams ? "?" + searchParams : ""}`, {
                replaceState: true,
            });
        }
    }

    let selectedPage: string = $page.params.tab;
    $: gotoSubPage(selectedPage);

    $: season = +$page.params.season as 2021;

    export let teams2021: Readable<ApolloQueryResult<TeamSeasonRecords2021Query>>;
    $: data2021 = !$teams2021 ? undefined : $teams2021.data.teamRecords2021;
    let data2021Teams: StatData<FullTep2021Traditional | FullTep2021Remote>[] | undefined;
    $: data2021Teams = data2021?.teps.map((t) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.tep,
    })) as any;

    let eventTypesStr: "Traditional" | "Remote" | "Traditional and Remote" = eventTypesToStr(
        eventTypesFromStr($page.url.searchParams.get("event-types") ?? "") ?? EventTypes.Trad
    );
    $: eventTypes = eventTypesFromStr(eventTypesStr) ?? EventTypes.Trad;

    let regionStr: string = regionToString(regionFromStr($page.url.searchParams.get("region") ?? "ALL") ?? Region.All);
    $: region = regionFromStr(regionStr) ?? Region.All;
</script>

<svelte:head>
    <title>
        {`${season} ${$page.params.tab == "teams" ? "Team" : "Match"} Records | FTC Scout`}
    </title>
</svelte:head>

<WidthProvider width={"1250px"}>
    <Card>
        <h1>{prettyPrintSeason(season)} Season Records</h1>

        <p>
            <span>Season:</span>
            <Dropdown items={["2021 Freight Frenzy"]} value="2021 Freight Frenzy" style="width: calc(100% - 15ch)" />
        </p>
        <p>
            <span>Event Types:</span>
            <Dropdown
                items={["Traditional", "Remote", "Traditional and Remote"]}
                bind:value={eventTypesStr}
                style="width: calc(100% - 15ch)"
            />
        </p>
        <p>
            <span>Regions:</span>
            <RegionsDropdown bind:value={regionStr} style="width: calc(100% - 15ch)" />
        </p>
    </Card>

    <TabbedCard
        names={[
            [MATCHES_ICON, "Matches"],
            [TEAMS_ICON, "Teams"],
        ]}
        bind:selectedName={selectedPage}
    >
        <TabContent name="Matches">Matches</TabContent>

        <TabContent name="Teams">
            {#if data2021 && data2021Teams}
                {@const totalCount = data2021.count}
                <!-- TODO add this to query -->
                {@const pageSize = Math.min(+($page.url.searchParams.get("take") ?? "50"), 50)}
                {@const page = data2021.offset / pageSize + 1}

                <TeamSeasonRecords2021
                    {eventTypes}
                    data={data2021Teams}
                    currPage={page}
                    {totalCount}
                    {pageSize}
                    {region}
                />
            {:else}
                <SkeletonRow rows={50} card={false} header={false} />
            {/if}
        </TabContent>
    </TabbedCard>
</WidthProvider>

<style>
    p {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    span {
        display: inline-block;
        width: 12ch;

        font-size: var(--large-font-size);
        font-weight: normal;
    }
</style>
