<script lang="ts" context="module">
    type OpenMap = Writable<Record<string, boolean>>;
    let allOpenSections: Record<string, OpenMap> = {};

    function getOpenSections(id: string): OpenMap {
        if (!(id in allOpenSections)) {
            allOpenSections[id] = writable({});
        }

        return allOpenSections[id];
    }
</script>

<script lang="ts">
    import { writable, type Writable } from "svelte/store";
    import { slide } from "svelte/transition";
    import type { Tree } from "@ftc-scout/common";
    import type { StatSectionRow, StatSet, StatSetSection } from "../stat-table";
    import ViewCell from "./ViewCell.svelte";
    import ExpandButton from "../../ExpandButton.svelte";

    type T = $$Generic;

    export let data: T;
    export let stats: StatSet<T>;
    export let section: StatSetSection;
    export let row: Tree<StatSectionRow>;

    export let shown = true;
    export let depth = 0;

    $: openSections = getOpenSections(stats.id);
    $: id = section.getRowId(row.val.id);
</script>

{#if shown}
    <tr
        on:click={() => ($openSections[id] = !$openSections[id])}
        transition:slide={{ duration: 250 }}
        class:header={depth == 0 && section.columns.length != 1}
        class:single-col={section.columns.length == 1}
    >
        <td class="name" class:has-children={row.children.length} style:--depth={depth}>
            {#if row.children.length}
                <ExpandButton
                    open={$openSections[id]}
                    style="position: absolute; top:0; bottom: 0; left: calc({depth * 2 +
                        1} * var(--md-gap))"
                />
            {/if}

            {row.val.name}
        </td>
        {#each section.columns as column}
            <ViewCell {data} {stats} {section} row={row.val} {column} />
        {/each}
    </tr>
{/if}

{#each row.children as child}
    <svelte:self
        {data}
        {stats}
        {section}
        row={child}
        shown={shown && !!$openSections[id]}
        depth={depth + 1}
    />
{/each}

<style>
    tr {
        display: grid;
        grid-template-columns:
            minmax(var(--name-min-len), 1fr)
            repeat(var(--col-count), minmax(var(--data-max), var(--col-width)));
    }

    td {
        display: block;
        white-space: nowrap;
    }

    .name {
        position: relative;

        padding: var(--md-pad);
        padding-left: calc((var(--depth) * 2 + 3) * var(--md-gap));
    }

    :global(.no-children) .name {
        padding-left: var(--md-pad);
    }

    .single-col .name,
    .header .name {
        font-weight: bold;
    }

    .has-children {
        cursor: pointer;
    }

    tr.single-col:nth-child(odd) {
        background-color: var(--zebra-stripe-color);
    }

    .header {
        background-color: var(--zebra-stripe-color);
    }
</style>
