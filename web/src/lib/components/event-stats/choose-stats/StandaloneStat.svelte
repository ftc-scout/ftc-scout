<script lang="ts">
    import Checkbox from "./Checkbox.svelte";
    import type { Stat } from "../../../util/stats/Stat";

    export let stat: Stat<unknown>;
    export let zebraStripe = false;

    let checked = false;
</script>

<li class:zebra-stripe={zebraStripe}>
    <span class="name">{stat.longName}</span>
    <div on:click={() => (checked = !checked)}>
        <Checkbox bind:checked />
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
