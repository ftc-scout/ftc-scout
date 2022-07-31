<script lang="ts" context="module">
    let openTabs: Writable<Set<string>> = writable(new Set());
</script>

<script lang="ts">
    import ShowSingleStat from "./ShowSingleStat.svelte";

    import type { NestedStat, StatGroup } from "../../../util/stats/StatsSet";
    import ExpandButton from "../../ExpandButton.svelte";
    import { slide } from "svelte/transition";
    import { writable, type Writable } from "svelte/store";

    type T = $$Generic;

    export let data: T;
    export let groups: StatGroup<T, unknown>[];
    export let myNestedStat: NestedStat<T>;
    export let nestingDepth = 0;
    export let shown = true;

    $: stat = myNestedStat.stat;
    $: nested = myNestedStat.nestedStats;
    $: open = $openTabs.has(stat.identifierName);

    function toggle() {
        if (open) {
            $openTabs.delete(stat.identifierName);
            $openTabs = $openTabs;
        } else {
            $openTabs.add(stat.identifierName);
            $openTabs = $openTabs;
        }
    }
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
            on:click={toggle}
        >
            {#if nested.length}
                <ExpandButton bind:open style={`position:absolute; left: calc(${nestingDepth * 4} * var(--gap))`} />
            {/if}

            {stat.listName}
        </td>
        {#each groups as group}
            <ShowSingleStat {group} stat={group.get(stat)} {data} />
        {/each}
    </tr>
{/if}

{#each nested as nestedStat (nestedStat.stat.identifierName)}
    <svelte:self myNestedStat={nestedStat} {groups} nestingDepth={nestingDepth + 1} shown={open && shown} {data} />
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
</style>
