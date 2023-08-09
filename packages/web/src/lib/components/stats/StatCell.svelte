<script lang="ts">
    import { prettyPrintFloat, prettyPrintOrdinal } from "../../printers/number";
    import StatTeam from "./StatTeam.svelte";
    import type { StatColumn, StatData } from "./stat-table";

    type T = $$Generic;

    export let data: StatData<T>;
    export let stat: StatColumn<T>;
    export let focusedTeam: number | null;

    $: val = stat.getValue(data);
</script>

{#if val == null}
    <td class="{stat.color} na" title={stat.titleName}> N/A </td>
{:else if val.ty == "team"}
    <StatTeam {val} {focusedTeam} />
{:else}
    <td class="{stat.color} {val?.ty ?? 'na'}" title={stat.titleName}>
        {#if val.ty == "rank"}
            {prettyPrintOrdinal(val.val)}
        {:else if val.ty == "float"}
            {prettyPrintFloat(val.val)}
        {:else if val.ty == "int"}
            {val.val}
        {:else if val.ty == "record"}
            {val.wins}-{val.losses}-{val.ties}
        {/if}
    </td>
{/if}

<style>
    td {
        text-align: center;
        min-width: 75px;
        padding: var(--md-pad);
    }

    @media (max-width: 600px) {
        td {
            min-width: 50px;
        }
    }

    .rank {
        font-weight: bold;
    }

    .na {
        color: var(--secondary-text-color);
        font-size: var(--sm-font-size);
    }

    .purple {
        background: var(--purple-stat-bg-color);
    }

    .green {
        background: var(--green-stat-bg-color);
    }
</style>
