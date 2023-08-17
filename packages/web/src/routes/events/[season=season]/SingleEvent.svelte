<script lang="ts">
    import type { EventSearchQuery } from "$lib/graphql/generated/graphql-operations";
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import { prettyPrintEventTypeLong, prettyPrintEventTypeShort } from "$lib/printers/eventType";
    import { prettyPrintRegionCode } from "$lib/printers/regionCode";

    export let event: NonNullable<EventSearchQuery["eventSearch"]>[number];
    $: href = `/events/${event.season}/${event.code}/matches`;

    $: matchesTitle = event.hasMatches ? "" : " · No matches";
    $: dateTitle = prettyPrintDateRangeString(event.start, event.end);
    $: title = `${event.name} · ${dateTitle}${matchesTitle}`;
</script>

<li>
    <div>
        <a {href} class:no-matches={!event.hasMatches} {title}>
            {event.name}
        </a>
    </div>

    <span
        class="ty"
        class:remote={event.remote}
        title="{event.remote ? 'Remote ' : ''}{prettyPrintEventTypeLong(event.type)}"
    >
        {prettyPrintEventTypeShort(event.type)}
    </span>
    {#if event.regionCode}
        <span
            class="rg"
            title="{event.location.city}, {event.location.state}, {event.location.country}"
        >
            {prettyPrintRegionCode(event.regionCode)}
        </span>
    {/if}
</li>

<style>
    li {
        list-style: none;

        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-gap);

        margin-left: calc(var(--md-gap) / 2);
        margin-right: var(--md-gap);
    }

    div {
        flex-grow: 1;
        width: 0;
    }

    a {
        display: block;
        color: inherit;

        padding: var(--sm-pad);
        padding-left: calc(var(--md-gap) / 2);
        border-radius: 4px;

        max-width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        cursor: pointer;
    }

    a:hover {
        background: var(--hover-color);
        text-decoration: none;
    }

    .no-matches {
        color: var(--grayed-out-text-color);
    }

    .ty,
    .rg {
        color: var(--stat-text-color);
        font-weight: 600;
        border-radius: 4px;
        padding: 0.125em var(--sm-pad);

        display: inline-block;
        flex-basis: 3.5ch;
        text-align: center;
    }

    .ty {
        background: var(--light-blue-stat-color);
    }

    .remote {
        background: var(--purple-stat-color);
    }

    .rg {
        background: var(--red-stat-color);
    }
</style>
