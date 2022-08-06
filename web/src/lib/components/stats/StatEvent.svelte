<script lang="ts">
    import { prettyPrintDateRangeString } from "$lib/util/format/pretty-print-date";

    export let event: {
        name: string;
        start: string;
        end: string;
        season: number;
        code: string;
    };
</script>

<td>
    <div class="wrap">
        <a sveltekit:prefetch href={`/events/${event.season}/${event.code}`} class="inner">
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
