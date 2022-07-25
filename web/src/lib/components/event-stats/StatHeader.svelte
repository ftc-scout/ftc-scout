<script lang="ts">
    import type { StatList } from "../../util/stats/Stat";

    export let shownStats: StatList<unknown>;
</script>

<thead>
    {#each shownStats as shownStat}
        {#if shownStat == "team"}
            <td class="team">Team</td>
        {:else}
            <td class={shownStat.color} title={shownStat.longName}>{shownStat.shortName}</td>
        {/if}
    {/each}
</thead>

<style>
    td {
        padding: var(--large-padding);

        font-weight: bold;

        text-align: center;
    }

    td.team {
        width: 100%;
    }

    td.team,
    td.white {
        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
    }

    td.red {
        background: var(--red-stat-color);
        color: var(--stat-heading-text-color);
    }

    td.blue {
        background: var(--blue-stat-color);
        color: var(--stat-heading-text-color);
    }

    td.light-blue {
        background: var(--light-blue-stat-color);
        color: var(--stat-heading-text-color);
    }

    td.green {
        background: var(--green-stat-color);
        color: var(--stat-heading-text-color);
    }

    td.purple {
        background: var(--purple-stat-color);
        color: var(--stat-heading-text-color);
    }
</style>
