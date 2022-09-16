<script lang="ts">
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import Fa from "svelte-fa";
    import Card from "../lib/components/Card.svelte";
    import MatchTable from "../lib/components/matches/MatchTable.svelte";
    import SkeletonRow from "../lib/components/skeleton/SkeletonRow.svelte";
    import { CURRENT_SEASON } from "../lib/constants";
    import { MATCHES_ICON, TEAMS_ICON } from "../lib/icons";
    import { prettyPrintDateRange } from "../lib/util/format/pretty-print-date";
    import type { PageData } from "./$types";

    export let data: PageData;

    $: activeTeamsCount = $data?.data.activeTeamsCount;
    $: matchesCount = $data?.data.matchesPlayedCount;
    $: events = $data?.data.todaysEvents;

    $: bestTradMatch = $data?.data.topTradMatch2021;
    $: bestRemoteTep = $data?.data.topRemoteTep2021;
</script>

<svelte:head>
    <title>FTCScout</title>
    <meta
        name="description"
        content="FTCScout is a new way to track and scout FIRST Tech Challenge providing advanced statistics and data on all aspects of FTC."
    />
    <meta property="og:title" content="FTCScout" />
    <meta property="og:image" content="/banner.png" />
</svelte:head>

<WidthProvider width="1000px">
    <Card border={false}>
        <div class="title">
            <h1>FTC<em>Scout</em></h1>
            <p>A new way to track and scout <em>FIRST</em> Tech Challenge</p>
        </div>
    </Card>

    <Card border={false}>
        <div class="info-box-wrap">
            <a class="info-box" sveltekit:prefetch href="/teams">
                <div class="icon">
                    <Fa fw icon={TEAMS_ICON} />
                </div>
                <div class="info">
                    <strong>{activeTeamsCount ?? "..."}</strong>
                    <p>Active Teams</p>
                </div>
            </a>

            <a class="info-box" sveltekit:prefetch href="/events/{CURRENT_SEASON}">
                <div class="icon">
                    <Fa fw icon={MATCHES_ICON} />
                </div>
                <div class="info">
                    <strong>{matchesCount ?? "..."}</strong>
                    <p>Matches Played</p>
                </div>
            </a>
        </div>

        <div class="todays-events">
            <h2>Today's Events</h2>
            <p class="today">{prettyPrintDateRange(new Date(), new Date())}</p>

            <hr />

            {#if events}
                {#if events.length}
                    <ul>
                        {#each events as event}
                            <li>
                                <a sveltekit:prefetch href="/events/{event.season}/{event.code}/matches">
                                    <span>{event.name}</span>
                                    <em class="info">
                                        {event.venue},
                                        {event.city},
                                        {event.stateOrProvince},
                                        {event.country}
                                    </em>
                                </a>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p class="no-events">There are no events scheduled for today.</p>
                {/if}
            {:else}
                <SkeletonRow header={false} card={false} rows={10} />
            {/if}
        </div>
    </Card>

    <Card>
        <h2>Best Results</h2>

        <div class="best">
            {#if bestTradMatch}
                <a href="/events/{bestTradMatch.event.season}/{bestTradMatch.event.code}">
                    {bestTradMatch.event.name}
                </a>
                <MatchTable
                    matches={[bestTradMatch]}
                    isRemote={false}
                    event={bestTradMatch.event}
                    frozen={true}
                    selectedTeam={null}
                />
            {:else}
                <SkeletonRow card={false} rows={5} />
                <SkeletonRow card={false} rows={5} />
            {/if}
        </div>

        <div class="best">
            {#if bestRemoteTep}
                <a href="/events/{bestRemoteTep.event.season}/{bestRemoteTep.event.code}">
                    {bestRemoteTep.event.name}
                </a>
                <MatchTable
                    matches={bestRemoteTep.matches.map((m) => m.match)}
                    isRemote={true}
                    event={bestRemoteTep.event}
                    frozen={true}
                    selectedTeam={null}
                />
            {/if}
        </div>
    </Card>
</WidthProvider>

<style>
    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h1 {
        font-weight: 600;
        font-size: calc(var(--h1-font-size) * 1.5);
    }

    .title p {
        margin: 0;
        font-size: calc(var(--large-font-size) * 1.25);
        font-style: normal;

        text-align: center;
    }

    .info-box-wrap {
        display: flex;
        gap: var(--large-gap);
    }

    .info-box {
        display: flex;
        align-items: center;
        gap: var(--large-gap);
        width: 50%;

        background-color: var(--foreground-color);
        box-shadow: -2px 2px 10px 3px #e0e0e0;
        border-radius: 8px;

        padding: var(--large-padding);

        text-decoration: none;
        color: inherit;
    }

    .info-box:hover {
        filter: brightness(0.9);
    }

    .info-box .icon {
        background: var(--theme-color);
        color: var(--theme-text-color);
        border-radius: var(--pill-border-radius);

        display: flex;
        align-items: center;
        justify-content: center;

        width: calc(var(--large-font-size) * 3);
        height: calc(var(--large-font-size) * 3);
        font-size: calc(var(--large-font-size) * 1.25);
    }

    .info-box .info {
        display: flex;
        flex-direction: column;
        gap: var(--small-gap);
        font-size: var(--large-font-size);
    }

    .info-box .info p {
        margin: 0;
        color: var(--secondary-text-color);
    }

    .todays-events {
        margin-top: var(--large-gap);

        background-color: var(--foreground-color);
        box-shadow: -2px 2px 10px 3px #e0e0e0;
        border-radius: 8px;

        padding: var(--large-padding);
    }

    h2 {
        margin: 0;
        margin-bottom: var(--small-gap);
        font-size: var(--large-font-size);
    }

    .todays-events .today {
        margin: 0;
        color: var(--secondary-text-color);
    }

    hr {
        color: var(--neutral-separator-color);
    }

    .no-events {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: var(--large-padding);
        color: var(--secondary-text-color);
    }

    .todays-events ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .todays-events li {
        margin: 0;

        cursor: pointer;
    }

    .todays-events li:hover {
        background: var(--hover-color);
    }

    .todays-events a {
        width: 100%;
        height: 100%;
        color: inherit;

        display: flex;
        flex-direction: column;
        gap: var(--small-gap);

        padding: var(--padding);

        border-radius: 6px;
    }

    .todays-events li:not(:last-child) a {
        margin-bottom: var(--small-gap);
    }

    .todays-events a:hover {
        text-decoration: none;
    }

    .todays-events .info {
        color: var(--secondary-text-color);
    }

    .best {
        margin-top: var(--xl-gap);
    }

    .best a {
        display: block;
        margin-top: var(--gap);
        margin-bottom: var(--gap);

        font-weight: bold;
        color: inherit;
    }
</style>
