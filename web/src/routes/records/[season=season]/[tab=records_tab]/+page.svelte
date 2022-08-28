<script lang="ts">
    import type { PageData } from "./$types";
    import { browser } from "$app/env";
    import { afterNavigate, goto } from "$app/navigation";
    import { page } from "$app/stores";
    import DateRange from "$lib/components/DateRange.svelte";
    import RegionsDropdown from "$lib/components/season-records/RegionsDropdown.svelte";
    import { regionFromStr, regionToString } from "$lib/util/regions";
    import type { StatData } from "$lib/util/stats/Stat";
    import type { ApolloQueryResult } from "@apollo/client";
    import type { Readable } from "svelte/store";
    import Card from "../../../../lib/components/Card.svelte";
    import Dropdown from "../../../../lib/components/Dropdown.svelte";
    import TeamSeasonRecords2021, {
        team2021SearchParams,
    } from "../../../../lib/components/season-records/TeamSeasonRecords2021.svelte";
    import TeamSeasonRecords2019, {
        team2019SearchParams,
    } from "../../../../lib/components/season-records/TeamSeasonRecords2019.svelte";
    import SkeletonRow from "../../../../lib/components/skeleton/SkeletonRow.svelte";
    import TabbedCard from "../../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../../lib/components/tabs/TabContent.svelte";
    import WidthProvider from "../../../../lib/components/WidthProvider.svelte";
    import {
        EventTypes,
        Region,
        type TeamSeasonRecords2019Query,
        type TeamSeasonRecords2021Query,
    } from "../../../../lib/graphql/generated/graphql-operations";
    import { TEAMS_ICON, MATCHES_ICON } from "../../../../lib/icons";
    import { prettyPrintSeason } from "../../../../lib/util/format/pretty-print-season";
    import type { FullTep2021Remote } from "../../../../lib/util/stats/StatsRemote2021";
    import type { FullTep2021Traditional } from "../../../../lib/util/stats/StatsTrad2021";
    import { eventTypesFromStr, eventTypesToStr, readDateFromUrl } from "./+page";
    import { CURRENT_SEASON } from "../../../../lib/constants";
    import type { FullTep2019 } from "../../../../lib/util/stats/Stats2019";

    afterNavigate(({ to }) => {
        if (to.pathname.startsWith("/records")) {
            document.getElementById("content")?.scrollTo({ top: 0 });
        }
    });

    function getSearchParams(name: string, season: 2021 | 2019): string | null {
        if (name.toLocaleLowerCase() == "teams") {
            switch (season) {
                case 2021:
                    return team2021SearchParams;
                case 2019:
                    return team2019SearchParams;
            }
        } else {
            return null;
        }
    }

    function gotoSubPage(season: 2021 | 2019, name: string) {
        if (browser && $page.routeId == "records/[season=season]/[tab=records_tab]") {
            let searchParams = getSearchParams(name, season);
            goto(`/records/${season}/${name.toLowerCase()}${searchParams ? "?" + searchParams : ""}`, {
                replaceState: true,
            });
        }
    }

    export let data: PageData;
    let teams2021: Readable<ApolloQueryResult<TeamSeasonRecords2021Query> | null> | undefined;
    let teams2019: Readable<ApolloQueryResult<TeamSeasonRecords2019Query> | null> | undefined;
    $: ({ teams2021, teams2019 } = data);

    $: data2021 = !$teams2021 ? undefined : $teams2021.data.teamRecords2021;
    let data2021Teams: StatData<FullTep2021Traditional | FullTep2021Remote>[] | undefined;
    $: data2021Teams = data2021?.teps.map((t) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.tep,
    })) as any;

    $: data2019 = !$teams2019 ? undefined : $teams2019.data.teamRecords2019;
    let data2019Teams: StatData<FullTep2019>[] | undefined;
    $: data2019Teams = data2019?.teps.map((t: any) => ({
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

    let startDate: Date | null = readDateFromUrl($page.url.searchParams.get("start"));
    let endDate: Date | null = readDateFromUrl($page.url.searchParams.get("end"));

    function seasonToStr(season: 2021 | 2019): string {
        return {
            2021: "2021 Freight Frenzy",
            2019: "2019 Skystone",
        }[season];
    }

    function seasonFromStr(str: string): 2019 | 2021 | null {
        return (
            {
                "2021 Freight Frenzy": 2021 as const,
                "2019 Skystone": 2019 as const,
            }[str] ?? null
        );
    }

    let seasonStr = seasonToStr(+$page.params.season as 2019 | 2021);
    $: season = seasonFromStr(seasonStr) ?? CURRENT_SEASON;

    let selectedPage: string = $page.params.tab;
    $: gotoSubPage(season, selectedPage);
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
            <Dropdown
                items={["2021 Freight Frenzy", "2019 Skystone"]}
                bind:value={seasonStr}
                style="width: calc(100% - 15ch)"
            />
        </p>
        {#if season != 2019}
            <p>
                <span>Event Types:</span>
                <Dropdown
                    items={["Traditional", "Remote", "Traditional and Remote"]}
                    bind:value={eventTypesStr}
                    style="width: calc(100% - 15ch)"
                />
            </p>
        {/if}
        <p>
            <span>Regions:</span>
            <RegionsDropdown bind:value={regionStr} style="width: calc(100% - 15ch)" />
        </p>
        <p>
            <span>From:</span>
            <DateRange style="width: calc(100% - 15ch)" {season} bind:startDate bind:endDate />
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
                    {startDate}
                    {endDate}
                />
            {:else if data2019 && data2019Teams}
                {@const totalCount = data2019.count}
                <!-- TODO add this to query -->
                {@const pageSize = Math.min(+($page.url.searchParams.get("take") ?? "50"), 50)}
                {@const page = data2019.offset / pageSize + 1}

                <TeamSeasonRecords2019
                    data={data2019Teams}
                    currPage={page}
                    {totalCount}
                    {pageSize}
                    {region}
                    {startDate}
                    {endDate}
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
