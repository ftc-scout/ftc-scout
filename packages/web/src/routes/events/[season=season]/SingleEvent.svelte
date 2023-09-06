<script lang="ts">
    import type { EventsSearchEventFragment } from "$lib/graphql/generated/graphql-operations";
    import { prettyPrintDateRangeString } from "$lib/printers/dateRange";
    import { prettyPrintEventTypeLong, prettyPrintEventTypeShort } from "$lib/printers/eventType";
    import { prettyPrintRegionCode } from "$lib/printers/regionCode";
    import { highlight, type FuzzyResult } from "@ftc-scout/common";

    export let event: FuzzyResult<NonNullable<EventsSearchEventFragment>>;
    $: e = event.document;
    $: href = `/events/${e.season}/${e.code}/matches`;

    $: matchesTitle = e.hasMatches ? "" : " · No matches";
    $: dateTitle = prettyPrintDateRangeString(e.start, e.end);
    $: title = `${e.name} · ${dateTitle}${matchesTitle}`;
</script>

<li>
    <div>
        <a {href} class:no-matches={!e.hasMatches} {title}>
            {@html highlight(e.name, event.highlights)}
        </a>
    </div>

    <span
        class="ty"
        class:remote={e.remote}
        title="{e.remote ? 'Remote ' : ''}{prettyPrintEventTypeLong(e.type)}"
    >
        {prettyPrintEventTypeShort(e.type)}
    </span>
    {#if e.regionCode}
        <span class="rg" title="{e.location.city}, {e.location.state}, {e.location.country}">
            {prettyPrintRegionCode(e.regionCode)}
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
