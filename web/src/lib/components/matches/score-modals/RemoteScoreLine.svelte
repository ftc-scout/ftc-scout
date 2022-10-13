<script lang="ts">
    import ExpandButton from "../../ExpandButton.svelte";
    import { slide } from "svelte/transition";
    import { remote2021Expansions } from "./expansions";

    type T = $$Generic;

    type PropFn = (_: T) => number;

    export let score: T;
    export let name: string;
    export let heading = false;
    export let getProp: PropFn;
    export let subProps: [string, PropFn][] = [];

    export let showSub = !!$remote2021Expansions[name];
    $: showSub = !!$remote2021Expansions[name];

    $: shownList = showSub ? subProps : [];
</script>

<tr
    class:normal-row={!heading}
    class:heading
    class:has-subs={!!subProps.length}
    class:subs-shown={showSub}
    on:click={() => ($remote2021Expansions[name] = !$remote2021Expansions[name])}
>
    <td class="name" style="position: relative;">
        {#if subProps.length}
            <ExpandButton bind:open={showSub} style="position:absolute; left: var(--gap)" />
        {/if}

        {name}
    </td>
    <td class="data" class:nz={getProp(score) != 0}>{getProp(score)}</td>
</tr>

{#each shownList as [subName, getSubProp] (subName)}
    <tr class="sub-row" transition:slide|local={{ duration: 250 }}>
        <td class="name">{subName}</td>
        <td class="data" class:nz={getSubProp(score) != 0}>+{getSubProp(score)}</td>
    </tr>
{/each}

<style>
    tr {
        width: 100%;
        display: flex;
        flex-direction: row;
        transition-property: margin;
        transition-duration: 250ms;
    }

    .heading {
        background: var(--zebra-stripe-color);
    }

    .name {
        padding-left: var(--gap);
        padding-right: calc(var(--gap) * 2);
        flex-grow: 1;
    }

    .has-subs .name {
        cursor: pointer;
    }

    .heading .name {
        font-weight: bold;
    }

    .normal-row .name {
        padding-left: calc(var(--gap) * 3);
    }

    .sub-row .name {
        padding-left: calc(var(--gap) * 6);
    }

    .data {
        font-weight: bold;
        min-width: 150px;
        text-align: center;
        color: var(--color-team-neutral);
        background: var(--color-team-neutral-transparent);
    }

    @media (max-width: 800px) {
        .data {
            min-width: 100px;
        }
    }

    .sub-row .data {
        font-weight: normal;
    }

    td {
        display: block;
        padding: var(--padding);
    }

    .data:not(.nz) {
        font-weight: normal;
        color: var(--grayed-out-text-color);
    }

    .heading .data:not(.nz) {
        font-weight: bold;
    }
</style>
