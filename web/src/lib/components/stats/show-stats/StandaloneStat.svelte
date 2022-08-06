<script lang="ts">
    import type { Stat } from "../../../util/stats/Stat";
    import ShowData from "./ShowData.svelte";

    type T = $$Generic;

    export let data: T;
    export let stat: Stat<T>;
    export let zebraStripe = false;
</script>

<li class:zebra-stripe={zebraStripe}>
    <span class="name">{stat.listName}</span>
    <div>
        <ShowData {stat} {data} />
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
        text-align: center;
        padding: var(--padding);
        background: var(--purple-stat-color-transparent);

        min-width: 200px;
        max-width: 200px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    @media (max-width: 500px) {
        li div {
            min-width: 100px;
        }
    }
</style>
