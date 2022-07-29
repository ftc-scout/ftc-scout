<script context="module" lang="ts">
    import { EventPageDocument, type FullStatsFragment } from "../../../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../../../lib/graphql/query-load";

    export const load = queryLoad("event", EventPageDocument, ({ params }) => ({
        season: +params.season,
        code: params.code,
    }));
</script>

<script lang="ts">
    import Card from "../../../../lib/components/Card.svelte";
    import { prettyPrintDateRangeString } from "../../../../lib/util/format/pretty-print-date";
    import { prettyPrintURL } from "../../../../lib/util/format/pretty-print-url";
    import DataFromFirst from "../../../../lib/components/DataFromFirst.svelte";
    import InfoIconRow from "../../../../lib/components/InfoIconRow.svelte";
    import type { EventPageQuery } from "../../../../lib/graphql/generated/graphql-operations";
    import MatchTable from "../../../../lib/components/matches/MatchTable.svelte";
    import Loading from "../../../../lib/components/Loading.svelte";
    import type { ApolloQueryResult } from "@apollo/client";
    import TabbedCard from "../../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../../lib/components/tabs/TabContent.svelte";
    import AwardsList from "../../../../lib/components/AwardsList.svelte";
    import { browser } from "$app/env";
    import { page } from "$app/stores";
    import TeamsList from "../../../../lib/components/TeamsList.svelte";
    import { goto } from "$app/navigation";
    import TeamSelectionBar from "../../../../lib/components/TeamSelectionBar.svelte";
    import {
        AWARDS_ICON,
        DATE_ICON,
        LOCATION_ICON,
        MATCHES_ICON,
        RANKINGS_ICON,
        TEAMS_ICON,
        WEBSITE_ICON,
    } from "../../../../lib/icons";
    import type { Readable } from "svelte/store";
    import EventStats from "../../../../lib/components/event-stats/EventStats.svelte";

    export let event: Readable<ApolloQueryResult<EventPageQuery> | null>;
    $: eventData = $event?.data?.eventByCode!;

    function gotoSubPage(name: string | undefined) {
        if (browser && $page.routeId == "events/[season=season]/[code]/[...tab=event_tab]") {
            goto(`/events/${$page.params.season}/${$page.params.code}/` + name?.toLowerCase() ?? "", {
                replaceState: true,
            });
        }
    }

    let selectedPage: string | undefined = $page.params?.tab != "" ? $page.params?.tab : "matches";
    $: gotoSubPage(selectedPage);

    let selectedTeam: number | null = null;
    let selectedTeamStats: {
        rank: number;
        rp: number;
        wins?: number;
        losses?: number;
        ties?: number;
        opr?: {
            totalPoints: number;
        };
        average: {
            totalPoints: number;
        };
    } | null;
    $: selectedTeamName = eventData?.teams?.find((t) => t.teamNumber == selectedTeam)?.team?.name!;
    $: selectedTeamStats = eventData?.teams?.find((t) => t.teamNumber == selectedTeam)?.stats ?? null;

    let stats: {
        team: {
            number: number;
            name: string;
        };
        stats: FullStatsFragment;
    }[];
    $: stats = (eventData?.teams?.filter((t) => t.stats) as any) ?? [];
    $: hasStats = !!stats.length;
</script>

<svelte:head>
    <title>
        {!!eventData ? `${eventData.name} | FTC Scout` : "Event Page | Ftc Scout"}
    </title>
</svelte:head>

<Loading store={$event} width={"1250px"} doesNotExist={!eventData}>
    <Card>
        <h1>{eventData.season} {eventData.name}</h1>

        <InfoIconRow icon={DATE_ICON}>
            {prettyPrintDateRangeString(eventData.start, eventData.end)}
        </InfoIconRow>

        {#if eventData.website}
            <InfoIconRow icon={WEBSITE_ICON}>
                <a href={eventData.website}>
                    {prettyPrintURL(eventData.website)}
                </a>
            </InfoIconRow>
        {/if}

        <InfoIconRow icon={LOCATION_ICON}>
            {eventData.venue}, {eventData.city}, {eventData.stateOrProvince},
            {eventData.country}
        </InfoIconRow>

        <DataFromFirst />
    </Card>

    <TabbedCard
        names={[
            [MATCHES_ICON, "Matches"],
            [RANKINGS_ICON, hasStats ? "Rankings" : null],
            [AWARDS_ICON, eventData.awards.length ? "Awards" : null],
            [TEAMS_ICON, "Teams"],
        ]}
        bind:selectedName={selectedPage}
    >
        <TabContent name="Matches">
            <MatchTable matches={eventData.matches} event={eventData} isRemote={eventData.remote} bind:selectedTeam />
        </TabContent>

        {#if hasStats}
            <TabContent name="Rankings">
                <EventStats {stats} bind:selectedTeam eventName={eventData.name} />
            </TabContent>
        {/if}

        {#if eventData.awards.length}
            <TabContent name="Awards">
                <AwardsList awards={eventData.awards} bind:selectedTeam />
            </TabContent>
        {/if}

        <TabContent name="Teams">
            <TeamsList teams={eventData.teams.map((t) => t.team)} bind:selectedTeam />
        </TabContent>
    </TabbedCard>

    {#if selectedTeam}
        <TeamSelectionBar tep={selectedTeamStats} number={selectedTeam} name={selectedTeamName} />
    {/if}
</Loading>
