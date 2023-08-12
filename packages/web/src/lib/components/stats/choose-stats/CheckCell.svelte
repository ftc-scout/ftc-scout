<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Checkbox from "../../ui/Checkbox.svelte";
    import type { StatSectionColumn } from "../stat-table";

    type T = $$Generic;

    export let column: StatSectionColumn;
    export let selectedStats: string[];
    export let id: string;

    let dispatch = createEventDispatcher();

    function onClick(e: MouseEvent) {
        e.stopPropagation();
        // e.preventDefault();
        dispatch("choose-stat", id);
    }
</script>

<td class={column.color}>
    <div>
        <Checkbox on:click={onClick} checked={selectedStats.some((s) => s == id)} />
    </div>
</td>

<style>
    td {
        padding: var(--md-pad);
        min-width: 75px;
    }

    @media (max-width: 700px) {
        td {
            min-width: 50px;
        }
    }

    div {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .red {
        background: var(--red-stat-bg-color);
    }
    .blue {
        background: var(--blue-stat-bg-color);
    }
    .light-blue {
        background: var(--light-blue-stat-bg-color);
    }
    .purple {
        background: var(--purple-stat-bg-color);
    }
    .green {
        background: var(--green-stat-bg-color);
    }
</style>
