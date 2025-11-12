<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import Location from "$lib/components/Location.svelte";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import MatchTable from "$lib/components/matches/MatchTable.svelte";
    import SkeletonRow from "$lib/components/skeleton/SkeletonRow.svelte";
    import { prettyPrintDateRange } from "$lib/printers/dateRange";
    import { faBolt, faHashtag, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { CURRENT_SEASON, DESCRIPTORS } from "@ftc-scout/common";
    import Head from "$lib/components/Head.svelte";
    import { createTippy } from "svelte-tippy";
    import { tippyTheme } from "$lib/components/nav/DarkModeToggle.svelte";
    import Sponsor from "$lib/components/nav/Sponsor.svelte";
    // import AlertBar from "$lib/components/nav/AlertBar.svelte";

    export let data;
    $: homeStore = data.home;

    $: activeTeamsCount = $homeStore?.data?.activeTeamsCount;
    $: matchesPlayedCount = $homeStore?.data?.matchesPlayedCount;
    $: events = $homeStore?.data?.eventsOnDate;

    $: wr = $homeStore?.data.tradWorldRecord;

    let tippy = createTippy({});
    $: np = DESCRIPTORS[CURRENT_SEASON].pensSubtract ? "" : "no penalty ";
</script>

<Head title="FTCScout" />

<!-- <AlertBar
    message="Welcome to the FTC World Championships! We're doing our best to keep the site online, but the championships bring extremely large traffic flows to the website. You can check the website status with the arrow to the right..."
    link="https://uptime.9021007.xyz/status/ftcscout"
/> -->

<WidthProvider>
    <Card vis={false}>
        <div class="title">
            <h1>FTC<em>Scout</em></h1>
            <p>A new way to track and scout <em>FIRST</em> Tech Challenge</p>
        </div>

        <div class="infos">
            <a class="info-box" href="/teams">
                <div class="icon"><Fa icon={faHashtag} /></div>
                <b class="count">{activeTeamsCount ?? "..."}</b>
                <p class="name">Active Teams</p>
            </a>
            <a class="info-box" href="/events/{CURRENT_SEASON}">
                <div class="icon"><Fa icon={faBolt} /></div>
                <b class="count">{matchesPlayedCount ?? "..."}</b>
                <p class="name">Matches Played</p>
            </a>
        </div>

        <div class="events">
            <div class="head">
                <h2>Today's Events</h2>
                <p>{prettyPrintDateRange(new Date(), new Date())}</p>
            </div>

            <hr />

            {#if events && events.length}
                <ul>
                    {#each events as e}
                        <li>
                            <a href="/events/{e.season}/{e.code}/matches">
                                <span>{e.name}</span>
                                <em class="loc"><Location {...e.location} link={false} /></em>
                            </a>
                        </li>
                    {/each}
                </ul>
            {:else if events}
                <p class="no-events">There are no events scheduled for today.</p>
            {:else}
                <SkeletonRow header={false} card={false} rows={10} />
            {/if}
        </div>

        <div class="wr">
            <h2>
                World Record
                <span
                    class="help"
                    use:tippy={{
                        content: `Top ${np}score in a FIRST sponsored event.`,
                        theme: $tippyTheme,
                    }}
                >
                    <Fa icon={faQuestionCircle} />
                </span>
            </h2>
            <hr />

            {#if wr}
                <a href="/events/{wr.event.season}/{wr.event.code}/matches">{wr.event.name}</a>
                <MatchTable matches={[wr]} event={wr.event} showNonPenaltyScores />
            {:else}
                <SkeletonRow header card={false} rows={2} />
            {/if}
        </div>
    </Card>

    <Card vis={false}>
        <div class="sponsor">
            <Sponsor />
        </div>
    </Card>
</WidthProvider>

<style>
    .title {
        display: flex;
        flex-direction: column;
        align-items: center;

        margin-bottom: var(--xl-gap);
    }

    h1 {
        font-weight: 600;
        font-size: calc(var(--xl-font-size) * 1.5);
        margin: var(--md-gap);
    }

    .title p {
        margin: 0;
        font-size: var(--vl-font-size);
        font-style: normal;

        text-align: center;
    }

    .infos {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--lg-gap);

        margin-bottom: var(--vl-gap);
    }

    .info-box {
        display: grid;
        grid-template-columns: min-content auto;
        grid-template-rows: auto auto;
        gap: var(--sm-gap) var(--lg-gap);

        background: var(--fg-color);
        border-radius: 8px;
        border: 1px solid var(--sep-color);
        padding: var(--lg-pad);
        font-size: var(--lg-font-size);

        color: inherit;
    }

    .info-box:hover {
        text-decoration: none;
        background: var(--hover-color);
    }

    .info-box .icon {
        background: var(--theme-color);
        color: var(--theme-text-color);
        border-radius: var(--pill-border-radius);
        padding: var(--lg-pad);
        font-size: var(--vl-font-size);

        display: flex;
        align-items: center;
        justify-content: center;
        grid-row: span 2;
        width: calc(var(--lg-font-size) * 3);
        height: calc(var(--lg-font-size) * 3);
    }

    @media (max-width: 800px) {
        .info-box {
            font-size: calc(var(--md-font-size) * 1.1);
        }

        .info-box .icon {
            font-size: var(--lg-font-size);
            width: calc(var(--md-font-size) * 3);
            height: calc(var(--md-font-size) * 3);
        }
    }

    .info-box .count {
        display: flex;
        align-items: end;
    }

    .info-box .name {
        display: flex;
        align-items: start;
        color: var(--secondary-text-color);
    }

    h2 {
        font-size: var(--lg-font-size);
    }

    .events {
        padding: var(--lg-pad);
        border-radius: 8px;
        border: 1px solid var(--sep-color);
        background: var(--fg-color);

        margin-bottom: var(--vl-gap);
    }

    .events .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--md-gap);
    }

    .events hr {
        margin-bottom: var(--md-gap);
    }

    .no-events {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--md-pad);
        color: var(--secondary-text-color);
    }

    .events ul {
        list-style: none;
    }

    .events ul a {
        color: inherit;
        display: flex;
        flex-direction: column;
        gap: var(--sm-gap);
        padding: var(--md-pad);
        border-radius: 8px;
    }

    .events ul a:hover {
        text-decoration: none;
        background: var(--hover-color);
    }

    .events ul a .loc {
        color: var(--secondary-text-color);
    }

    .wr {
        background: var(--fg-color);
        border-radius: 8px;
        border: 1px solid var(--sep-color);
        padding: var(--lg-pad);
    }

    .wr h2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--sm-gap);
        margin-bottom: var(--md-gap);
    }

    .wr hr {
        margin-bottom: var(--lg-gap);
    }

    .wr a {
        color: inherit;
        font-weight: bold;
        display: block;
        margin-bottom: var(--md-gap);
    }

    .help {
        font-size: calc(var(--md-font-size));
    }

    .sponsor {
        display: none;
    }

    @media (max-width: 1500px) {
        .sponsor {
            display: block;
        }
    }
</style>
