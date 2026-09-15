<script lang="ts">
    import { StatType } from "@ftc-scout/common";
    import { prettyPrintFloat, prettyPrintOrdinal } from "$lib/printers/number";
    import StatEvent from "../StatEvent.svelte";
    import StatTeam from "../StatTeam.svelte";
    import type { StatColumn, StatData } from "@ftc-scout/common";

    type T = $$Generic;

    export let data: StatData<T>;
    export let stat: StatColumn<T>;
    export let focusedTeam: number | null;
    export let fcmpSlots = 0;

    $: genericData = data.data as any;
    $: eventCode = "eventCode" in genericData ? genericData.eventCode : null;
    $: val = stat.getValue(data);

    $: isAdvanced = val?.ty === "string" && typeof val.val === "string" && val.val.includes("✓");
    $: isAdvancedFcmp =
        isAdvanced && genericData?.advancementRank && genericData.advancementRank <= fcmpSlots;

    $: isIneligible =
        val?.ty === "string" &&
        typeof val.val === "string" &&
        (val.val.includes("Prev Adv") ||
            val.val.includes("Region") ||
            val.val.includes("Count") ||
            val.val.includes("Inelig"));
</script>

{#if val == null}
    <td class="{stat.color} {stat.ty == StatType.Rank ? '' : 'na'}" title={stat.titleName}>
        {#if stat.ty != StatType.Rank} N/A {/if}
    </td>
{:else if val.ty == "team"}
    <StatTeam {val} {eventCode} {focusedTeam} />
{:else if val.ty == "event"}
    <StatEvent {val} color={stat.color} />
{:else}
    <td
        class="{stat.color} {val?.ty ?? 'na'}"
        class:advanced={isAdvanced}
        class:advanced-fcmp={isAdvancedFcmp}
        class:ineligible={isIneligible}
        title={stat.titleName}
    >
        {#if val.ty == "rank" && val.val}
            {prettyPrintOrdinal(val.val)}
        {:else if val.ty == "float"}
            {prettyPrintFloat(val.val)}
        {:else if val.ty == "int" || val.ty == "string"}
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

    /* Advancement status styling */
    td.advanced {
        color: var(--generic-advanced-color);
        font-weight: bold;
    }

    td.advanced-fcmp {
        color: var(--fcmp-advanced-color);
        font-weight: bold;
    }

    td.ineligible {
        color: var(--grayed-out-text-color);
        font-style: italic;
    }
</style>
