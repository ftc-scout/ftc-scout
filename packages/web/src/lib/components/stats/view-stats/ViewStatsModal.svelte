<script lang="ts">
    import ViewStatsSection from "./ViewStatsSection.svelte";
    import Modal from "../../Modal.svelte";
    import type { StatSet } from "@ftc-scout/common";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let shown = false;
</script>

<Modal bind:shown titleText="Statistics">
    {#each stats.sections as section}
        <ViewStatsSection {data} {stats} {section} />
    {/each}
</Modal>
