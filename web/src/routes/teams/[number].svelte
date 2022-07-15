<script context="module" lang="ts">
    import {
        TeamDocument,
        type MeQuery,
    } from "../../lib/graphql/generated/graphql-operations";
    import { queryLoad } from "../../lib/graphql/query-load";

    export const load = queryLoad("team", TeamDocument, ({ params }) => ({
        number: +params.number,
    }));
</script>

<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import { prettyPrintURL } from "$lib/util/format/pretty-print-url";
    import {
        faGlobe,
        faCalendarAlt,
        faLocationDot,
        faSchool,
        faPlus,
        faTrophy,
        faMedal,
    } from "@fortawesome/free-solid-svg-icons";
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

    export let team: ApolloQueryResult<TeamQuery>;
    $: teamData = team.data.teamByNumber!;

    $: sortedEvents = [...teamData.events].sort(
        (a, b) =>
            new Date(b.event.start as string).getTime() -
            new Date(a.event.start as string).getTime()
    )!;

    let me: Readable<MeQuery["me"] | null> = getContext("me");

    function logger()
    {
        if ($me!.id = teamData.number)
        {
            document.getElementById("edit-box")!.contentEditable = "true";
        }
    }
</script>

<svelte:head>
    <title>
        {!!teamData
            ? `${teamData.number} ${teamData.name} | FTC Scout`
            : "Team Page | Ftc Scout"}
    </title>
</svelte:head>

<Loading store={team} width={"1000px"} doesNotExist={!teamData}>
    My username: {$me?.username}

    <Card>
        <h1>{teamData.number} - {teamData.name}</h1>

        <InfoIconRow icon={faSchool}>
            {teamData.schoolName}
        </InfoIconRow>

        {#if teamData.website}
            <InfoIconRow icon={faGlobe}>
                <a class="content" href={teamData.website}>
                    {prettyPrintURL(teamData.website)}
                </a>
            </InfoIconRow>
        {/if}

        <InfoIconRow icon={faLocationDot}>
            {teamData.city}, {teamData.stateOrProvince}, {teamData.country}
        </InfoIconRow>

        <InfoIconRow icon={faPlus}>
            Rookie Year: {teamData.rookieYear}
        </InfoIconRow>

        <DataFromFirst />
    </Card>

    {#each sortedEvents as teamEvent}
        {@const event = teamEvent.event}
        <Card>
            <h2>
                <a
                    sveltekit:prefetch
                    class="event-link"
                    href={`/events/${event.season}/${event.code}`}
                >
                    {event.name}
                </a>
            </h2>

            <InfoIconRow icon={faCalendarAlt}>
                {prettyPrintDateRangeString(event.start, event.end)}
            </InfoIconRow>

            <InfoIconRow icon={faLocationDot}>
                {event.venue}, {event.city}, {event.stateOrProvince},
                {event.country}
            </InfoIconRow>

            {#if teamEvent.rank}
                <InfoIconRow icon={faTrophy}>
                    <b>{prettyPrintOrdinal(teamEvent.rank)}</b> place (quals)
                </InfoIconRow>
            {/if}

            {#if typeof teamEvent.wins == "number" && typeof teamEvent.losses == "number" && typeof teamEvent.ties == "number"}
                <InfoIconRow icon={null}>
                    W-L-T: <b>
                        {teamEvent.wins}-{teamEvent.losses}-{teamEvent.ties}
                    </b>
                </InfoIconRow>
            {/if}

            {@const rp = typeof teamEvent.qualPoints == "number"}
            {@const opr = typeof teamEvent.opr == "number" && !event.remote}
            {@const avg = typeof teamEvent.qualAverage == "number"}

            {#if rp || opr || avg}
                <InfoIconRow icon={null}>
                    {#if typeof teamEvent.qualPoints == "number"}
                        <b>{teamEvent.qualPoints}</b> RP{opr || avg
                            ? " · "
                            : ""}
                    {/if}
                    {#if typeof teamEvent.opr == "number" && !event.remote}
                        <b>{prettyPrintFloat(teamEvent.opr)}</b> OPR{avg
                            ? " · "
                            : ""}
                    {/if}
                    {#if typeof teamEvent.qualAverage == "number"}
                        <b>{prettyPrintFloat(teamEvent.qualAverage)}</b> AVG
                    {/if}
                </InfoIconRow>
            {/if}

            {#if teamEvent.awards.length != 0}
                <InfoIconRow icon={faMedal}>
                    {#each teamEvent.awards as award, i}
                        <Award
                            {award}
                            comma={i != teamEvent.awards.length - 1}
                        />
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

    <button onClick={() => {logger()}} id = "editor" class="edit-button" type="button">Edit Document</button>
    <Card>
        <p id="edit-box" type="text" contenteditable="false"> I am not editable </p>
    </Card>
</Loading>

<style>
    /* Change this so im not plagiarizing off of someone else who may be working on this project */
    .edit-button {
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

    .edit-button:hover {
        /* maybe like add a fade in transition to the hover colours */
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
</style>
