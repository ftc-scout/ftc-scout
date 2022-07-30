<script lang="ts">
    import type { Stat } from "../../util/stats/Stat";
    import StatData from "./StatData.svelte";

    type T = $$Generic;

    export let dataRow: T;
    export let shownStats: Stat<T>[];
    export let zebraStripe = false;
    export let selectedTeam: number | null = null;
    export let seeStatsData: T | null = null;
</script>

<tr class:zebra-stripe={zebraStripe}>
    {#each shownStats as shownStat}
        <StatData stat={shownStat} data={dataRow} bind:selectedTeam on:show-data={() => (seeStatsData = dataRow)} />
    {/each}
</tr>

<style>
    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
        /* mix-blend-mode: multiply; */
    }

    /* FIXME: Horrible hack due to weird rendering bug with mix-blend-mode and border-radius */
    /* .zebra-stripe:last-child {
        mix-blend-mode: normal;
    } */
</style>
