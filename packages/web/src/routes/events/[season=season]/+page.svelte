<script lang="ts">
    import { page } from "$app/stores";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import {
        DESCRIPTORS,
        EventTypeOption,
        RegionOption,
        type FuzzyResult,
        type Season,
        fuzzySearch,
    } from "@ftc-scout/common";
    import Card from "$lib/components/Card.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import SkeletonRow from "$lib/components/skeleton/SkeletonRow.svelte";
    import { mod } from "$lib/util/number";
    import { addDays, dateToStr, daysBetween } from "$lib/util/date";
    import { sortString } from "$lib/util/sorters";
    import { prettyPrintDateRange } from "$lib/printers/dateRange";
    import SingleEvent from "./SingleEvent.svelte";
    import Options from "./Options.svelte";
    import { queryParam } from "$lib/util/search-params/search-params";
    import { REGION_EC_DC } from "$lib/util/search-params/region";
    import { regionMatches } from "$lib/util/regions";
    import { EVENT_TY_EC_DC } from "$lib/util/search-params/event-ty";
    import { eventTyMatches } from "$lib/util/event-type";
    import { DATE_EC_DC } from "$lib/util/search-params/date";
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
    import { STRING_EC_DC } from "$lib/util/search-params/string";
    import InfiniteScroll from "svelte-infinite-scroll";
    import Head from "$lib/components/Head.svelte";

    export let data;
    $: eventsStore = data.events;
    $: events = $eventsStore?.data.eventsSearch ?? [];

    $: sortedEvents = [...events]
        .sort((a, b) => sortString(a.name, b.name))
        .sort((a, b) => new Date(a.start).valueOf() - new Date(b.start).valueOf());

    function calcFirstMonday(es: typeof events): Date {
        if (es.length == 0) return new Date();

        let firstDate = new Date(es[0].start);
        let minDow = firstDate.getDay();
        let mondayZero = mod(minDow - 1, 7);
        let mondayAdjust = (mondayZero - 7) % 7;
        return addDays(firstDate, mondayAdjust);
    }

    $: firstMonday = calcFirstMonday(sortedEvents);

    function groupEvents(es: FuzzyResult<(typeof events)[number]>[]) {
        if (es.length == 0) return [];

        let weeks: [number, FuzzyResult<(typeof events)[number]>[]][] = [];
        let currWeekNum = 0;
        let currWeek = [];

        for (let e of es) {
            let start = new Date(e.document.start);
            let daysSinceFirstMonday = daysBetween(firstMonday, start);
            let weekNum = Math.floor(daysSinceFirstMonday / 7);

            if (weekNum > currWeekNum) {
                if (currWeek.length) weeks.push([currWeekNum, currWeek]);
                currWeekNum = weekNum;
                currWeek = [];
            }

            currWeek.push(e);
        }
        weeks.push([currWeekNum, currWeek]);

        return weeks;
    }

    function gotoSubPage(season: Season) {
        if (browser && $page.route.id == "/events/[season=season]") {
            let params = $page.url.searchParams.toString();
            if (params != "") params = "?" + params;
            goto(`/events/${season}${params}`, { replaceState: true });
        }
    }

    let season = +$page.params.season as Season;
    $: gotoSubPage(season);

    let region = queryParam<RegionOption>("regions", REGION_EC_DC);
    let eventTy = queryParam<EventTypeOption>("event-types", EVENT_TY_EC_DC);
    let start = queryParam("start", DATE_EC_DC);
    let end = queryParam("end", DATE_EC_DC);
    let searchText = queryParam<string>("search", STRING_EC_DC);

    function eventMatches(
        r: RegionOption,
        ty: EventTypeOption,
        st: Date | null,
        end: Date | null
    ): (_: (typeof events)[number]) => boolean {
        let stStr = dateToStr(st);
        let endStr = dateToStr(end);
        return (e) =>
            regionMatches(r, e.regionCode ?? "") &&
            eventTyMatches(ty, e.type) &&
            (!stStr || e.start >= stStr) &&
            (!endStr || e.end <= endStr);
    }

    let elementScroll = (browser ? document.getElementById("content") : null)!;
    let take = 10;
    $: {
        $searchText;
        $region;
        $eventTy;
        $start;
        $end;
        take = 10;
    }

    $: filteredEvents = sortedEvents.filter(eventMatches($region, $eventTy, $start, $end));
    $: searchedEvents = fuzzySearch(filteredEvents, $searchText, Infinity, "name");
    $: grouped = groupEvents(searchedEvents);
</script>

<Head
    title="Events | FTCScout"
    description="Find and search for FTC events in the {$page.params.season} season."
/>

<WidthProvider width={"850px"}>
    <Card>
        <h1>{DESCRIPTORS[season].seasonName} Events</h1>
        <Options
            bind:season
            bind:region={$region}
            bind:eventType={$eventTy}
            bind:start={$start}
            bind:end={$end}
            bind:searchText={$searchText}
        />
    </Card>
</WidthProvider>

<WidthProvider>
    <Loading store={$eventsStore} checkExists={() => true}>
        <div slot="loading">
            <SkeletonRow rows={5} header={true} />
            <SkeletonRow rows={6} header={true} />
            <SkeletonRow rows={5} header={true} />
            <SkeletonRow rows={5} header={true} />
            <SkeletonRow rows={5} header={true} />
        </div>

        <Card>
            {#each grouped.slice(0, take) as [week, es] (week)}
                {@const start = addDays(firstMonday, 7 * week)}
                {@const end = addDays(firstMonday, 7 * week + 6)}

                <section>
                    <h2>
                        Week {week + 1}
                        <span class="date-range">{prettyPrintDateRange(start, end)}</span>
                    </h2>

                    <ul>
                        {#each es as event}
                            <SingleEvent {event} />
                        {/each}
                    </ul>
                </section>
            {:else}
                <div class="no-events">
                    <b> No matching events. </b>
                    <p class="no-events-help">Try modifying your filters.</p>
                </div>
            {/each}

            <InfiniteScroll threshold={500} on:loadMore={() => (take += 10)} {elementScroll} />
        </Card>
    </Loading>
</WidthProvider>

<style>
    h1 {
        margin-top: var(--sm-gap);
        margin-bottom: var(--lg-gap);
    }

    section:not(:last-child) {
        margin-bottom: var(--vl-gap);
    }

    h2 {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: var(--lg-font-size);
        background: var(--hover-color);

        padding: var(--md-gap);
        margin-bottom: var(--md-gap);
        border-radius: 8px;
    }

    .date-range {
        font-style: italic;
        font-weight: normal;
        font-size: var(--md-font-size);
    }

    ul {
        column-count: 2;
        column-gap: var(--lg-gap);
    }

    @media (max-width: 900px) {
        ul {
            column-count: 1;
        }
    }

    .no-events {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--md-gap);

        width: 100%;
    }
</style>
