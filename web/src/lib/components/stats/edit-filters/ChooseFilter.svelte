<script lang="ts">
    import { faFolderPlus, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
    import { createEventDispatcher } from "svelte";
    import Fa from "svelte-fa";
    import { slide } from "svelte/transition";
    import { getFilterId, StatFilterType, type Filter } from "../../../util/stats/filter";
    import type { StatsSet } from "../../../util/stats/StatsSet";
    import AllAnyChoice from "./AllAnyChoice.svelte";
    import CompareTypeChoice from "./CompareTypeChoice.svelte";
    import StatOrNumberChoice from "./StatOrNumberChoice.svelte";

    type T = $$Generic;

    export let statSet: StatsSet<T, unknown>;

    export let filter: Filter<T>;
    export let depth = 0;
    export let advanced: boolean;

    let dispatch = createEventDispatcher();

    function deleteAt(i: number) {
        if (filter.type != "compare") {
            filter.conditions.splice(i, 1);
            filter.conditions = filter.conditions;
            dispatch("filters-changed");
        }
    }

    function addGroup(_: Event) {
        if (filter.type != "compare") {
            filter.conditions = [
                ...filter.conditions,
                {
                    id: getFilterId(),
                    type: "ALL",
                    conditions: [{ id: getFilterId(), type: "compare", lhs: 0, operator: StatFilterType.EQ, rhs: 0 }],
                },
            ];
            dispatch("filters-changed");
        }
    }

    function add(_: Event) {
        if (filter.type != "compare") {
            filter.conditions = [
                ...filter.conditions,
                { id: getFilterId(), type: "compare", lhs: 0, operator: StatFilterType.EQ, rhs: 0 },
            ];
            dispatch("filters-changed");
        }
    }

    $: margin = depth != 0 && advanced ? `calc(4 * var(--gap))` : "";
</script>

<div style:margin-left={margin} transition:slide|local={{ duration: 400 }}>
    {#if depth == 0}
        SHOW ROW IF:
    {/if}

    {#if filter.type == "compare"}
        <StatOrNumberChoice bind:stat={filter.lhs} {statSet} statOnly />
        <CompareTypeChoice bind:value={filter.operator} />
        <StatOrNumberChoice bind:stat={filter.rhs} {statSet} />
    {:else}
        {#if advanced}
            <AllAnyChoice bind:value={filter.type} /> (
        {/if}
        {#each filter.conditions as subFilter, i (subFilter.id)}
            <svelte:self
                filter={subFilter}
                depth={depth + 1}
                {advanced}
                {statSet}
                on:delete-me={() => deleteAt(i)}
                on:filters-changed
            />
        {:else}
            <br />
        {/each}
        <button style:margin-left={margin} on:click={add} title="Add condition.">
            <Fa icon={faPlusCircle} fw />
        </button>
        {#if advanced}
            <button on:click={addGroup} title="Add group.">
                <Fa icon={faFolderPlus} fw />
            </button>
            <br />
            )
        {/if}
    {/if}

    {#if depth != 0}
        <button
            on:click={() => dispatch("delete-me")}
            title="Delete condition."
            style:border-left="2px solid var(--neutral-separator-color)"
            style:padding-left="var(--gap)"
        >
            <Fa icon={faTrash} fw />
        </button>
    {/if}
</div>

<style>
    div {
        font-family: monospace;
        margin-top: var(--small-gap);
        margin-bottom: var(--small-gap);
    }

    button {
        background: none;
        border: none;

        cursor: pointer;
    }
</style>
