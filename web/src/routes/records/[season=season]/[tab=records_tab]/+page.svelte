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
        resetTeam2021SearchParams,
        team2021SearchParams,
    } from "../../../../lib/components/season-records/TeamSeasonRecords2021.svelte";
    import TeamSeasonRecords2019, {
        resetTeam2019SearchParams,
        team2019SearchParams,
    } from "../../../../lib/components/season-records/TeamSeasonRecords2019.svelte";
    import SkeletonRow from "../../../../lib/components/skeleton/SkeletonRow.svelte";
    import TabbedCard from "../../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../../lib/components/tabs/TabContent.svelte";
    import WidthProvider from "../../../../lib/components/WidthProvider.svelte";
    import {
        EventTypes,
        Region,
        type MatchScoresAlliance,
        type MatchSeasonRecords2019Query,
        type MatchSeasonRecords2020Query,
        type MatchSeasonRecords2021Query,
        type TeamSeasonRecords2019Query,
        type TeamSeasonRecords2020Query,
        type TeamSeasonRecords2021Query,
    } from "../../../../lib/graphql/generated/graphql-operations";
    import { TEAMS_ICON, MATCHES_ICON } from "../../../../lib/icons";
    import { prettyPrintSeason } from "../../../../lib/util/format/pretty-print-season";
    import { eventTypesFromStr, eventTypesToStr, readDateFromUrl } from "./+page";
    import type { FullTep2019 } from "../../../../lib/util/stats/2019/StatsTeams2019";
    import SeasonDropdown from "../../../../lib/components/SeasonDropdown.svelte";
    import type { Season } from "../../../../lib/constants";
    import Head from "../../../../lib/components/nav/Head.svelte";
    import type { FullTep2021Shared } from "../../../../lib/util/stats/2021/StatsSharedTeams2021";
    import MatchSeasonRecords2021, {
        match2021SearchParams,
        resetMatch2021SearchParams,
    } from "../../../../lib/components/season-records/MatchSeasonRecords2021.svelte";
    import FaButton from "../../../../lib/components/FaButton.svelte";
    import { faTrash } from "@fortawesome/free-solid-svg-icons";
    import MatchSeasonRecords2019, {
        match2019SearchParams,
        resetMatch2019SearchParams,
    } from "../../../../lib/components/season-records/MatchSeasonRecords2019.svelte";
    import TeamSeasonRecords2020, {
        resetTeam2020SearchParams,
        team2020SearchParams,
    } from "../../../../lib/components/season-records/TeamSeasonRecords2020.svelte";
    import type { FullTep2020Shared } from "../../../../lib/util/stats/2020/StatsSharedTeams2020";
    import MatchSeasonRecords2020, {
        match2020SearchParams,
        resetMatch2020SearchParams,
    } from "../../../../lib/components/season-records/MatchSeasonRecords2020.svelte";

    afterNavigate(({ to }) => {
        if (to.pathname.startsWith("/records")) {
            document.getElementById("content")?.scrollTo({ top: 0 });
        }
    });

    function getSearchParams(name: string, season: Season): string | null {
        if (name.toLocaleLowerCase() == "teams") {
            switch (season) {
                case 2021:
                    return team2021SearchParams;
                case 2020:
                    return team2020SearchParams;
                case 2019:
                    return team2019SearchParams;
            }
        } else if (name.toLocaleLowerCase() == "matches") {
            switch (season) {
                case 2021:
                    return match2021SearchParams;
                case 2020:
                    return match2020SearchParams;
                case 2019:
                    return match2019SearchParams;
            }
        } else {
            return null;
        }
    }

    function gotoSubPage(season: Season, name: string) {
        if (browser && $page.routeId == "records/[season=season]/[tab=records_tab]") {
            let searchParams = getSearchParams(name, season);
            goto(`/records/${season}/${name.toLowerCase()}${searchParams ? "?" + searchParams : ""}`, {
                replaceState: true,
            });
        }
    }

    export let data: PageData;
    let teams2021: Readable<ApolloQueryResult<TeamSeasonRecords2021Query> | null> | undefined;
    let matches2021: Readable<ApolloQueryResult<MatchSeasonRecords2021Query> | null> | undefined;
    let teams2020: Readable<ApolloQueryResult<TeamSeasonRecords2020Query> | null> | undefined;
    let matches2020: Readable<ApolloQueryResult<MatchSeasonRecords2020Query> | null> | undefined;
    let teams2019: Readable<ApolloQueryResult<TeamSeasonRecords2019Query> | null> | undefined;
    let matches2019: Readable<ApolloQueryResult<MatchSeasonRecords2019Query> | null> | undefined;
    $: ({ teams2021, matches2021, teams2020, matches2020, teams2019, matches2019 } = data);

    $: dataTeams2021 = !$teams2021 ? undefined : $teams2021.data.teamRecords2021;
    let dataTeams2021Teps: StatData<FullTep2021Shared>[] | undefined;
    $: dataTeams2021Teps = dataTeams2021?.teps?.map((t) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.tep,
    })) as any;

    $: dataMatches2021 = !$matches2021 ? undefined : $matches2021.data.matchRecords2021;
    let dataMatches2021Scores: StatData<MatchScoresAlliance>[] | undefined;
    $: dataMatches2021Scores = dataMatches2021?.scores?.map((t) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.score,
    })) as any;

    $: dataTeams2020 = !$teams2020 ? undefined : $teams2020.data.teamRecords2020;
    let dataTeams2020Teps: StatData<FullTep2020Shared>[] | undefined;
    $: dataTeams2020Teps = dataTeams2020?.teps?.map((t) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.tep,
    })) as any;

    $: dataMatches2020 = !$matches2020 ? undefined : $matches2020.data.matchRecords2020;
    let dataMatches2020Scores: StatData<MatchScoresAlliance>[] | undefined;
    $: dataMatches2020Scores = dataMatches2020?.scores?.map((t) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.score,
    })) as any;

    $: data2019 = !$teams2019 ? undefined : $teams2019.data.teamRecords2019;
    let data2019Teams: StatData<FullTep2019>[] | undefined;
    $: data2019Teams = data2019?.teps.map((t: any) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.tep,
    })) as any;

    $: dataMatches2019 = !$matches2019 ? undefined : $matches2019.data.matchRecords2019;
    let dataMatches2019Scores: StatData<MatchScoresAlliance>[] | undefined;
    $: dataMatches2019Scores = dataMatches2019?.scores?.map((t) => ({
        rank: t.rank,
        preFilterRank: t.preFilterRank,
        data: t.score,
    })) as any;

    let eventTypesStr: "Traditional" | "Remote" | "Traditional and Remote" = eventTypesToStr(
        eventTypesFromStr($page.url.searchParams.get("event-types") ?? "") ?? EventTypes.TradAndRemote
    );
    $: eventTypes = eventTypesFromStr(eventTypesStr) ?? EventTypes.Trad;

    let regionStr: string = regionToString(regionFromStr($page.url.searchParams.get("region") ?? "ALL") ?? Region.All);
    $: region = regionFromStr(regionStr) ?? Region.All;

    let startDate: Date | null = readDateFromUrl($page.url.searchParams.get("start"));
    let endDate: Date | null = readDateFromUrl($page.url.searchParams.get("end"));

    let season = +$page.params.season as Season;

    let selectedPage: string = $page.params.tab;
    $: gotoSubPage(season, selectedPage);

    let childrenChange: () => void = () => {};

    let dateKey = 0;
    function reset() {
        if (browser && $page.routeId == "records/[season=season]/[tab=records_tab]") {
            resetTeam2021SearchParams();
            resetTeam2020SearchParams();
            resetTeam2019SearchParams();
            resetMatch2021SearchParams();
            resetMatch2020SearchParams();
            resetMatch2019SearchParams();

            eventTypesStr = "Traditional and Remote";
            regionStr = "All";
            startDate = null;
            endDate = null;
            dateKey++;
        }
    }
