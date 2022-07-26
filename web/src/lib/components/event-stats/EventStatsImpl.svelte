<script lang="ts" context="module">
    export type StatData<T> = {
        team: {
            number: number;
            name: string;
        };
        stats: T;
    };

    export type ChosenSort<T> = {
        stat: Stat<T>;
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    };
</script>

<script lang="ts">
    import StatRow from "./StatRow.svelte";
    import StatHeaders from "./StatHeaders.svelte";
    import type { Stat, StatList } from "../../util/stats/Stat";
    import { SortType } from "../SortButton.svelte";

    type T = $$Generic;

    export let stats: StatData<T>[];
    export let shownStats: StatList<T>;
    export let selectedTeam: number | null = null;

    export let defaultSort: ChosenSort<T>;
    let sort: ChosenSort<T> = defaultSort;

    function makeSortFunction(sort: { stat: Stat<T> | "team"; type: SortType.HIGH_LOW | SortType.LOW_HIGH }) {
        return (a: StatData<T>, b: StatData<T>) => {
            let { stat, type } = sort;
            let dataA = stat == "team" ? a.team.number : stat.read(a.stats);
            let dataB = stat == "team" ? b.team.number : stat.read(b.stats);

            if (type == SortType.LOW_HIGH) {
                return dataA - dataB;
            } else {
                return dataB - dataA;
            }
        };
    }

    // Sort by default first for consistent ordering.
    $: sorted = stats.sort(makeSortFunction(defaultSort)).sort(makeSortFunction(sort ?? defaultSort));
</script>

<table>
    <StatHeaders bind:shownStats bind:sort {defaultSort} />
    <tbody>
        {#each sorted as team, i (team.team.number)}
            <StatRow {team} {shownStats} zebraStripe={i % 2 == 1} bind:selectedTeam />
        {/each}
    </tbody>
</table>

<style>
    table {
        border-spacing: 0;

        border: 1px solid lightgray;
        border-radius: 8px;

        display: block;
        width: 100%;
        max-width: 100%;
        overflow: auto;

        position: relative;
    }
</style>
