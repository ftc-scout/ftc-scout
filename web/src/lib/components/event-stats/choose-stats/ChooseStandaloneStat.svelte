<script lang="ts">
    import Fa from "svelte-fa";
    import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import type { StatsSet } from "../../../util/stats/StatsSet";
    import Checkbox from "./Checkbox.svelte";

    export let statSet: StatsSet<unknown, unknown>;

    const groupWidth = 75;
    $: groupCount = statSet.groups.length;
    $: fullStatsWidth = `${groupCount * groupWidth}px`;
</script>

<ul>
    <li>
        <span />
        <div class="header" style:min-width={fullStatsWidth} title="Choose which statistics are shown.">
            Show Statistic
            <span style:font-size="var(--tiny-font-size)">
                <Fa icon={faQuestionCircle} />
            </span>
        </div>
    </li>

    {#each statSet.standalone as stat, i}
        <li class:zebra-stripe={i % 2 == 1}>
            <span class="name">{stat.longName}</span>
            <div style:min-width={fullStatsWidth}>
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
    }

    li {
        display: flex;
        justify-content: space-between;
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }

    .name {
        padding: var(--padding);
        font-weight: bold;
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
    }
</style>
