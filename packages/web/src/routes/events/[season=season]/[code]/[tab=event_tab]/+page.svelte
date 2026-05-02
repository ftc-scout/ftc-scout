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
        faChartLine,
        faHashtag,
        faLightbulb,
        faLink,
        faLocationDot,
        faMedal,
        faTrophy,
        faVideo,
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
    import { TEAM_CLICK_ACTION_CTX } from "$lib/components/matches/MatchTeam.svelte";
    import FocusedTeam from "$lib/components/stats/FocusedTeam.svelte";
    import Teams from "./Teams.svelte";
    import Rankings from "./Rankings.svelte";
    import Awards from "./Awards.svelte";
    import Preview from "./Preview.svelte";
    import { isNonCompetition } from "$lib/util/event-type";
    import Head from "$lib/components/Head.svelte";
    import Insights from "./Insights.svelte";
    import { getMatchScores } from "$lib/components/stats/getMatchScores";
    // import { unsubscribe, watchEvent } from "./watchEvent";
    // import { getClient } from "../../../../../lib/graphql/client";
    // import { getDataSync } from "../../../../../lib/graphql/getData";
    import type { EventPageQuery } from "../../../../../lib/graphql/generated/graphql-operations";

    export let data;

    $: eventStore = data.event;
    $: event = $eventStore?.data?.eventByCode!;

    $: season = +$page.params.season as Season;

    $: stats = event?.teams?.filter((t) => notEmpty(t.stats)) ?? [];
    $: insights = event?.matches?.flatMap(getMatchScores) ?? [];
    type PreviewStat = {
        teamNumber: number;
        npOpr: number | null;
        stats: NonNullable<EventPageQuery["eventByCode"]>["teams"][number]["stats"] | null;
        event: { name: string; code: string; start: string; end: string } | null;
    };
    type PreviewTeam = NonNullable<EventPageQuery["eventByCode"]>["teams"][number] & {
        quickOpr: number | null;
    };
    $: previewStats = ((event as any)?.previewStats ?? []) as PreviewStat[];
    $: previewStatMap = new Map<number, PreviewStat>(previewStats.map((s) => [s.teamNumber, s]));
    $: previewTeams = (event?.teams ?? [])
        .map((team) => ({
            ...team,
            quickOpr: previewStatMap.get(team.teamNumber)?.npOpr ?? null,
            stats: previewStatMap.get(team.teamNumber)?.stats ?? team.stats,
            event: previewStatMap.get(team.teamNumber)?.event ?? null,
        }))
        .sort((a, b) => {
            if (a.quickOpr == null && b.quickOpr == null) return a.teamNumber - b.teamNumber;
            if (a.quickOpr == null) return 1;
            if (b.quickOpr == null) return -1;
            let diff = (b.quickOpr ?? 0) - (a.quickOpr ?? 0);
            return diff == 0 ? a.teamNumber - b.teamNumber : diff;
        }) as PreviewTeam[];

    $: hasPreviewData = previewTeams.some((team) => team.quickOpr != null);
    $: eventHasMatches = (event?.matches?.length ?? 0) > 0;
    $: scheduledEventDate = event?.end ?? event?.start ?? null;
    $: eventHasPassedScheduledDate = scheduledEventDate
        ? Date.now() > new Date(scheduledEventDate).getTime() + 86400000
        : false;
    $: shouldShowPreviewTab =
        (event?.teams?.length ?? 0) > 0 &&
        hasPreviewData &&
        !eventHasMatches &&
        !eventHasPassedScheduledDate;

    $: errorMessage = `No ${DESCRIPTORS[season].seasonName} event with code ${$page.params.code}`;

    function gotoTab(tab: string) {
        if (browser) {
            let url = $page.url.searchParams.size ? `${tab}?${$page.url.searchParams}` : tab;
            goto(url, { replaceState: true });
        }
    }

    let selectedTab = $page.params.tab;
    $: gotoTab(selectedTab);

    let focusedTeam: number | null = null;
    $: focusedTeamData =
        event?.teams?.find((t) => t.teamNumber == focusedTeam) ??
        event?.awards?.find((a) => a.teamNumber == focusedTeam)!;
    setContext(TEAM_CLICK_ACTION_CTX, (t: number) => (focusedTeam = focusedTeam == t ? null : t));

    // $: if (event && !event.remote) watchEvent(event, refresh);
    // onMount(() => {
    //     return unsubscribe;
    // });

    // async function refresh() {
    //     let args = {
    //         season: +$page.params.season as Season,
    //         code: $page.params.code,
    //     };

    //     data = { event: getDataSync(getClient(fetch), EventPageDocument, args) };
    // }

    type EventLivestreamDay = {
        day: string | Date;
        liveStreamURL?: string | null;
        webcasts?: string[] | null;
        label?: string | null;
    };

    let showAllLivestreams = false;

    $: livestreamsByDay = (event?.livestreamsByDay ?? []) as EventLivestreamDay[];

    function parseLocalDate(iso: string): Date {
        const [y, m, d] = iso.split("-").map(Number);
        return new Date(y, m - 1, d);
    }

    function getDateOnly(date: string | Date): Date {
        const d = date instanceof Date ? date : parseLocalDate(date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    function formatLivestreamDay(day: string | Date): string {
        try {
            const dateObj = day instanceof Date ? day : new Date(day);
            return dateObj.toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
            });
        } catch {
            return String(day);
        }
    }

    $: todayDate = new Date();
    $: todayDateOnly = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

    $: sortedLivestreams = [...livestreamsByDay].sort((a, b) => {
        const aDate = getDateOnly(a.day).getTime();
        const bDate = getDateOnly(b.day).getTime();
        return aDate - bDate;
    });

    $: currentDayLivestream =
        livestreamsByDay.find((ls) => {
            const lsDateOnly = getDateOnly(ls.day).getTime();
            return lsDateOnly === todayDateOnly.getTime();
        }) ??
        sortedLivestreams[0] ??
        (event
            ? {
                  day: event.start,
                  liveStreamURL: event?.liveStreamURL ?? null,
              }
            : null);

    $: if ($page.url) {
        showAllLivestreams = false;
    }
