<script lang="ts">
    import Fa from "svelte-fa";
    import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import type { StatsSet } from "../../../util/stats/StatsSet";
    import Checkbox from "./Checkbox.svelte";

    export let statSet: StatsSet<unknown, unknown>;
</script>

<ul>
    <li>
        <span />
        <div class="header" title="Choose which statistics are shown.">
            Show Statistic
            <span style:font-size="var(--tiny-font-size)">
                <Fa icon={faQuestionCircle} />
            </span>
        </div>
    </li>

    {#each statSet.standalone as stat, i}
        <li class:zebra-stripe={i % 2 == 1}>
            <span class="name">{stat.longName}</span>
            <div>
                <Checkbox />
            </div>
        </li>
    {/each}
</ul>

<style>
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

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }

    .name {
        padding: var(--padding);
        font-weight: bold;

        flex-grow: 1;
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
