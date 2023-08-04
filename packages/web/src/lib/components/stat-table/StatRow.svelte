<script lang="ts">
    import StatCell from "./StatCell.svelte";
    import type { StatColumn, StatData } from "./stat-table";

    type T = $$Generic;

    export let data: StatData<T>;
    export let stats: StatColumn<T>[];
    export let focusedTeam: number | null;
</script>

<tr>
    {#each stats as stat}
        <StatCell {data} {stat} {focusedTeam} />
    {/each}
</tr>

<style>
    tr {
        outline: transparent 2px solid;
        outline-offset: -2px;
        transition: outline 0.12s ease 0s;

        cursor: pointer;
    }

    tr:hover:not(:has(td.inner-hover:hover)) {
        outline: 2px solid var(--neutral-team-color);
        z-index: var(--focused-row-zi);
    }
</style>
