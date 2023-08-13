<script lang="ts">
    import { slide } from "svelte/transition";
    import type { Tree } from "@ftc-scout/common";
    import type { StatSectionRow, StatSet, StatSetSection } from "../stat-table";
    import ExpandButton from "../../ExpandButton.svelte";
    import CheckCell from "./CheckCell.svelte";

    type T = $$Generic;

    export let selectedStats: string[];
    export let stats: StatSet<T>;
    export let section: StatSetSection;
    export let row: Tree<StatSectionRow>;

    export let shown = true;
    export let depth = 0;
    let open = false;
</script>

{#if shown}
    <tr
        transition:slide={{ duration: 250 }}
        class:header={depth == 0 && section.columns.length != 1}
        class:single-col={section.columns.length == 1}
    >
        <td
            on:click={() => (open = !open)}
            class="name"
            class:has-children={row.children.length}
            style:--depth={depth}
        >
            {#if row.children.length}
                <ExpandButton
                    bind:open
                    style="position: absolute; top:0; bottom: 0; left: calc({depth * 2 +
                        1} * var(--md-gap))"
                />
            {/if}

            {row.val.name}
        </td>
        {#each section.columns as column}
            <CheckCell
                {selectedStats}
                id={section.getId(row.val.id, column.id)}
                {column}
                on:choose-stat
            />
        {/each}
    </tr>
{/if}

{#each row.children as child}
    <svelte:self
        {selectedStats}
        {stats}
        {section}
        row={child}
        shown={shown && open}
        depth={depth + 1}
        on:choose-stat
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