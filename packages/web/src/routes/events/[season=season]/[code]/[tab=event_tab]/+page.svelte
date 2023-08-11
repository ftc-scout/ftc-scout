<script lang="ts">
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
    import FocusedTeam from "./FocusedTeam.svelte";
    import Teams from "./Teams.svelte";
    import Rankings from "./Rankings.svelte";

    export let data;

    $: eventStore = data.event;
    $: event = $eventStore?.data.eventByCode!;

    $: stats = event?.teams?.filter((t) => notEmpty(t.stats)) ?? [];

    $: season = +$page.params.season as Season;
    $: errorMessage = `No ${DESCRIPTORS[season].seasonName} with code ${$page.params.code}`;

    let selectedTab = $page.params.tab;
    $: browser && goto(selectedTab, { replaceState: true });

    let focusedTeam: number | null = null;
    $: focusedTeamData = event.teams.find((t) => t.teamNumber == focusedTeam)!;
    setContext(
        TEAM_CLICK_ACTION_CONTEXT,
        (t: number) => (focusedTeam = focusedTeam == t ? null : t)
    );
</script>

<WidthProvider>
    <Loading store={$eventStore} checkExists={(e) => !!e.eventByCode}>
        <ErrorPage slot="error" status={404} message={errorMessage}>
            (Try searching for events on <a href="/events">the events page</a>)
        </ErrorPage>

        {#if focusedTeam}
            <FocusedTeam team={focusedTeamData} remote={event.remote} />
        {/if}

        <Card>
            <h1>{new Date(event.start).getFullYear()} {event.name}</h1>

            <InfoIconRow icon={faCalendarAlt}>
                {prettyPrintDateRangeString(event.start, event.end)}
            </InfoIconRow>

            {#if event.website}
                <InfoIconRow icon={faLink}>
                    <a href={event.website}> {prettyPrintURL(event.website)} </a>
                </InfoIconRow>
            {/if}

            <InfoIconRow icon={faLocationDot}>
                <Location {...event.location} />
            </InfoIconRow>

            <DataFromFirst />
        </Card>

        <TabbedCard
            tabs={[
                [faBolt, "Matches", "matches", !!event.matches.length],
                [faTrophy, "Rankings", "rankings", !!stats.length],
                [faMedal, "Awards", "awards", false],
                [faHashtag, "Teams", "teams", !!event.teams.length],
            ]}
            bind:selectedTab
        >
            <Card slot="empty">
                <div class="empty">
                    <b>No information has been published about this event.</b>
                    <p>Please check back later.</p>
                </div>
            </Card>

            <TabContent name="matches">
                <MatchTable matches={event.matches} {event} {focusedTeam} />
            </TabContent>

            <TabContent name="rankings">
                <Rankings {season} remote={event.remote} data={stats} {focusedTeam} />
            </TabContent>

            <TabContent name="teams">
                <Teams teams={event.teams} {focusedTeam} />
            </TabContent>
        </TabbedCard>
    </Loading>
</WidthProvider>

<style>
    h1 {
        margin-top: var(--md-gap);
        margin-bottom: var(--lg-gap);
    }

    .empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--md-gap);
    }
</style>