<script lang="ts">
    import type { StatSet, StatSetSection } from "@ftc-scout/common";
    import ViewStatSectionHeader from "./ViewStatSectionHeader.svelte";
    import ViewStatsRow from "./ViewStatsRow.svelte";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let section: StatSetSection;

    $: colCount = section.columns.length;
    $: maxLen = Math.max(...section.rows.map((c) => c.val.name.length));
    $: noChildren = section.rows.every((r) => r.children.length == 0);
</script>

<table
    style:--col-count={colCount}
    style:--name-min-len="{maxLen}ch"
    style:--data-max={colCount == 1 ? "var(--data-percent)" : "0"}
    class:no-children={noChildren}
>
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
        --data-percent: 40%;
        --col-width: 75px;
    }

    @media (max-width: 700px) {
        table {
            --data-percent: 50%;
            --col-width: 50px;
        }
    }

    table:not(:last-child) {
        margin-bottom: var(--vl-gap);
    }
</style>
