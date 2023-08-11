<script lang="ts">
    import type { StatSet, StatSetSection } from "../stat-table";
    import ViewStatSectionHeader from "./ViewStatSectionHeader.svelte";
    import ViewStatsRow from "./ViewStatsRow.svelte";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let section: StatSetSection;

    $: colCount = section.columns.length;
</script>

<table style:--col-count={colCount} style:--data-max={colCount == 1 ? "40%" : "0"}>
    <ViewStatSectionHeader {section} />
    <tbody>
        {#each section.rows as row}
            <ViewStatsRow {data} {stats} {section} {row} />
        {/each}
    </tbody>
</table>

<style>
    table {
        width: 100%;
        border-spacing: 0;
    }

    table:not(:last-child) {
        margin-bottom: var(--vl-gap);
    }
</style>
