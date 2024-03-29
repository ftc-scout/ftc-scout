<script lang="ts">
    import { prettyPrintFloat, prettyPrintOrdinal } from "../../../printers/number";
    import type {
        StatSectionColumn,
        StatSectionRow,
        StatSet,
        StatSetSection,
    } from "@ftc-scout/common";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let section: StatSetSection;
    export let row: StatSectionRow;
    export let column: StatSectionColumn;
    export let extra = false;

    $: stat = stats.getStat(section.getId(row.id, column.id));
    $: value = stat.getNonRankValue(data);
</script>

<td class={column.color} class:extra>
    <div class:zero={value && "val" in value && !value.val}>
        {#if value == null}
            <span class="na">N/A</span>
        {:else if value.ty == "int"}
            {value.val}
        {:else if value.ty == "float"}
            {prettyPrintFloat(value.val)}
        {:else if value.ty == "rank"}
            {prettyPrintOrdinal(value.val)}
        {:else if value.ty == "string"}
            {value.val}
        {:else if value.ty == "record"}
            {value.wins}-{value.losses}-{value.ties}
        {:else if value.ty == "team"}
            <span title="{value.number} - {value.name}">
                {value.number}
                <span class="name">
                    - <em style="padding-left: var(--sm-gap);">{value.name}</em>
                </span>
            </span>
        {:else if value.ty == "event"}
            {value.name}
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
        height: 100%;
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

    .extra.red {
        color: var(--red-team-text-color);
        font-weight: bold;
    }
    .extra.blue {
        color: var(--blue-team-text-color);
        font-weight: bold;
    }

    .na {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
        font-weight: normal;
    }

    .zero {
        font-weight: normal;
        color: var(--grayed-out-text-color);
    }

    .name {
        display: none;
    }

    :global(.single-col) .name {
        display: inline;
    }
</style>
