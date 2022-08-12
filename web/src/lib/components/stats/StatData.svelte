<script lang="ts">
    import { prettyPrintFloat } from "../../util/format/pretty-print-float";
    import { prettyPrintOrdinal } from "../../util/format/pretty-print-ordinal";
    import type { Stat } from "../../util/stats/Stat";
    import { StatDisplayType } from "../../util/stats/stat-display-type";
    import StatEvent from "./StatEvent.svelte";
    import type { StatData } from "./StatsTable.svelte";
    import StatTeam from "./StatTeam.svelte";

    type T = $$Generic;

    export let stat: Stat<T>;
    export let data: StatData<T>;
    export let selectedTeam: number | null = null;
    export let selectedTeamName: string | null = null;

    $: read = stat.read(data);
    $: team = read as { number: number; name: string };
    $: event = read as {
        name: string;
        start: string;
        end: string;
        code: string;
        season: number;
    };
    $: value = read as number;
</script>

{#if stat.displayType == StatDisplayType.TEAM}
    <StatTeam {team} bind:selectedTeam bind:selectedTeamName on:hover-team on:un-hover-team />
{:else if stat.displayType == StatDisplayType.EVENT}
    <StatEvent {event} on:hover-team on:un-hover-team />
{:else if stat.displayType == StatDisplayType.STRING}
    {read}
{:else}
    <td class={stat.color} title={stat.identifierName}>
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

    @media (max-width: 600px) {
        td {
            min-width: 50px;
        }
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
