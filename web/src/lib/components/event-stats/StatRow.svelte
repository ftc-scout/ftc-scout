<script lang="ts">
    import type { StatList } from "../../util/stats/Stat";
    import StatData from "./StatData.svelte";

    type T = $$Generic;

    export let dataRow: T;
    export let shownStats: StatList<T>;
    export let zebraStripe = false;
    export let selectedTeam: number | null = null;
</script>

<tr class:zebra-stripe={zebraStripe}>
    {#each shownStats as shownStat}
        <StatData stat={shownStat} data={dataRow} bind:selectedTeam />
    {/each}
</tr>

<style>
    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }
</style>
