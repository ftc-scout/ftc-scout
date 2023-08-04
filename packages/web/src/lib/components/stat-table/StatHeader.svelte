<script lang="ts">
    import { stickTableHead } from "../../util/directives";
    import SortButton from "./SortButton.svelte";
    import type { StatColumn } from "./stat-table";

    type T = $$Generic;

    export let stats: StatColumn<T>[];
</script>

<thead use:stickTableHead>
    {#each stats as stat}
        <th class={stat.color} class:expand={stat.shouldExpand()}>
            {stat.columnName}
            <SortButton name={stat.columnName} />
        </th>
    {/each}
</thead>

<style>
    th {
        padding: var(--lg-pad);
        font-weight: bold;
        text-align: center;
        white-space: nowrap;

        user-select: none;
        cursor: grab;

        color: var(--stat-text-color);
    }

    @media (max-width: 600px) {
        th {
            padding: var(--lg-pad) var(--sm-pad);
        }
    }

    .expand {
        width: 100%;
    }

    .white {
        color: var(--text-color);
        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
        background: var(--fg-color);
    }

    .purple {
        background: var(--purple-stat-color);
    }
    .green {
        background: var(--green-stat-color);
    }
</style>
