<script lang="ts">
    import type { StatGroup } from "../../../util/stats/StatsSet";
    import Checkbox from "./Checkbox.svelte";

    export let group: StatGroup<unknown, unknown>;

    let checked = false;
</script>

<td class={`${group.color} group`} on:click={() => (checked = !checked)}>
    <div>
        <Checkbox bind:checked />
    </div>
</td>

<style>
    td.group {
        min-width: 75px;
        width: 75px;
    }

    td.group div {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .white {
        font-weight: bold;
    }

    .red {
        background: var(--red-stat-color-transparent);
    }

    .blue {
        background: var(--blue-stat-color-transparent);
    }

    .light-blue {
        background: var(--light-blue-stat-color-transparent);
    }

    .green {
        background: var(--green-stat-color-transparent);
    }

    .purple {
        background: var(--purple-stat-color-transparent);
    }
</style>
