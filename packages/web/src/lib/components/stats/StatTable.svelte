<script lang="ts">
    import type { SortDir, StatColumn, StatData } from "@ftc-scout/common";
    import StatHeader from "./StatHeader.svelte";
    import StatRow from "./StatRow.svelte";

    type T = $$Generic;

    export let data: StatData<T>[];
    export let focusedTeam: number | null;

    export let stats: StatColumn<T>[];
    export let currentSort: { id: string; dir: SortDir };
    export let rankStat: StatColumn<T> | null;
</script>

<table class:no-data={stats.length == 0}>
    {#if stats.length}
        <StatHeader {stats} {currentSort} {rankStat} on:change_sort on:move_column />
    {/if}

    {#if !stats.length}
        <tr class="no-data">
            <td> <b>Choose statistics.</b> </td>
        </tr>
    {:else if !data.length}
        <tr class="no-data">
            <td> <b>No items match your current filters.</b> </td>
        </tr>
    {:else}
        <tbody>
            {#each data as dataRow}
                <StatRow data={dataRow} {stats} {focusedTeam} {rankStat} on:row_click />
            {/each}
        </tbody>
    {/if}
</table>

<style>
    table {
        border-spacing: 0;
        border: 1px solid var(--sep-color);
        border-radius: 8px;

        display: block;
        min-width: 100%;
        width: min-content;
        max-width: 100%;
        overflow-x: auto;

        position: relative;

        /* Adapted from: https://lea.verou.me/2012/04/background-attachment-local/ */
        --fade-len: 120px;
        --shadow-len: 25px;
        background: linear-gradient(to right, var(--fg-color) 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to left, var(--fg-color), rgba(255, 255, 255, 0)) 100% 0,
            linear-gradient(to right, var(--fade-shadow), var(--fg-color)),
            linear-gradient(to left, var(--fade-shadow), var(--fg-color)) 100% 0;
        background-repeat: no-repeat;
        background-color: var(--fg-color);
        background-size: var(--fade-len) 100%, var(--fade-len) 100%, var(--shadow-len) 100%,
            var(--shadow-len) 100%;
        background-attachment: local, local, scroll, scroll;
    }

    table :global(thead) {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    table :global(thead:not(.sticking) th:first-child) {
        border-top-left-radius: 7px;
    }
    table :global(thead:not(.sticking) th:last-child) {
        border-top-right-radius: 7px;
    }

    table tbody,
    table tbody :global(tr:last-child) {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
    table tbody :global(tr:last-child td:first-child) {
        border-bottom-left-radius: 7px;
    }
    table tbody :global(tr:last-child td:last-child) {
        border-bottom-right-radius: 7px;
    }

    tbody > :global(:nth-child(even)) {
        background-color: var(--zebra-stripe-opacity);
    }

    .no-data {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--lg-pad);
        width: 100%;
    }
</style>
