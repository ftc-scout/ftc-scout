<script lang="ts">
    import ChooseStatsSection from "./ChooseStatsSection.svelte";

    import Modal from "../../Modal.svelte";
    import type { StatSet } from "../stat-table";

    type T = $$Generic;

    export let selectedStats: string[];
    export let stats: StatSet<T>;
    export let shown = false;
</script>

<Modal bind:shown titleText="Choose Statistics">
    {#each stats.sections as section}
        <ChooseStatsSection {selectedStats} {stats} {section} on:choose-stat />
    {/each}
</Modal>
