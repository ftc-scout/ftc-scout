<script lang="ts">
    import type { StatSet, StatSetSection } from "../stat-table";
    import ViewStatSectionHeader from "./ViewStatSectionHeader.svelte";
    import ViewStatsRow from "./ViewStatsRow.svelte";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let section: StatSetSection;
</script>

<table>
    <ViewStatSectionHeader {section} />
    <tbody>
        {#each section.rows as row}
            <ViewStatsRow {data} {stats} {section} {row} />
        {/each}
    </tbody>
</table>

<style>
    table {
        display: block;
        border-spacing: 0;
    }
</style>
