<script lang="ts">
    import type { PageData } from "./$types";
    import Card from "../../../../../lib/components/Card.svelte";
    import { prettyPrintDateRangeString } from "../../../../../lib/util/format/pretty-print-date";
    import { prettyPrintURL } from "../../../../../lib/util/format/pretty-print-url";
    import DataFromFirst from "../../../../../lib/components/DataFromFirst.svelte";
    import InfoIconRow from "../../../../../lib/components/InfoIconRow.svelte";
    import type { EventPageQuery, FullStatsFragment } from "../../../../../lib/graphql/generated/graphql-operations";
    import MatchTable from "../../../../../lib/components/matches/MatchTable.svelte";
    import Loading from "../../../../../lib/components/Loading.svelte";
    import type { ApolloQueryResult } from "@apollo/client";
    import TabbedCard from "../../../../../lib/components/tabs/TabbedCard.svelte";
    import TabContent from "../../../../../lib/components/tabs/TabContent.svelte";
    import AwardsList from "../../../../../lib/components/AwardsList.svelte";
    import { browser } from "$app/env";
    import { page } from "$app/stores";
    import TeamsList from "../../../../../lib/components/TeamsList.svelte";
    import { goto } from "$app/navigation";
    import TeamSelectionBar from "../../../../../lib/components/TeamSelectionBar.svelte";
    import {
        AWARDS_ICON,
        DATE_ICON,
        LOCATION_ICON,
        MATCHES_ICON,
        RANKINGS_ICON,
        TEAMS_ICON,
        WEBSITE_ICON,
    } from "../../../../../lib/icons";
    import type { Readable } from "svelte/store";
    import EventStats from "../../../../../lib/components/event-stats/EventStats.svelte";
    import ErrorPage from "../../../../../lib/components/ErrorPage.svelte";

    export let data: PageData;
    let event: Readable<ApolloQueryResult<EventPageQuery> | null>;
    $: ({ event } = data);

    $: eventData = $event?.data?.eventByCode!;

    $: relatedEvents = eventData?.relatedEvents;

    function gotoSubPage(name: string) {
        if (browser && $page.routeId == "events/[season=season]/[code]/[tab=event_tab]") {
            goto(`/events/${$page.params.season}/${$page.params.code}/${name.toLowerCase()}`, { replaceState: true });
        }
    }

    let selectedPage: string = $page.params.tab;
    $: gotoSubPage(selectedPage);

    let selectedTeam: number | null = null;
    let selectedTeamStats: {
        rank: number;
        rp?: number;
        rp2019?: number;
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
        {!!eventData ? `${eventData.name} | FTCScout` : "Event Page | FtcScout"}
    </title>
    <meta
        name="description"
        content={!!eventData
            ? `Matches, awards, and statistics for the ${new Date(eventData.start).getFullYear()} ${eventData.name}.`
            : "Matches, awards, and statistics for an event."}
    />
    <meta property="og:title" content={!!eventData ? `${eventData.name} | FTCScout` : "Event Page | FtcScout"} />
    <meta property="og:image" content="/banner.png" />
</svelte:head>

<Loading store={$event} width={"1250px"} doesNotExist={!eventData}>
    <ErrorPage slot="error" status={404} message="No event with code {$page.params.code}">
        (Try searching for events on <a href="/events">the events page</a>)
    </ErrorPage>

    <Card>
        <h1>{new Date(eventData.start).getFullYear()} {eventData.name}</h1>

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

    {#if relatedEvents && relatedEvents.length}
        <Card border={false}>
            <div class="related-events">
                {#each relatedEvents as relatedEvent}
                    <a sveltekit:prefetch href="/events/{relatedEvent.season}/{relatedEvent.code}/matches">
                        {relatedEvent.name}
                    </a>
                {/each}
            </div>
        </Card>
    {/if}

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
        <TeamSelectionBar
            tep={selectedTeamStats}
            number={selectedTeam}
            name={selectedTeamName}
            eventCode={eventData.code}
        />
    {/if}
</Loading>

<style>
    .related-events {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--vl-gap);

        width: 100%;
    }

    .related-events a {
        background: var(--foreground-color);
        border: none;
        color: inherit;
        cursor: pointer;

        padding: var(--padding);
        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;

        width: 100%;

        font-weight: bold;
        text-align: center;
        text-decoration: none;
    }

    .related-events a:hover {
        filter: brightness(0.95);
    }
</style>