</script>

<Head
    title={!!event ? `${event.name} | FTCScout` : "Event Page | FtcScout"}
    description={!!event
        ? `Matches, awards, and statistics for the ${new Date(event.start).getFullYear()} ${
              event.name
          }.`
        : "Matches, awards, and statistics for an event."}
    image="https://api.ftcscout.org/banners/events/{$page.params.season}/{$page.params.code}"
    canonical={`/events/${season}/${$page.params.code}`}
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

            {#if event.livestreamsByDay && event.livestreamsByDay.length > 0}
                <InfoIconRow icon={faVideo}>
                    <div class="livestream-block">
                        {#if currentDayLivestream}
                            <div class="livestream-row">
                                {#if currentDayLivestream.liveStreamURL}
                                    <a
                                        href={currentDayLivestream.liveStreamURL}
                                        target="_blank"
                                        rel="noreferrer"
                                        class="norm-link"
                                    >
                                        {prettyPrintURL(currentDayLivestream.liveStreamURL)}
                                    </a>
                                {/if}
                                <span class="livestream-day"
                                    >[{formatLivestreamDay(currentDayLivestream.day)}]</span
                                >
                                {#if sortedLivestreams.length > 1}
                                    <button
                                        class="livestream-inline-toggle"
                                        type="button"
                                        on:click={() => (showAllLivestreams = !showAllLivestreams)}
                                        aria-expanded={showAllLivestreams}
                                    >
                                        {showAllLivestreams ? "Hide" : "Show all"}
                                    </button>
                                {/if}
                            </div>
                        {/if}

                        {#if showAllLivestreams}
                            <div class="livestream-list">
                                {#each sortedLivestreams as livestream (livestream.day)}
                                    {@const isCurrentDay =
                                        getDateOnly(livestream.day).getTime() ===
                                        todayDateOnly.getTime()}
                                    {#if !isCurrentDay}
                                        <div class="livestream-row">
                                            {#if livestream.liveStreamURL}
                                                <a
                                                    href={livestream.liveStreamURL}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    class="norm-link"
                                                >
                                                    {prettyPrintURL(livestream.liveStreamURL)}
                                                </a>
                                            {:else}
                                                <span>No livestream URL</span>
                                            {/if}
                                            <span class="livestream-day"
                                                >[{formatLivestreamDay(livestream.day)}]</span
                                            >
                                        </div>
                                    {/if}
                                {/each}
                            </div>
                        {/if}
                    </div>
                </InfoIconRow>
            {:else if event.liveStreamURL}
                <InfoIconRow icon={faVideo}>
                    <a
                        href={event.liveStreamURL}
                        target="_blank"
                        rel="noreferrer"
                        class="norm-link"
                    >
                        {prettyPrintURL(event.liveStreamURL)}
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
                [faChartLine, "Preview", "preview", shouldShowPreviewTab],
                [faBolt, "Matches", "matches", (event?.matches?.length ?? 0) > 0],
                [faTrophy, "Rankings", "rankings", !!stats.length],
                [faLightbulb, "Insights", "insights", !!insights.length],
                [faMedal, "Awards", "awards", (event?.awards?.length ?? 0) > 0],
                [faHashtag, `Teams (${event.teams.length})`, "teams", !!event.teams.length],
            ]}
            bind:selectedTab
        >
            <Card slot="empty">
                <div class="empty">
                    {#if isNonCompetition(event.type)}
                        <p>This event is not a competition; no matches will be played.</p>
                    {:else}
                        <b>No information has been published about this event.</b>
                        <p>Please check back later.</p>
                    {/if}
                </div>
            </Card>

            <TabContent name="matches">
                <MatchTable matches={event.matches} {event} {focusedTeam} />
            </TabContent>

            <TabContent name="preview">
                <Preview
                    teams={previewTeams}
                    {focusedTeam}
                    eventName={event.name}
                    eventCode={event.code}
                    {season}
                    remote={event.remote}
                />
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

            <TabContent name="insights">
                <Insights
                    {season}
                    remote={event.remote}
                    eventName={event.name}
                    data={insights}
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
        text-align: center;
    }

    .livestream-block {
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        padding: var(--sm-gap) 0;
    }

    .livestream-inline-toggle {
        background: none;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 0.2rem 0.4rem;
        font-size: 0.9em;
        transition: all 0.15s ease;
        margin-left: 0.5rem;
    }

    .livestream-inline-toggle:hover {
        color: var(--text);
    }

    .livestream-list {
        display: flex;
        flex-direction: column;
        gap: var(--xs-gap);
        border-top: 2px solid var(--sep-color);
        padding-top: var(--md-gap);
    }

    .livestream-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 0.5rem;
        line-height: 1.4;
        border-left: 3px solid transparent;
        border-radius: 2px;
        transition: all 0.15s ease;
    }

    .livestream-day {
        margin-left: 0.3rem;
        color: var(--secondary-text-color);
    }
</style>
