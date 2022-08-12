<script lang="ts">
    import type { Stat } from "../../util/stats/Stat";
    import type { StatData } from "./StatsTable.svelte";
    import StatDataComp from "./StatData.svelte";

    type T = $$Generic;

    export let dataRow: StatData<T>;
    export let shownStats: Stat<T>[];
    export let zebraStripe = false;
    export let selectedTeam: number | null = null;
    export let selectedTeamName: string | null = null;
    export let seeStatsData: StatData<T> | null = null;

    let teamHovered = false;
</script>

<tr class:zebra-stripe={zebraStripe} class:team-hovered={teamHovered} on:click={() => (seeStatsData = dataRow)}>
    {#each shownStats as shownStat}
        <StatDataComp
            stat={shownStat}
            data={dataRow}
            bind:selectedTeam
            bind:selectedTeamName
            on:show-data={() => (seeStatsData = dataRow)}
            on:hover-team={() => (teamHovered = true)}
            on:un-hover-team={() => (teamHovered = false)}
        />
    {/each}
</tr>

<style>
    tr {
        outline: transparent solid 2px;
        outline-offset: -2px;
        transition: outline 0.12s ease 0s;

        cursor: pointer;
    }

    tr:hover:not(.team-hovered) {
        z-index: 20;
        outline: 2px solid var(--color-team-neutral);
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
        mix-blend-mode: multiply;
    }

    /* FIXME: Horrible hack due to weird rendering bug with mix-blend-mode and border-radius */
    .zebra-stripe:last-child {
        mix-blend-mode: normal;
    }
</style>
