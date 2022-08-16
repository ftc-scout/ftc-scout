<script context="module" lang="ts">
    import { TeamDocument, type MeQuery } from "../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../lib/graphql/query-load";

    export const load = queryLoad("team", TeamDocument, ({ params }) => ({
        number: +params.number,
    }));
</script>

<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { prettyPrintURL } from "$lib/util/format/pretty-print-url";
    import DataFromFirst from "../../lib/components/DataFromFirst.svelte";
    import InfoIconRow from "../../lib/components/InfoIconRow.svelte";
    import type { TeamQuery } from "../../lib/graphql/generated/graphql-operations";
    import MatchTable from "../../lib/components/matches/MatchTable.svelte";
    import { prettyPrintDateRangeString } from "../../lib/util/format/pretty-print-date";
    import { prettyPrintOrdinal } from "../../lib/util/format/pretty-print-ordinal";
    import { prettyPrintFloat } from "../../lib/util/format/pretty-print-float";
    import Loading from "../../lib/components/Loading.svelte";
    import type { ApolloQueryResult } from "@apollo/client";
    import Award from "../../lib/components/Award.svelte";
    import type { Readable } from "svelte/store";
    import { getContext } from "svelte";
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
    } from "../../lib/icons";

    export let team: Readable<ApolloQueryResult<TeamQuery> | null>;
    $: teamData = $team?.data?.teamByNumber!;

    $: sortedEvents = $team
        ? [...teamData.events].sort(
              (a, b) => new Date(b.event.start as string).getTime() - new Date(a.event.start as string).getTime()
          )!
        : [];

    let me: Readable<MeQuery["me"] | null> = getContext("me");

    function logger() {
        if ($me?.team?.number == teamData.number) {
            console.log("Right team!");
            document.getElementById("edit-box")!.contentEditable = "true";
        }
    }
    function save() {
        if ($me!.id == teamData.number) {
            console.log("Right team save");
            localStorage.setItem("teamInfo", (<HTMLInputElement>document.getElementById("edit-box"))?.value);
        }
    }
    $: console.log($me);
    $: maxOpr = Math.max(...sortedEvents.filter((e) => !e.event.remote).map((e) => e.stats?.opr?.totalPoints ?? 0));
    $: maxOprEvent = sortedEvents.find((e) => (e.stats?.opr?.totalPoints ?? 0) == maxOpr)?.eventCode;
</script>

<svelte:head>
    <title>
        {!!teamData ? `${teamData.number} ${teamData.name} | FTC Scout` : "Team Page | Ftc Scout"}
    </title>
</svelte:head>

<Loading store={$team} width={"1000px"} doesNotExist={!teamData}>
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

        <DataFromFirst />
        <InfoIconRow icon={OPR_ICON}>
            Top OPR: <a class="opr-link" href="#{maxOprEvent}">
                {prettyPrintFloat(maxOpr)}
            </a>
        </InfoIconRow>
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

            {@const rp = typeof teamEvent.stats?.rp == "number"}
            {@const opr = typeof teamEvent.stats?.opr?.totalPoints == "number" && !event.remote}
            {@const avg = typeof teamEvent.stats?.average?.totalPoints == "number"}

            {#if rp || opr || avg}
                <InfoIconRow icon={null}>
                    {#if typeof teamEvent.stats?.rp == "number"}
                        <b>{teamEvent.stats.rp}</b> RP{opr || avg ? " · " : ""}
                    {/if}
                    {#if typeof teamEvent.stats?.opr?.totalPoints == "number" && !event.remote}
                        <b>{prettyPrintFloat(teamEvent.stats?.opr?.totalPoints)}</b> OPR{avg ? " · " : ""}
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
    {/each}

    <button on:click={logger} id="editor" class="user-button" type="button">Edit Document</button>
    <button on:click={save} id="saver" class="user-button" type="button">Save Document </button>
    <Card>
        <p class="team-box" id="edit-box" type="text" contenteditable="false">I am not editable</p>
    </Card>
</Loading>

<style>
    .team-box {
        border: none;
        background-color: transparent;
        resize: none;
        outline: none;
    }
    .user-button {
        border: var(--theme-color) 2px solid;
        text-decoration: none;

        background-color: transparent;
        color: var(--theme-color);
        font-weight: bold;
        font-size: var(--small-font-size);
        padding: var(--padding) var(--ml-padding);
        margin: 0 var(--small-gap);
        border-radius: var(--pill-border-radius);

        display: inline-block;

        cursor: pointer;
    }

    .user-button:hover {
        /* maybe like add a fade in transition to the hover colors */
        background-color: var(--theme-color);
        color: var(--theme-text-color);
    }

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
    }
</style>