</script>

<Head
    title={`${season} ${$page.params.tab == "teams" ? "Team" : "Match"} Records | FTCScout`}
    description="Records and high scores for the {$page.params.season} season."
/>

<WidthProvider width={"1250px"}>
    <Card>
        <h1>{prettyPrintSeason(season)} Season Records</h1>

        <div>
            <span>Season:</span>
            <SeasonDropdown bind:season style="width: calc(100% - 15ch)" />
        </div>
        {#if season != 2019}
            <div>
                <span>Event Types:</span>
                <Dropdown
                    items={["Traditional and Remote", "Traditional", "Remote"]}
                    bind:value={eventTypesStr}
                    on:change={childrenChange}
                    style="width: calc(100% - 15ch)"
                />
            </div>
        {/if}
        <div>
            <span>Regions:</span>
            <RegionsDropdown bind:value={regionStr} style="width: calc(100% - 15ch)" on:change={childrenChange} />
        </div>
        <div>
            <span>From:</span>
            {#key dateKey}
                <DateRange
                    style="width: calc(100% - 15ch)"
                    {season}
                    bind:startDate
                    bind:endDate
                    on:change={childrenChange}
                />
            {/key}
        </div>

        {#if $page.url.search != "" && !/\?page=\d+/.test($page.url.search)}
            <FaButton icon={faTrash} buttonStyle="font-size: var(--medium-font-size); width: 100%" on:click={reset}>
                Reset All
            </FaButton>
        {/if}
    </Card>

    <TabbedCard
        names={[
            [TEAMS_ICON, "Teams"],
            [MATCHES_ICON, "Matches"],
        ]}
        bind:selectedName={selectedPage}
    >
        <TabContent name="Teams">
            {#if dataTeams2021 && dataTeams2021Teps}
                {@const totalCount = dataTeams2021.count}
                <!-- TODO add this to query -->
                {@const pageSize = Math.min(+($page.url.searchParams.get("take") ?? "50"), 50)}
                {@const page = dataTeams2021.offset / pageSize + 1}

                <TeamSeasonRecords2021
                    {eventTypes}
                    data={dataTeams2021Teps}
                    currPage={page}
                    {totalCount}
                    {pageSize}
                    {region}
                    {startDate}
                    {endDate}
                    bind:change={childrenChange}
                />
            {:else if dataTeams2020 && dataTeams2020Teps}
                {@const totalCount = dataTeams2020.count}
                <!-- TODO add this to query -->
                {@const pageSize = Math.min(+($page.url.searchParams.get("take") ?? "50"), 50)}
                {@const page = dataTeams2020.offset / pageSize + 1}

                <TeamSeasonRecords2020
                    {eventTypes}
                    data={dataTeams2020Teps}
                    currPage={page}
                    {totalCount}
                    {pageSize}
                    {region}
                    {startDate}
                    {endDate}
                    bind:change={childrenChange}
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
                    bind:change={childrenChange}
                />
            {:else}
                <SkeletonRow rows={50} card={false} header={false} />
            {/if}
        </TabContent>

        <TabContent name="Matches">
            {#if dataMatches2021 && dataMatches2021Scores}
                {@const totalCount = dataMatches2021.count}
                <!-- TODO add this to query -->
                {@const pageSize = Math.min(+($page.url.searchParams.get("take") ?? "50"), 50)}
                {@const page = dataMatches2021.offset / pageSize + 1}

                <MatchSeasonRecords2021
                    {eventTypes}
                    data={dataMatches2021Scores}
                    currPage={page}
                    {totalCount}
                    {pageSize}
                    {region}
                    {startDate}
                    {endDate}
                    bind:change={childrenChange}
                />
            {:else if dataMatches2020 && dataMatches2020Scores}
                {@const totalCount = dataMatches2020.count}
                <!-- TODO add this to query -->
                {@const pageSize = Math.min(+($page.url.searchParams.get("take") ?? "50"), 50)}
                {@const page = dataMatches2020.offset / pageSize + 1}

                <MatchSeasonRecords2020
                    {eventTypes}
                    data={dataMatches2020Scores}
                    currPage={page}
                    {totalCount}
                    {pageSize}
                    {region}
                    {startDate}
                    {endDate}
                    bind:change={childrenChange}
                />
            {:else if dataMatches2019 && dataMatches2019Scores}
                {@const totalCount = dataMatches2019.count}
                <!-- TODO add this to query -->
                {@const pageSize = Math.min(+($page.url.searchParams.get("take") ?? "50"), 50)}
                {@const page = dataMatches2019.offset / pageSize + 1}

                <MatchSeasonRecords2019
                    data={dataMatches2019Scores}
                    currPage={page}
                    {totalCount}
                    {pageSize}
                    {region}
                    {startDate}
                    {endDate}
                    bind:change={childrenChange}
                />
            {:else}
                <SkeletonRow rows={50} card={false} header={false} />
            {/if}
        </TabContent>
    </TabbedCard>
</WidthProvider>

<style>
    div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
    }

    span {
        display: inline-block;
        width: 12ch;

        font-size: var(--large-font-size);
        font-weight: normal;
    }
</style>
