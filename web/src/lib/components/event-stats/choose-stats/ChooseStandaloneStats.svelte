<script lang="ts">
    import StandaloneStat from "./StandaloneStat.svelte";

    import Fa from "svelte-fa";
    import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import type { StatsSet } from "../../../util/stats/StatsSet";
    import type { Writable } from "svelte/store";
    import type { Stat } from "../../../util/stats/Stat";

    type T = $$Generic;

    export let chosenStats: Writable<Stat<T>[]>;
    export let statSet: StatsSet<T, unknown>;
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
        <StandaloneStat zebraStripe={i % 2 == 0} {stat} {chosenStats} />
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
