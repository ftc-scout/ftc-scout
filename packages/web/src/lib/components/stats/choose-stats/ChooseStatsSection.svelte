<script lang="ts">
    import type { StatSet, StatSetSection } from "@ftc-scout/common";
    import ChooseStatsRow from "./ChooseStatsRow.svelte";
    import ChooseStatsSectionHeader from "./ChooseStatsSectionHeader.svelte";

    type T = $$Generic;

    export let selectedStats: string[];
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
    <ChooseStatsSectionHeader {section} />
    <tbody>
        {#each section.rows as row}
            <ChooseStatsRow {selectedStats} {stats} {section} {row} on:choose-stat />
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
