<script lang="ts">
    import { prettyPrintFloat } from "../../util/format/pretty-print-float";
    import { prettyPrintOrdinal } from "../../util/format/pretty-print-ordinal";
    import type { Stat } from "../../util/stats/Stat";
    import { StatDisplayType } from "../../util/stats/stat-display-type";
    import StatTeam from "./StatTeam.svelte";

    type T = $$Generic;

    export let stat: Stat<T>;
    export let data: T;
    export let selectedTeam: number | null = null;

    $: read = stat.read(data);
    $: team = read as { number: number; name: string };
    $: value = read as number;
</script>

{#if stat.displayType == StatDisplayType.TEAM}
    <StatTeam {team} bind:selectedTeam on:show-data />
{:else}
    <td class={stat.color} title={stat.longName}>
        {#if stat.displayType == StatDisplayType.INTEGER}
            {value}
        {:else if stat.displayType == StatDisplayType.DECIMAL}
            {prettyPrintFloat(value)}
        {:else if stat.displayType == StatDisplayType.RANK}
            {prettyPrintOrdinal(value)}
        {/if}
    </td>
{/if}

<style>
    td {
        text-align: center;

        min-width: 75px;

        padding: var(--small-padding);
    }

    td.white {
        font-weight: bold;
    }

    td.red {
        background: var(--red-stat-color-transparent);
    }

    td.blue {
        background: var(--blue-stat-color-transparent);
    }

    td.light-blue {
        background: var(--light-blue-stat-color-transparent);
    }

    td.green {
        background: var(--green-stat-color-transparent);
    }

    td.purple {
        background: var(--purple-stat-color-transparent);
    }
</style>
