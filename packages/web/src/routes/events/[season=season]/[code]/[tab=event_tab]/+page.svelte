<script lang="ts">
    import RelatedEvents from "./RelatedEvents.svelte";

    import { DESCRIPTORS, Season, notEmpty } from "@ftc-scout/common";
    import ErrorPage from "$lib/components/ErrorPage.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { page } from "$app/stores";
    import Card from "$lib/components/Card.svelte";
    import DataFromFirst from "$lib/components/DataFromFirst.svelte";
    import InfoIconRow from "$lib/components/InfoIconRow.svelte";
    import {
        faBolt,
        faCalendarAlt,
        faHashtag,
        faLink,
        faLocationDot,
        faMedal,
        faTrophy,
    } from "@fortawesome/free-solid-svg-icons";
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import { prettyPrintURL } from "$lib/printers/url";
    import Location from "$lib/components/Location.svelte";
    import TabbedCard from "$lib/components/tabs/TabbedCard.svelte";
    import TabContent from "$lib/components/tabs/TabContent.svelte";
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import { goto } from "$app/navigation";
    import { browser } from "$app/environment";
    import { setContext } from "svelte";
    import { TEAM_CLICK_ACTION_CONTEXT } from "$lib/components/matches/MatchTeam.svelte";
    import FocusedTeam from "$lib/components/stats/FocusedTeam.svelte";
    import Teams from "./Teams.svelte";
    import Rankings from "./Rankings.svelte";
    import Awards from "./Awards.svelte";
    import { isNonCompetition } from "$lib/util/event-type";
    import Head from "$lib/components/Head.svelte";

    export let data;

    $: eventStore = data.event;
    $: event = $eventStore?.data.eventByCode!;

    $: stats = event?.teams?.filter((t) => notEmpty(t.stats)) ?? [];

    $: season = +$page.params.season as Season;
    $: errorMessage = `No ${DESCRIPTORS[season].seasonName} event with code ${$page.params.code}`;

    let selectedTab = $page.params.tab;
    $: browser && goto(selectedTab + "?" + $page.url.searchParams, { replaceState: true });

    let focusedTeam: number | null = null;
    $: focusedTeamData =
        event.teams.find((t) => t.teamNumber == focusedTeam) ??
        event.awards.find((a) => a.teamNumber == focusedTeam)!;
    setContext(
        TEAM_CLICK_ACTION_CONTEXT,
        (t: number) => (focusedTeam = focusedTeam == t ? null : t)
    );
</script>

<Head
    title={!!event ? `${event.name} | FTCScout` : "Event Page | FtcScout"}
    description={!!event
        ? `Matches, awards, and statistics for the ${new Date(event.start).getFullYear()} ${
              event.name
          }.`
        : "Matches, awards, and statistics for an event."}
    image="https://api.ftcscout.org/banners/events/{$page.params.season}/{$page.params.code}"
/>

<WidthProvider>
    <Loading store={$eventStore} checkExists={(e) => !!e.eventByCode}>
        <ErrorPage slot="error" status={404} message={errorMessage}>
            (Try searching for events on <a href="/events">the events page</a>)
        </ErrorPage>

        {#if focusedTeam && focusedTeamData}
            <FocusedTeam team={focusedTeamData} remote={event.remote} />
        {/if}

        <Card>
            <h1>{new Date(event.start).getFullYear()} {event.name}</h1>

            <InfoIconRow icon={faCalendarAlt}>
                {prettyPrintDateRangeString(event.start, event.end)}
            </InfoIconRow>

            {#if event.website}
                <InfoIconRow icon={faLink}>
                    <a href={event.website} target="_blank" rel="noreferrer" class="norm-link">
                        {prettyPrintURL(event.website)}
                    </a>
                </InfoIconRow>
            {/if}

            <InfoIconRow icon={faLocationDot}>
                <Location {...event.location} />
            </InfoIconRow>

            <DataFromFirst />
        </Card>

        <RelatedEvents relatedEvents={event.relatedEvents} thisEventName={event.name} {season} />

        <TabbedCard
            tabs={[
                [faBolt, "Matches", "matches", !!event.matches.length],
                [faTrophy, "Rankings", "rankings", !!stats.length],
                [faMedal, "Awards", "awards", !!event.awards.length],
                [faHashtag, "Teams", "teams", !!event.teams.length],
            ]}
            bind:selectedTab
        >
            <Card slot="empty">
                <div class="empty">
                    {#if isNonCompetition(event.type)}
                        <p>This event is not competition; no matches will be played.</p>
                    {:else}
                        <b>No information has been published about this event.</b>
                        <p>Please check back later.</p>
                    {/if}
                </div>
            </Card>

            <TabContent name="matches">
                <MatchTable matches={event.matches} {event} {focusedTeam} />
            </TabContent>

            <TabContent name="rankings">
                <Rankings
                    {season}
                    remote={event.remote}
                    eventName={event.name}
                    data={stats}
                    {focusedTeam}
                />
            </TabContent>

            <TabContent name="awards">
                <Awards awards={event.awards} {season} eventCode={event.code} {focusedTeam} />
            </TabContent>

            <TabContent name="teams">
                <Teams teams={event.teams} {focusedTeam} />
            </TabContent>
        </TabbedCard>
    </Loading>
</WidthProvider>

<style>
    h1 {
        margin-top: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--md-gap);
    }
</style>
