<script lang="ts">
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Card from "$lib/components/Card.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import ErrorPage from "$lib/components/ErrorPage.svelte";
    import { page } from "$app/stores";
    import InfoIconRow from "$lib/components/InfoIconRow.svelte";
    import {
        faCakeCandles,
        faCalendarAlt,
        faHeart,
        faLink,
        faLocationDot,
        faMedal,
        faSchool,
    } from "@fortawesome/free-solid-svg-icons";
    import { prettyPrintURL } from "$lib/printers/url";
    import Location from "$lib/components/Location.svelte";
    import DataFromFirst from "$lib/components/DataFromFirst.svelte";
    import { eventSorter } from "$lib/util/sorters";
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import TeamEventStats from "./TeamEventStats.svelte";
    import type { Season } from "@ftc-scout/common";
    import Award from "$lib/components/Award.svelte";
    import MatchTable from "../../../lib/components/matches/MatchTable.svelte";

    const season = (n: number) => n as Season;

    export let data;

    $: teamStore = data.team;
    $: team = $teamStore?.data.teamByNumber!;

    $: sortedEvents = ([...team.events] ?? []).sort(eventSorter);
</script>

<WidthProvider>
    <Loading store={$teamStore} checkExists={(t) => !!t.teamByNumber}>
        <ErrorPage slot="error" status={404} message="No team with number {$page.params.number}">
            (Try searching for teams on <a href="/teams">the teams page</a>)
        </ErrorPage>

        <Card style="margin-bottom: var(--xl-gap);">
            <h1>{team.number} - {team.name}</h1>

            <InfoIconRow icon={faSchool}>{team.schoolName}</InfoIconRow>

            {#if team.sponsors.length}
                <InfoIconRow icon={faHeart}>{team.sponsors.join(", ")}</InfoIconRow>
            {/if}

            {#if team.website}
                <InfoIconRow icon={faLink}>
                    <a href="team.website">{prettyPrintURL(team.website)}</a>
                </InfoIconRow>
            {/if}

            <InfoIconRow icon={faLocationDot}>
                <Location {...team.location} />
            </InfoIconRow>

            <InfoIconRow icon={faCakeCandles}>Rookie Year: {team.rookieYear}</InfoIconRow>

            <DataFromFirst />
        </Card>

        {#each sortedEvents as tep}
            {@const event = tep.event}
            {@const href = `/events/${event.season}/${event.code}/matches`}
            <Card>
                <h2 id={event.code}><a {href}>{event.name}</a></h2>

                <InfoIconRow icon={faCalendarAlt}>
                    {prettyPrintDateRangeString(event.start, event.end)}
                </InfoIconRow>

                <InfoIconRow icon={faLocationDot}>
                    <Location {...event.location} />
                </InfoIconRow>

                <TeamEventStats
                    stats={tep.stats}
                    season={season(event.season)}
                    remote={event.remote}
                />

                {#if tep.awards.length}
                    <InfoIconRow icon={faMedal}>
                        {#each tep.awards as award, i}
                            <Award {award} comma={i != tep.awards.length - 1} />
                        {/each}
                    </InfoIconRow>
                {/if}

                <MatchTable
                    matches={tep.matches.map((m) => m.match)}
                    {event}
                    focusedTeam={team.number}
                />
            </Card>
        {/each}
    </Loading>
</WidthProvider>

<style>
    h1,
    h2 {
        margin-top: var(--md-gap);
        margin-bottom: var(--lg-gap);
    }

    h2 a {
        color: inherit;
    }
</style>
