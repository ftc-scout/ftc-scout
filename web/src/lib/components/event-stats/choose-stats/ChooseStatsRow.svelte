<script lang="ts">
    import ChooseSingleStat from "./ChooseSingleStat.svelte";

    import type { NestedStat, StatGroup } from "../../../util/stats/StatsSet";
    import ExpandButton from "../../ExpandButton.svelte";
    import { slide } from "svelte/transition";
    import type { Writable } from "svelte/store";
    import type { Stat } from "../../../util/stats/Stat";

    type T = $$Generic;

    export let chosenStats: Writable<Stat<T>[]>;
    export let groups: StatGroup<T, unknown>[];
    export let myNestedStat: NestedStat<T>;
    export let nestingDepth = 0;
    export let shown = true;

    let open = false;

    $: stat = myNestedStat.stat;
    $: nested = myNestedStat.nestedStats;
</script>

{#if shown}
    <tr
        transition:slide|local={{ duration: 250 }}
        class:is-header={nestingDepth == 0}
        class:is-nested={nestingDepth > 0}
    >
        <td
            class="name"
            class:has-nested={nested.length}
            style={`padding-left: calc(${nestingDepth * 4 + 3} * var(--gap));`}
            on:click={() => {
                open = !open;
            }}
        >
            {#if nested.length}
                <ExpandButton bind:open style={`position:absolute; left: calc(${nestingDepth * 4} * var(--gap))`} />
            {/if}

            {stat.longName}
        </td>
        {#each groups as group}
            <ChooseSingleStat {group} stat={group.get(stat)} {chosenStats} />
        {/each}
    </tr>
{/if}

{#each nested as nestedStat (nestedStat.stat.longName)}
    <svelte:self
        myNestedStat={nestedStat}
        {groups}
        nestingDepth={nestingDepth + 1}
        shown={open && shown}
        {chosenStats}
    />
{/each}

<style>
    tr {
        display: flex;
        flex-direction: row;

        width: 100%;

        white-space: nowrap;
    }

    tr.is-header {
        background: var(--zebra-stripe-color);
        font-weight: bold;
    }

    td.name {
        flex-grow: 1;
        padding: var(--padding);
        padding-right: calc(2 * var(--gap));
        position: relative;
    }

    .has-nested {
        cursor: pointer;
    }

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
