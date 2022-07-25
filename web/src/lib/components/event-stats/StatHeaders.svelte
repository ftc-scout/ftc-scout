<script lang="ts">
    import type { Stat, StatList } from "../../util/stats/Stat";
    import SortButton, { cycleSortType, SortType } from "../SortButton.svelte";

    export let shownStats: StatList<unknown>;

    export let sort: {
        stat: Stat<unknown> | "team";
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    } | null = null;

    function handleClick(stat: Stat<unknown> | "team") {
        let currentSort = sort?.stat == stat ? sort.type : SortType.NONE;
        let newSort = cycleSortType(currentSort);

        if (newSort == SortType.NONE) {
            sort = null;
        } else {
            sort = {
                stat,
                type: newSort,
            };
        }
    }
</script>

<thead>
    {#each shownStats as shownStat}
        {@const mySort = shownStat == sort?.stat ? sort.type : SortType.NONE}
        {#if shownStat == "team"}
            <td class="team">
                Team
                <SortButton sort={mySort} on:click={() => handleClick(shownStat)} />
            </td>
        {:else}
            <td class={shownStat.color} title={shownStat.longName}>
                {shownStat.shortName}
                <SortButton sort={mySort} on:click={() => handleClick(shownStat)} />
            </td>
        {/if}
    {/each}
</thead>

<style>
    td {
        padding: var(--large-padding);
        font-weight: bold;
        text-align: center;
        white-space: nowrap;
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
