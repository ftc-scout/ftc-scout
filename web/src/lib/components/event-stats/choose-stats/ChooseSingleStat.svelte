<script lang="ts">
    import type { Writable } from "svelte/store";
    import type { Stat } from "../../../util/stats/Stat";
    import type { StatGroup } from "../../../util/stats/StatsSet";
    import Checkbox from "./Checkbox.svelte";

    type T = $$Generic;

    export let chosenStats: Writable<Stat<T>[]>;
    export let group: StatGroup<T, unknown>;
    export let stat: Stat<T>;

    $: checked = $chosenStats.some((s) => s.longName == stat.longName);

    function handleClick() {
        console.log("click", checked);
        if (checked) {
            console.log("subtracting");
            $chosenStats = $chosenStats.filter((s) => s.longName != stat.longName);
        } else {
            console.log("adding");
            $chosenStats = [...$chosenStats, stat];
        }
    }
</script>

<td class={`${group.color} group`} on:click={handleClick}>
    <div>
        <Checkbox {checked} />
    </div>
</td>

<style>
    td.group {
        min-width: 75px;
        width: 75px;
    }

    @media (max-width: 700px) {
        td.group {
            min-width: 50px;
            width: 50px;
        }
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
