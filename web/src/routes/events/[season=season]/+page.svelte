<script lang="ts">
    import { browser } from "$app/env";
    import { goto } from "$app/navigation";

    import { page } from "$app/stores";
    import Card from "$lib/components/Card.svelte";
    import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
    import { query, type ReadableQuery } from "svelte-apollo";
    import DateRange from "../../../lib/components/DateRange.svelte";
    import Dropdown from "../../../lib/components/Dropdown.svelte";
    import FaButton from "../../../lib/components/FaButton.svelte";
    import { changeParam } from "../../../lib/components/season-records/changeParams";
    import RegionsDropdown from "../../../lib/components/season-records/RegionsDropdown.svelte";
    import SeasonDropdown from "../../../lib/components/SeasonDropdown.svelte";
    import SkeletonRow from "../../../lib/components/skeleton/SkeletonRow.svelte";
    import TextInput from "../../../lib/components/TextInput.svelte";
    import WidthProvider from "../../../lib/components/WidthProvider.svelte";
    import type { Season } from "../../../lib/constants";
    import {
        EventsSearchDocument,
        EventTypes,
        Region,
        type EventsSearchQuery,
    } from "../../../lib/graphql/generated/graphql-operations";
    import { dateToStr, prettyPrintDateRangeString } from "../../../lib/util/format/pretty-print-date";
    import { prettyPrintSeason } from "../../../lib/util/format/pretty-print-season";
    import { regionFromStr, regionToString } from "../../../lib/util/regions";
    import {
        eventTypesFromStr,
        eventTypesToStr,
        readDateFromUrl,
    } from "../../records/[season=season]/[tab=records_tab]/+page";

    const BATCH_SIZE = 50;

    function gotoSubPage(season: Season) {
        if (browser && $page.routeId == "events/[season=season]") {
            goto(`/events/${season}`, {
                replaceState: true,
            });
        }
    }

    let season = +$page.params.season as Season;

    $: gotoSubPage(season);

    let startDate: Date | null = readDateFromUrl($page.url.searchParams.get("start"));
    let endDate: Date | null = readDateFromUrl($page.url.searchParams.get("end"));

    let regionStr: string = regionToString(regionFromStr($page.url.searchParams.get("region") ?? "ALL") ?? Region.All);
    $: region = regionFromStr(regionStr) ?? Region.All;

    let eventTypesStr: "Traditional" | "Remote" | "Traditional and Remote" = eventTypesToStr(
        eventTypesFromStr($page.url.searchParams.get("event-types") ?? "") ?? EventTypes.TradAndRemote
    );
    $: eventTypes = eventTypesFromStr(eventTypesStr) ?? EventTypes.TradAndRemote;

    let onlyMatchesStr = $page.url.searchParams.get("matches") ?? true ? "Only events with matches" : "All events";
    $: onlyMatches = onlyMatchesStr == "Only events with matches";

    let searchText = $page.url.searchParams.get("search") ?? "";

    let limit = BATCH_SIZE;

    let events: ReadableQuery<EventsSearchQuery>;
    $: events = query(EventsSearchDocument, {
        variables: {
            season: +$page.params.season,
            eventTypes,
            region,
            start: startDate,
            end: endDate,
            onlyWithMatches: onlyMatches,
            limit,
            searchText,
        },
    });
    $: data = $events?.data?.eventsSearch ?? null;

    $: changeParam(
        {
            ["event-types"]: eventTypes == EventTypes.TradAndRemote ? null : eventTypesToStr(eventTypes),
            region: region == Region.All ? null : regionToString(region),
            start: dateToStr(startDate),
            end: dateToStr(endDate),
            matches: onlyMatches ? null : "false",
            search: !searchText ? null : searchText,
        },
        true,
        false
    );

    function more() {
        limit += BATCH_SIZE;
        events.refetch({
            season: +$page.params.season,
            eventTypes,
            region,
            start: startDate,
            end: endDate,
            onlyWithMatches: onlyMatches,
            limit,
            searchText,
        });
    }
</script>

<svelte:head>
    <title>Events | FTC Scout</title>
    <meta name="description" content="Find and search for FTC events in the {$page.params.season} season." />
</svelte:head>

<WidthProvider width="1000px">
    <Card>
        <h1>{prettyPrintSeason(season)} Events</h1>
        <div class="options">
            <span>Season:</span>
            <SeasonDropdown bind:season style="width: calc(100% - 15ch)" />
        </div>
        {#if season != 2019}
            <div class="options">
                <span>Event Types:</span>
                <Dropdown
                    items={["Traditional and Remote", "Traditional", "Remote"]}
                    bind:value={eventTypesStr}
                    style="width: calc(100% - 15ch)"
                />
            </div>
        {/if}
        <div class="options">
            <span>Regions:</span>
            <RegionsDropdown bind:value={regionStr} style="width: calc(100% - 15ch)" />
        </div>
        <div class="options">
            <span>From:</span>
            <DateRange style="width: calc(100% - 15ch)" {season} bind:startDate bind:endDate />
        </div>
        <div class="options">
            <span>Matches:</span>
            <Dropdown
                items={["Only events with matches", "All events"]}
                bind:value={onlyMatchesStr}
                style="width: calc(100% - 15ch)"
            />
        </div>
        <div class="options">
            <span>Search:</span>
            <TextInput bind:value={searchText} style="width: calc(100% - 15ch)" search />
        </div>
    </Card>
    <Card>
        {#if data}
            <ul>
                {#each data as event}
                    {@const hasMatches = event.matches.some((m) => m.hasBeenPlayed)}
                    <li>
                        <a
                            sveltekit:prefetch
                            href="/events/{event.season}/{event.code}/matches"
                            class:has-matches={hasMatches}
                        >
                            <span>{event.name}</span>
                            <em class="info"
                                >{prettyPrintDateRangeString(event.start, event.end)} at {event.venue}, {event.city}, {event.stateOrProvince},
                                {event.country}
                            </em>
                        </a>
                    </li>
                {:else}
                    <p class="no-events">No Matching Events</p>
                {/each}

                {#if data.length != 0 && data.length % BATCH_SIZE == 0}
                    <div class="more-wrap">
                        <FaButton icon={faCirclePlus} on:click={more} buttonStyle="font-size: var(--large-font-size)">
                            Show More
                        </FaButton>
                    </div>
                {/if}
            </ul>
        {:else if $events.loading}
            <SkeletonRow rows={50} card={false} header={false} />
        {/if}
    </Card>
</WidthProvider>

<style>
    .options {
        display: flex;
        align-items: center;
        justify-content: space-between;

        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
    }

    .options span {
        display: inline-block;
        width: 12ch;

        font-size: var(--large-font-size);
        font-weight: normal;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li {
        margin: 0;

        cursor: pointer;
    }

    li:hover {
        background: var(--hover-color);
    }

    a {
        width: 100%;
        height: 100%;
        color: inherit;

        display: flex;
        flex-direction: column;
        gap: var(--small-gap);

        padding: var(--padding);

        border-radius: 6px;
    }

    li:not(:last-child) a {
        margin-bottom: var(--gap);
    }

    a:hover {
        text-decoration: none;
    }

    .has-matches {
        border-left: 6px solid var(--theme-color);
    }

    .info {
        color: var(--secondary-text-color);
    }

    .no-events {
        margin: 0;
        padding: var(--padding);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: var(--large-font-size);
    }

    .more-wrap {
        display: flex;
        align-items: center;
        justify-content: center;

        font-size: var(--large-font-size);
    }
</style>
