<script lang="ts">
    import { prettyPrintDateRangeString } from "$lib/util/format/pretty-print-date";
    import { createEventDispatcher } from "svelte";

    export let event: {
        name: string;
        start: string;
        end: string;
        season: number;
        code: string;
    };

    let dispatch = createEventDispatcher();
</script>

<td>
    <div class="wrap">
        <a
            sveltekit:prefetch
            href={`/events/${event.season}/${event.code}/matches`}
            class="inner"
            on:click|stopPropagation
            on:mouseenter={() => dispatch("hover-team")}
            on:mouseleave={() => dispatch("un-hover-team")}
        >
            <span> {event.name} </span>
            <em class="maybe-hide">{prettyPrintDateRangeString(event.start, event.end)}</em>
        </a>
    </div>
</td>

<style>
    td {
        outline: transparent solid 2px;
        outline-offset: -2px;
        transition: outline 0.12s ease 0s;
    }

    td:hover {
        z-index: 20;
        outline: 2px solid var(--color-team-neutral);
    }

    .inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        text-decoration: none;
        color: inherit;

        padding: var(--small-padding);

        cursor: pointer;
    }

    .wrap {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;

        width: 100%;
    }

    em {
        color: var(--secondary-text-color);
    }

    @media (max-width: 1000px) {
        .maybe-hide {
            display: none;
        }

        .inner {
            align-items: center;
            justify-content: center;
        }
    }
</style>
