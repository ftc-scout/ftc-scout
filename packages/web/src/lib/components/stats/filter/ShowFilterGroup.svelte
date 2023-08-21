<script lang="ts">
    import { slide } from "svelte/transition";
    import Fa from "svelte-fa";
    import { faFolderPlus, faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
    import Select from "../../ui/form/Select.svelte";
    import {
        emptyCondition,
        emptyGroup,
        type FilterGroup,
        countChildrenForSidebar,
    } from "@ftc-scout/common";
    import type { StatSet } from "@ftc-scout/common";
    import ShowFilterCond from "./ShowFilterCond.svelte";
    import { createEventDispatcher } from "svelte";

    type T = $$Generic;

    export let stats: StatSet<T>;
    export let group: FilterGroup;
    export let depth = 0;

    let childCount = countChildrenForSidebar(group);
    function computeChildCount() {
        childCount = countChildrenForSidebar(group);
    }

    let dispatch = createEventDispatcher();

    function addCondition() {
        group.children.push(emptyCondition());
        group = group;
        setTimeout(computeChildCount, 400);
        dispatch("change", true);
    }
    function addGroup() {
        group.children.push(emptyGroup());
        group = group;
        setTimeout(computeChildCount, 400);
        dispatch("change", true);
    }
    function remove(i: number) {
        group.children.splice(i, 1);
        group = group;
        computeChildCount();
        dispatch("change", false);
    }
    function change(e: CustomEvent) {
        group = group;
        if (e.detail) {
            setTimeout(computeChildCount, 400);
        } else {
            computeChildCount();
        }
        dispatch("change", e.detail);
    }
</script>

<li
    class="wrap"
    class:not-root={depth != 0}
    style:--depth={depth}
    style:--children={childCount}
    transition:slide|global={{ duration: 350 }}
>
    <Select
        bind:value={group.ty}
        options={[
            { value: "and", name: "All" },
            { value: "or", name: "Any" },
        ]}
        style="width: min-content"
        nonForm
    />

    <div class="buttons">
        <button title="Add Condition" on:click={addCondition}> <Fa icon={faPlus} fw /> </button>
        <button title="Add Group" on:click={addGroup}> <Fa icon={faFolderPlus} fw /> </button>
        {#if depth != 0}
            <button title="Remove" on:click={() => dispatch("remove")}>
                <Fa icon={faXmark} fw />
            </button>
        {/if}
    </div>
</li>

<ul class:not-root={depth != 0}>
    {#each group.children as child, i (child.id)}
        {#if child.ty == "group"}
            <svelte:self
                {stats}
                bind:group={child.group}
                depth={depth + 1}
                on:remove={() => remove(i)}
                on:change={change}
            />
        {:else}
            <ShowFilterCond
                {stats}
                bind:cond={child.cond}
                depth={depth + 1}
                on:remove={() => remove(i)}
                on:change={change}
            />
        {/if}
    {/each}
</ul>

<style>
    .wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        width: min-content;

        gap: var(--xl-gap);
        padding-right: var(--lg-pad);
        margin-left: calc(var(--depth) * var(--vl-gap));
        margin-bottom: var(--md-gap);

        border: 1px solid var(--sep-color);
        border-radius: var(--pill-border-radius);

        --child-height: calc(1em * 1.25 + 2 * var(--sm-pad) + 2px);
    }

    .wrap.not-root::before {
        content: "";
        border-top: 1px solid var(--sep-color);

        position: absolute;
        top: 50%;
        width: calc(var(--vl-gap) / 2);
        left: calc(var(--vl-gap) / -2);
    }

    .wrap::after {
        content: "";
        border-left: 1px solid var(--sep-color);

        position: absolute;
        top: calc(100% + 1px);
        left: calc(var(--vl-gap) / 2);
        width: var(--child-height);
        height: calc(
            (var(--children) - 0.5) * var(--child-height) + var(--children) * var(--md-gap)
        );
    }

    ul.not-root {
        margin-bottom: var(--md-gap);
    }

    .wrap :global(select) {
        height: 100%;
        border: none;
        border-radius: var(--pill-border-radius);

        padding-top: var(--sm-pad);
        padding-bottom: var(--sm-pad);
        padding-left: var(--lg-pad);
        padding-right: 25px;
    }

    .buttons {
        display: flex;
        gap: var(--md-gap);
    }

    button {
        border: none;
        background: none;
        font-size: inherit;
        font-family: inherit;

        border-radius: var(--pill-border-radius);

        cursor: pointer;
    }

    button:hover {
        background: var(--form-hover-bg-color);
        outline: var(--sm-pad) solid var(--form-hover-bg-color);
    }

    button:active {
        background: var(--form-click-bg-color);
        outline: var(--sm-pad) solid var(--form-click-bg-color);
    }
</style>
