<script lang="ts">
    import type { PageData } from "./$types";
    import Card from "$lib/components/Card.svelte";
    import { prettyPrintURL } from "$lib/util/format/pretty-print-url";
    import DataFromFirst from "../../../lib/components/DataFromFirst.svelte";
    import InfoIconRow from "../../../lib/components/InfoIconRow.svelte";
    import type { TeamQuery } from "../../../lib/graphql/generated/graphql-operations";
    import MatchTable from "../../../lib/components/matches/MatchTable.svelte";
    import { prettyPrintDateRangeString } from "../../../lib/util/format/pretty-print-date";
    import { prettyPrintOrdinal } from "../../../lib/util/format/pretty-print-ordinal";
    import { prettyPrintFloat } from "../../../lib/util/format/pretty-print-float";
    import Loading from "../../../lib/components/Loading.svelte";
    import type { ApolloQueryResult } from "@apollo/client";
    import Award from "../../../lib/components/Award.svelte";
    import type { Readable } from "svelte/store";
    import {
        AWARDS_ICON,
        DATE_ICON,
        LOCATION_ICON,
        RANKINGS_ICON,
        ROOKIE_YEAR_ICON,
        SCHOOL_ICON,
        SPONSOR_ICON,
        WEBSITE_ICON,
        OPR_ICON,
    } from "../../../lib/icons";
    import ErrorPage from "../../../lib/components/ErrorPage.svelte";
    import { page } from "$app/stores";
    import { getSeasonFromStr } from "./+page";
    import { prettyPrintSeason } from "../../../lib/util/format/pretty-print-season";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";
    import { CURRENT_SEASON, type Season } from "../../../lib/constants";
    import SeasonDropdown from "../../../lib/components/SeasonDropdown.svelte";
    import Head from "../../../lib/components/nav/Head.svelte";

    export let data: PageData;
    let team: Readable<ApolloQueryResult<TeamQuery> | null>;
    $: ({ team } = data);

    $: teamData = $team?.data?.teamByNumber!;

    $: sortedEvents = teamData
        ? [...teamData.events].sort(
              (a, b) => new Date(b.event.start as string).getTime() - new Date(a.event.start as string).getTime()
          )!
        : [];

    $: oprs = sortedEvents
        .filter((e) => !e.event.remote)
        .map((e) => e.stats?.opr?.totalPoints)
        .filter((x) => (x ?? null) != null)
        .map((x) => x!);
    $: maxOpr = oprs.length == 0 ? null : Math.max(...oprs);
    $: maxOprEvent = maxOpr != null ? sortedEvents.find((e) => e.stats?.opr?.totalPoints == maxOpr)?.eventCode : null;

    function getRp(tep: any): number | null {
        return tep?.stats?.rp ?? tep?.stats?.rp2019 ?? null;
    }

    function gotoSubPage(season: Season) {
        if (browser && $page.routeId == "teams/[number=team_num]") {
            if (season == CURRENT_SEASON) {
                goto(`/teams/${$page.params.number}`, { replaceState: true });
            } else {
                goto(`/teams/${$page.params.number}?season=${season}`, { replaceState: true });
            }
        }
    }

    let season = getSeasonFromStr($page.url.searchParams.get("season"));
    $: gotoSubPage(season);
</script>

<Head
    title={!!teamData ? `${teamData.number} ${teamData.name} | FTCScout` : "Team Page | FtcScout"}
    description={!!teamData
        ? `Information and matches for team ${teamData.number} ${teamData.name}.`
        : `Information and matches for team ${$page.params.number}`}
    image="https://api.ftcscout.org/banners/teams/{$page.params.number}"
/>

