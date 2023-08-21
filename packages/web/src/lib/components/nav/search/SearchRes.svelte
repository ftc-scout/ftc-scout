<script lang="ts">
    import { highlight, type FuzzyResult } from "@ftc-scout/common";
    import type {
        EventsSearchEventFragment,
        TeamsSearchTeamFragment,
    } from "../../../graphql/generated/graphql-operations";
    import { faCalendarAlt, faHashtag } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { prettyPrintDateRangeString } from "../../../printers/dateRange";
    import { watchForFocus } from "../../../util/directives";
    import type { Writable } from "svelte/store";

    export let res: FuzzyResult<EventsSearchEventFragment | TeamsSearchTeamFragment>;
    export let searchText: string;
    export let focusNum: Writable<number>;
    export let index: number;

    $: doc = res.document;
    $: href =
        doc.__typename == "Event"
            ? `/events/${doc.season}/${doc.code}/matches`
            : `/teams/${doc.number}`;
    $: title = doc.__typename == "Event" ? doc.name : `${doc.number} - ${doc.name}`;
    $: icon = doc.__typename == "Event" ? faCalendarAlt : faHashtag;
</script>

<a {href} {title} use:watchForFocus={{ store: focusNum, myNum: index }} on:keydown on:click>
    <span class="icon"> <Fa {icon} /> </span>

    <span class="info">
        {#if doc.__typename == "Event"}
            <span class="name">{@html highlight(doc.name, res.highlights)}</span>
            <i class="extra">{prettyPrintDateRangeString(doc.start, doc.end, true)}</i>
        {:else}
            {@const name = highlight(doc.name, res.highlights)}
            {@const topLoc =
                doc.location.country == "USA" ? doc.location.state : doc.location.country}

            <span class="name">
                {#if (doc.number + "").startsWith(searchText)}
                    <b>{searchText}</b>{(doc.number + "").slice(searchText.length)}
                {:else}
                    {doc.number}
                {/if}
                - <em>{@html name}</em>
            </span>
            <i class="extra">{doc.location.city}, {topLoc}</i>
        {/if}
    </span>
</a>

<style>
    a {
        color: inherit;

        display: grid;
        grid-template-columns: auto 1fr;
        gap: var(--lg-gap);

        padding: var(--md-pad);
        border-radius: 4px;
    }

    a:focus {
        outline: 2px solid var(--text-color);
    }

    a:hover {
        text-decoration: none;
        background: var(--hover-color);
    }

    .info {
        max-width: 100%;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--md-gap);
    }

    .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .extra {
        color: var(--secondary-text-color);
    }
</style>
