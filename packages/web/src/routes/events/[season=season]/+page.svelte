<script lang="ts">
    import { page } from "$app/stores";
    import WidthProvider from "$lib/components/WidthProvider.svelte";
    import { DESCRIPTORS, type Season } from "@ftc-scout/common";
    import Card from "$lib/components/Card.svelte";
    import Loading from "$lib/components/Loading.svelte";
    import SkeletonRow from "$lib/components/skeleton/SkeletonRow.svelte";
    import { mod } from "$lib/util/number";
    import { addDays, daysBetween } from "$lib/util/date";
    import { sortString } from "$lib/util/sorters";
    import { prettyPrintDateRange } from "$lib/printers/dateRange";
    import SingleEvent from "./SingleEvent.svelte";

    export let data;
    $: eventsStore = data.events;
    $: events = $eventsStore?.data.eventSearch ?? [];
    $: season = +$page.params.season as Season;

    function groupEvents(es: typeof events) {
        es = [...es]
            .sort((a, b) => sortString(a.name, b.name))
            .sort((a, b) => new Date(a.start).valueOf() - new Date(b.start).valueOf());

        let firstDate = new Date(es[0].start);
        let minDow = firstDate.getDay();
        let mondayZero = mod(minDow - 1, 7);
        let mondayAdjust = (mondayZero - 7) % 7;
        let firstMonday = addDays(firstDate, mondayAdjust);

        let weeks: [number, typeof events][] = [];
        let currWeekNum = 0;
        let currWeek = [];

        for (let e of es) {
            let start = new Date(e.start);
            let daysSinceFirstMonday = daysBetween(firstMonday, start);
            let weekNum = Math.floor(daysSinceFirstMonday / 7);

            if (weekNum > currWeekNum) {
                weeks.push([currWeekNum, currWeek]);
                currWeekNum = weekNum;
                currWeek = [];
            }

            currWeek.push(e);
        }
        weeks.push([currWeekNum, currWeek]);

        return [firstMonday, weeks] as const;
    }

    $: [firstMonday, grouped] = events.length ? groupEvents(events) : [new Date(), []];
</script>

<WidthProvider width={"850px"}>
    <Card>
        <h1>{DESCRIPTORS[season].seasonName} Events</h1>
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

        <Card vis={false}>
            {#each grouped as [week, es]}
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
            {/each}
        </Card>
    </Loading>
</WidthProvider>

<style>
    section {
        background: var(--fg-color);
        border-radius: 8px;
        margin-bottom: var(--vl-gap);
    }

    h2 {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: var(--lg-font-size);
        background: rgba(var(--theme-color-vs), var(--theme-color-opacity));
        color: var(--theme-text-color);

        padding: var(--md-pad);
        border-radius: 8px 8px 0 0;
    }

    .date-range {
        font-style: italic;
        font-weight: normal;
        font-size: var(--md-font-size);
    }

    ul {
        column-count: 2;
        column-gap: 0;

        padding: var(--sm-pad) 0;
        border: var(--thick-border-width) solid var(--sep-color);
        border-top: none;
        border-radius: 0 0 8px 8px;

        position: relative;
    }

    ul::after {
        content: "";
        position: absolute;
        left: calc(50% - 1px);
        top: 0;
        bottom: 0;

        border-right: var(--thick-border-width) solid var(--sep-color);
    }

    @media (max-width: 900px) {
        ul {
            column-count: 1;
        }

        ul::after {
            content: none;
        }
    }
</style>
