<script lang="ts">
    import Checkbox from "./Checkbox.svelte";
    import type { Stat } from "../../../util/stats/Stat";
    import type { Writable } from "svelte/store";
    import { createEventDispatcher } from "svelte";

    type T = $$Generic;

    export let chosenStats: Writable<Stat<T>[]>;
    export let stat: Stat<T>;
    export let oneOnly: boolean;
    export let zebraStripe = false;

    $: checked = $chosenStats.includes(stat);

    let dispatch = createEventDispatcher();

    function handleClick() {
        if (checked) {
            $chosenStats = $chosenStats.filter((s) => s != stat);
        } else {
            $chosenStats = oneOnly ? [stat] : [...$chosenStats, stat];
        }
        dispatch("stat-change");
    }
</script>

<li class:zebra-stripe={zebraStripe}>
    <span class="name">{stat.listName}</span>
    <div on:click={handleClick}>
        <Checkbox {checked} />
    </div>
</li>

<style>
    li {
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }

    .name {
        padding: var(--padding);
        font-weight: bold;

        flex-grow: 1;
    }

    li div {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--purple-stat-color-transparent);

        min-width: 200px;
    }

    @media (max-width: 500px) {
        li div {
            min-width: 100px;
        }
    }
</style>