<Loading store={$team} width={"1000px"} doesNotExist={!teamData}>
    <ErrorPage slot="error" status={404} message="No team with number {$page.params.number}">
        (Try searching for teams on <a href="/teams">the teams page</a>)
    </ErrorPage>

    <Card>
        <h1>{teamData.number} - {teamData.name}</h1>

        <InfoIconRow icon={SCHOOL_ICON}>
            {teamData.schoolName}
        </InfoIconRow>

        {#if teamData.sponsors.length}
            <InfoIconRow icon={SPONSOR_ICON}>
                {teamData.sponsors.join(", ")}
            </InfoIconRow>
        {/if}

        {#if teamData.website}
            <InfoIconRow icon={WEBSITE_ICON}>
                <a class="content" href={teamData.website}>
                    {prettyPrintURL(teamData.website)}
                </a>
            </InfoIconRow>
        {/if}

        <InfoIconRow icon={LOCATION_ICON}>
            {teamData.city}, {teamData.stateOrProvince}, {teamData.country}
        </InfoIconRow>

        <InfoIconRow icon={ROOKIE_YEAR_ICON}>
            Rookie Year: {teamData.rookieYear}
        </InfoIconRow>

        {#if maxOpr != null && maxOprEvent != null}
            <InfoIconRow icon={OPR_ICON}>
                Top OPR: <a class="opr-link" href="#{maxOprEvent}">{prettyPrintFloat(maxOpr)}</a>
            </InfoIconRow>
        {/if}

        <DataFromFirst />
    </Card>

    <Card border={false}>
        <SeasonDropdown bind:season style="width: 100%; box-shadow: -2px 2px 10px 3px #e0e0e0;" />
    </Card>

    {#each sortedEvents as teamEvent}
        {@const event = teamEvent.event}
        <Card>
            <h2 id={event.code}>
                <a sveltekit:prefetch class="event-link" href={`/events/${event.season}/${event.code}/matches`}>
                    {event.name}
                </a>
            </h2>

            <InfoIconRow icon={DATE_ICON}>
                {prettyPrintDateRangeString(event.start, event.end)}
            </InfoIconRow>

            <InfoIconRow icon={LOCATION_ICON}>
                {event.venue}, {event.city}, {event.stateOrProvince},
                {event.country}
            </InfoIconRow>

            {#if teamEvent.stats?.rank}
                <InfoIconRow icon={RANKINGS_ICON}>
                    <b>{prettyPrintOrdinal(teamEvent.stats.rank)}</b> place (quals)
                </InfoIconRow>
            {/if}

            {#if teamEvent.stats?.__typename == "TeamEventStats2021Traditional"}
                <InfoIconRow icon={null}>
                    W-L-T: <b>
                        {teamEvent.stats.wins}-{teamEvent.stats.losses}-{teamEvent.stats.ties}
                    </b>
                </InfoIconRow>
            {/if}

            {@const rp = getRp(teamEvent)}
            {@const hasRp = typeof rp == "number"}
            {@const hasOpr = typeof teamEvent.stats?.opr?.totalPoints == "number" && !event.remote}
            {@const hasAvg = typeof teamEvent.stats?.average?.totalPoints == "number"}

            {#if hasRp || hasOpr || hasAvg}
                <InfoIconRow icon={null}>
                    {#if typeof rp == "number"}
                        {#if rp == Math.floor(rp)}
                            <b>{rp}</b> RP{hasOpr || hasAvg ? " · " : ""}
                        {:else}
                            <b>{prettyPrintFloat(rp)}</b> RP{hasOpr || hasAvg ? " · " : ""}
                        {/if}
                    {/if}
                    {#if typeof teamEvent.stats?.opr?.totalPoints == "number" && !event.remote}
                        <b>{prettyPrintFloat(teamEvent.stats?.opr?.totalPoints)}</b> OPR{hasAvg ? " · " : ""}
                    {/if}
                    {#if typeof teamEvent.stats?.average?.totalPoints == "number"}
                        <b>{prettyPrintFloat(teamEvent.stats?.average?.totalPoints)}</b> AVG
                    {/if}
                </InfoIconRow>
            {/if}

            {#if teamEvent.awards.length != 0}
                <InfoIconRow icon={AWARDS_ICON}>
                    {#each teamEvent.awards as award, i}
                        <Award {award} comma={i != teamEvent.awards.length - 1} />
                    {/each}
                </InfoIconRow>
            {/if}

            <MatchTable
                isRemote={event.remote}
                {event}
                matches={event.matchesForTeam.map((mt) => mt.match)}
                selectedTeam={teamData.number}
                frozen={true}
                teamPage={true}
            />
        </Card>
    {:else}
        <Card>
            <div class="no-events">
                {#if season == CURRENT_SEASON}
                    <b>
                        This team has not yet played any events in {prettyPrintSeason(season)}.
                    </b>
                {:else}
                    <b>
                        This team did not play any events in {prettyPrintSeason(season)}.
                    </b>
                {/if}
                <p class="no-events-help">Try choosing a different season from the dropdown menu.</p>
            </div>
        </Card>
    {/each}
</Loading>

<style>
    .event-link {
        color: inherit;
        text-decoration: none;
    }

    .event-link:hover {
        text-decoration: underline;
    }

    .opr-link {
        font-weight: bold;
        color: inherit;
        text-decoration: underline;
    }

    .no-events {
        text-align: center;
    }

    .no-events * {
        margin: 0;
        font-size: var(--large-font-size);
        color: var(--secondary-text-color);
        display: block;
    }

    .no-events *:first-child {
        margin-bottom: var(--large-gap);
    }
</style>
