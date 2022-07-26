<script lang="ts">
    import { prettyPrintFloat } from "../../util/format/pretty-print-float";
    import { prettyPrintOrdinal } from "../../util/format/pretty-print-ordinal";
    import type { Stat } from "../../util/stats/Stat";
    import { StatDisplayType } from "../../util/stats/stat-display-type";
    import StatTeam from "./StatTeam.svelte";
    import { dragScroll } from "../../util/actions/drag-scroll";

    type T = $$Generic;

    export let stat: Stat<T> | "team";
    export let data: {
        team: {
            number: number;
            name: string;
        };
        stats: T;
    };
    export let selectedTeam: number | null = null;

    $: team = data.team;
</script>

{#if stat == "team"}
    <StatTeam {team} bind:selectedTeam />
{:else}
    {@const value = stat.read(data.stats)}

    <td class={stat.color} title={stat.longName} use:dragScroll>
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
