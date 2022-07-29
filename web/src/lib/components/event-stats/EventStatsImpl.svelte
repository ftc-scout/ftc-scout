<script lang="ts" context="module">
    export type ChosenSort<T> = {
        stat: Stat<T>;
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    };
</script>

<script lang="ts">
    import StatRow from "./StatRow.svelte";
    import StatHeaders from "./StatHeaders.svelte";
    import type { Stat } from "../../util/stats/Stat";
    import { SortType } from "../SortButton.svelte";
    import ChooseStatsModal from "./choose-stats/ChooseStatsModal.svelte";
    import FaButton from "../FaButton.svelte";
    import { faEdit, faFileArrowDown } from "@fortawesome/free-solid-svg-icons";
    import type { StatsSet } from "../../util/stats/StatsSet";
    import type { Writable } from "svelte/store";
    import ShowStatsModal from "./show-stats/ShowStatsModal.svelte";
    import { exportStatsCSV } from "../../util/stats/export-stats-csv";

    type T = $$Generic;

    export let statSet: StatsSet<T, unknown>;

    export let data: T[];
    export let shownStats: Writable<Stat<T>[]>;
    export let selectedTeam: number | null = null;

    export let defaultSort: ChosenSort<T>;
    export let currentSort: ChosenSort<T> = defaultSort;

    export let eventName: string;

    function makeSortFunction(sort: { stat: Stat<T>; type: SortType.HIGH_LOW | SortType.LOW_HIGH }) {
        return (a: T, b: T) => {
            let { stat, type } = sort;
            let readA = stat.read(a);
            let readB = stat.read(b);
            let dataA = typeof readA == "object" ? readA.number : readA;
            let dataB = typeof readB == "object" ? readB.number : readB;

            if (type == SortType.LOW_HIGH) {
                return dataA - dataB;
            } else {
                return dataB - dataA;
            }
        };
    }

    // Sort by default first for consistent ordering.
    $: sortedData = data.sort(makeSortFunction(defaultSort)).sort(makeSortFunction(currentSort ?? defaultSort));

    let chooseStatsModalShown = false;
    let seeStatsData: T | null = null;
</script>

<div class="options">
    <FaButton
        icon={faEdit}
        on:click={() => (chooseStatsModalShown = !chooseStatsModalShown)}
        buttonStyle="font-size: var(--medium-font-size);">Add Stats</FaButton
    >

    <FaButton
        icon={faFileArrowDown}
        on:click={() => exportStatsCSV(eventName, sortedData, $shownStats)}
        buttonStyle="font-size: var(--medium-font-size);">Export CSV</FaButton
    >
</div>

<ChooseStatsModal bind:shown={chooseStatsModalShown} {statSet} bind:chosenStats={shownStats} />
{#if seeStatsData != null} <ShowStatsModal shown={seeStatsData != null} data={seeStatsData} {statSet} /> {/if}

<table tabindex="-1">
    <StatHeaders bind:shownStats bind:sort={currentSort} {defaultSort} />
    <tbody>
        {#each sortedData as dataRow, i}
            <StatRow {dataRow} shownStats={$shownStats} zebraStripe={i % 2 == 1} bind:selectedTeam bind:seeStatsData />
        {/each}
    </tbody>
</table>

<style>
    .options {
        margin-bottom: var(--large-gap);

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;

        border: 1px solid lightgray;
        border-radius: 8px;

        display: block;
        /* width: 100%; */
        min-width: 100%;
        width: min-content;
        max-width: 100%;
        overflow: auto;

        position: relative;

        /* Adapted from: https://lea.verou.me/2012/04/background-attachment-local/ */
        background: linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to left, white, rgba(255, 255, 255, 0)) 100% 0,
            linear-gradient(to right, rgba(0, 0, 0, 0.2), white),
            linear-gradient(to left, rgba(0, 0, 0, 0.2), white) 100% 0;
        background-repeat: no-repeat;
        background-color: white;
        background-size: 60px 100%, 60px 100%, 25px 100%, 25px 100%;

        /* Opera doesn't support this in the shorthand */
        background-attachment: local, local, scroll, scroll;
    }

    table:focus-visible {
        outline: none;
        border: 1px solid black;
    }
</style>
