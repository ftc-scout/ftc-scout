<script lang="ts">
    import type { SortDir } from "./StatTableControls.svelte";
    import StatHeader from "./StatHeader.svelte";
    import StatRow from "./StatRow.svelte";
    import type { StatColumn, StatData } from "./stat-table";

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

    <tbody>
        {#if stats.length}
            {#each data as dataRow}
                <StatRow data={dataRow} {stats} {focusedTeam} {rankStat} on:row_click />
            {:else}
                <tr class="no-data">
                    <td> <b>No items match your current filters.</b> </td>
                </tr>
            {/each}
        {:else}
            <tr class="no-data">
                <td> <b>Choose statistics.</b> </td>
            </tr>
        {/if}
    </tbody>
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
        background-color: var(--zebra-stripe-color);
    }

    .no-data {
        display: table;
        width: 100%;
    }

    .no-data b {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--lg-pad);
    }
</style>
