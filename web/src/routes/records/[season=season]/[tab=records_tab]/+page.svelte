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
    import SkeletonRow from "../../../../lib/components/skeleton/SkeletonRow.svelte";
    import TabbedCard from "../../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../../lib/components/tabs/TabContent.svelte";
    import WidthProvider from "../../../../lib/components/WidthProvider.svelte";
    import {
        EventTypes,
        Region,
        type TeamSeasonRecords2021Query,
    } from "../../../../lib/graphql/generated/graphql-operations";
    import { TEAMS_ICON, MATCHES_ICON } from "../../../../lib/icons";
    import { prettyPrintSeason } from "../../../../lib/util/format/pretty-print-season";
    import type { FullTep2021Remote } from "../../../../lib/util/stats/StatsRemote2021";
    import type { FullTep2021Traditional } from "../../../../lib/util/stats/StatsTrad2021";
    import { eventTypesFromStr, eventTypesToStr, readDateFromUrl } from "./+page";

    afterNavigate(({ to }) => {
        if (to.pathname.startsWith("/records")) {
            document.getElementById("content")?.scrollTo({ top: 0 });
        }
    });

    function gotoSubPage(name: string) {
        if (browser && $page.routeId == "records/[season=season]/[tab=records_tab]") {
            let searchParams = name.toLowerCase() == "teams" ? team2021SearchParams : null;
            goto(`/records/${$page.params.season}/${name.toLowerCase()}${searchParams ? "?" + searchParams : ""}`, {
                replaceState: true,
            });
        }
    }

    export let data: PageData;
    let teams2021: Readable<ApolloQueryResult<TeamSeasonRecords2021Query>>;
    $: ({ teams2021 } = data);

    let selectedPage: string = $page.params.tab;
    $: gotoSubPage(selectedPage);

    $: season = +$page.params.season as 2021;

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

    let startDate: Date | null = readDateFromUrl($page.url.searchParams.get("start"));
    let endDate: Date | null = readDateFromUrl($page.url.searchParams.get("end"));
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
        <p>
            <span>From:</span>
            <DateRange style="width: calc(100% - 15ch)" bind:startDate bind:endDate />
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
