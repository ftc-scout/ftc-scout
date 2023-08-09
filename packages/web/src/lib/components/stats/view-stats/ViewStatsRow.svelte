<script lang="ts">
    import type { StatSectionRow, StatSet, StatSetSection } from "../stat-table";
    import ViewData from "./ViewCell.svelte";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let section: StatSetSection;
    export let row: StatSectionRow;
</script>

<tr>
    <td class="name">{row.name}</td>
    {#each section.columns as column}
        <ViewData {data} {stats} {section} {row} {column} />
    {/each}
</tr>

<style>
</style>
