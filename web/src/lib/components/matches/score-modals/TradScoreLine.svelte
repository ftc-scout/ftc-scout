<script lang="ts">
    import ExpandButton from "../../ExpandButton.svelte";
    import { slide } from "svelte/transition";
    import { trad2021Expansions } from "./expansions";

    type T = $$Generic;

    type Outer = {
        red: T;
        blue: T;
    };

    type PropFn = (_: T) => number;

    export let score: Outer;
    export let name: string;
    export let heading = false;
    export let getProp: PropFn;
    export let subProps: [string, PropFn][] = [];

    export let showSub = !!$trad2021Expansions[name];
    $: showSub = !!$trad2021Expansions[name];

    $: red = getProp(score.red);
    $: blue = getProp(score.blue);

    $: shownList = showSub ? subProps : [];
</script>

<tr
    class:normal-row={!heading}
    class:heading
    class:has-subs={!!subProps.length}
    class:subs-shown={showSub}
    on:click={() => ($trad2021Expansions[name] = !$trad2021Expansions[name])}
>
    <td class="name" style="position: relative;">
        {#if subProps.length}
            <ExpandButton bind:open={showSub} style="position:absolute; left: var(--gap)" />
        {/if}

        {name}
    </td>
    <td class="data red" class:nz={red != 0}>{red}</td>
    <td class="data blue" class:nz={blue != 0}>{blue}</td>
</tr>

{#each shownList as [subName, getSubProp] (subName)}
    {@const red = getSubProp(score.red)}
    {@const blue = getSubProp(score.blue)}

    <tr class="sub-row" transition:slide|local={{ duration: 250 }}>
        <td class="name">{subName}</td>
        <td class="data red" class:nz={red != 0}>{red >= 0 ? "+" : ""}{red}</td>
        <td class="data blue" class:nz={blue != 0}>{blue >= 0 ? "+" : ""}{blue}</td>
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
        min-width: 100px;
        text-align: center;
    }

    @media (max-width: 800px) {
        .data {
            min-width: 80px;
        }
    }

    .sub-row .data {
        font-weight: normal;
    }

    td {
        display: block;
        padding: var(--padding);
    }

    .red {
        color: var(--color-team-red);
        background: var(--color-team-red-transparent);
    }

    .blue {
        color: var(--color-team-blue);
        background: var(--color-team-blue-transparent);
    }

    .data:not(.nz) {
        font-weight: normal;
        color: var(--grayed-out-text-color);
    }

    .heading .data:not(.nz) {
        font-weight: bold;
    }
</style>
