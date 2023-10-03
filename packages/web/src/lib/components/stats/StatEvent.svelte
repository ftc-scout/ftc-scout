<script lang="ts">
    import type { Color, StatValue } from "@ftc-scout/common";
    import { prettyPrintDateRangeString } from "../../printers/dateRange";

    export let val: Extract<StatValue, { ty: "event" }>;
    export let color: Color;
    $: season = val.season;
    $: code = val.code;
    $: name = val.name;
    $: start = val.start;
    $: end = val.end;
    $: href = `/events/${season}/${code}/matches`;
</script>

<td class="inner-hover {color}" title={name}>
    <a class="wrap" {href}>
        <span> {name} </span>
        <em class="date">{prettyPrintDateRangeString(start, end)}</em>
    </a>
</td>

<style>
    td {
        outline: transparent 2px solid;
        outline-offset: -2px;
        transition: outline 0.12s ease 0s;
    }

    td:hover {
        outline: 2px solid var(--neutral-team-color);
        z-index: var(--focused-row-zi);
    }

    a {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        text-decoration: none;
        color: inherit;

        padding: var(--sm-pad);
    }

    a * {
        display: block;
        min-width: 100%;
        width: fit-content;
        max-width: 40ch;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: calc(1px); /* don't cut italics */
    }

    @media (max-width: 600px) {
        a {
            padding: var(--sm-pad);
        }

        a * {
            width: 14ch;
        }
    }

    .date {
        color: var(--secondary-text-color);
    }

    .red {
        background: var(--red-stat-bg-color);
    }
    .blue {
        background: var(--blue-stat-bg-color);
    }
    .light-blue {
        background: var(--light-blue-stat-bg-color);
    }
    .purple {
        background: var(--purple-stat-bg-color);
    }
    .green {
        background: var(--green-stat-bg-color);
    }
</style>
