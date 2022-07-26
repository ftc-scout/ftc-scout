<script lang="ts">
    import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import type { StatGroup } from "../../../util/stats/StatsSet";

    export let groups: StatGroup<unknown, unknown>[];
</script>

<thead>
    <th style:flex-grow="1" />
    {#each groups as group}
        <th class={group.color} title={group.description}>
            <span class="center">
                {group.shortName}
                <span style:font-size="var(--tiny-font-size)">
                    <Fa icon={faQuestionCircle} />
                </span>
            </span>
        </th>
    {/each}
</thead>

<style>
    thead {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    th {
        width: 75px;
        padding: var(--padding);
        font-weight: bold;
        user-select: none;
    }

    .center {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--small-gap);
    }

    .red {
        background: var(--red-stat-color);
        color: var(--stat-heading-text-color);
    }

    .blue {
        background: var(--blue-stat-color);
        color: var(--stat-heading-text-color);
    }

    .light-blue {
        background: var(--light-blue-stat-color);
        color: var(--stat-heading-text-color);
    }

    .green {
        background: var(--green-stat-color);
        color: var(--stat-heading-text-color);
    }

    .purple {
        background: var(--purple-stat-color);
        color: var(--stat-heading-text-color);
    }
</style>
