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
    import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
    import type { StatsSet } from "../../util/stats/StatsSet";
    import type { Writable } from "svelte/store";
    import ShowStatsModal from "./show-stats/ShowStatsModal.svelte";

    type T = $$Generic;

    export let statSet: StatsSet<T, unknown>;

    export let data: T[];
    export let shownStats: Writable<Stat<T>[]>;
    export let selectedTeam: number | null = null;

    export let defaultSort: ChosenSort<T>;
    export let currentSort: ChosenSort<T> = defaultSort;

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
    $: sorted = data.sort(makeSortFunction(defaultSort)).sort(makeSortFunction(currentSort ?? defaultSort));

    let chooseStatsModalShown = false;
    let seeStatsData: T | null = null;
</script>

<FaButton
    icon={faPlusCircle}
    on:click={() => (chooseStatsModalShown = !chooseStatsModalShown)}
    buttonStyle="font-size: var(--medium-font-size); padding: var(--padding);">Add Stats</FaButton
>

<ChooseStatsModal bind:shown={chooseStatsModalShown} {statSet} bind:chosenStats={shownStats} />
{#if seeStatsData != null} <ShowStatsModal shown={seeStatsData != null} data={seeStatsData} {statSet} /> {/if}

<table>
    <StatHeaders bind:shownStats bind:sort={currentSort} {defaultSort} />
    <tbody>
        {#each sorted as dataRow, i}
            <StatRow {dataRow} shownStats={$shownStats} zebraStripe={i % 2 == 1} bind:selectedTeam bind:seeStatsData />
        {/each}
    </tbody>
</table>

<style>
    table {
        border-spacing: 0;
        border-collapse: collapse;

        border: 1px solid lightgray;
        border-radius: 8px;

        display: block;
        width: 100%;
        max-width: 100%;
        overflow: auto;

        position: relative;
    }
</style>
