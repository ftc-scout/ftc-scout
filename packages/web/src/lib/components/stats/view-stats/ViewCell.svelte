<script lang="ts">
    import { prettyPrintFloat, prettyPrintOrdinal } from "../../../printers/number";
    import type { StatSectionColumn, StatSectionRow, StatSet, StatSetSection } from "../stat-table";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let section: StatSetSection;
    export let row: StatSectionRow;
    export let column: StatSectionColumn;

    $: stat = stats.getStat(section.getId(row.id, column.id));
    $: value = stat.getNonRankValue(data);
</script>

<td class={column.color}>
    <div>
        {#if value == null}
            <span class="na">N/A</span>
        {:else if value.ty == "int"}
            {value.val}
        {:else if value.ty == "float"}
            {prettyPrintFloat(value.val)}
        {:else if value.ty == "rank"}
            {prettyPrintOrdinal(value.val)}
        {:else if value.ty == "record"}
            {value.wins}-{value.losses}-{value.ties}
        {:else if value.ty == "team"}
            {value.number} - {value.name}
        {/if}
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
    }

    .purple {
        background: var(--purple-stat-bg-color);
    }

    .green {
        background: var(--green-stat-bg-color);
    }

    .na {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }
</style>
