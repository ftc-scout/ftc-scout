<script lang="ts">
    import StandaloneStat from "./StandaloneStat.svelte";

    import Fa from "svelte-fa";
    import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import type { StatSetStandalone } from "../../../util/stats/StatSet";

    type T = $$Generic;

    export let data: T;
    export let statSet: StatSetStandalone<T>;
    export let name: string;
</script>

<ul>
    <li>
        <b> {name} </b>
        <div class="header">Value</div>
    </li>

    {#each statSet.standalone as stat, i}
        <StandaloneStat zebraStripe={i % 2 == 0} {stat} {data} />
    {/each}
</ul>

<style>
    b {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;

        margin-bottom: var(--vl-gap);

        max-width: 100%;
        /* width: fit-content; */
    }

    li {
        display: flex;
        justify-content: space-between;
        white-space: nowrap;
    }

    .header {
        padding: var(--padding);
        font-weight: bold;
        background: var(--purple-stat-color);
        color: var(--stat-heading-text-color);

        user-select: none;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--small-gap);
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
