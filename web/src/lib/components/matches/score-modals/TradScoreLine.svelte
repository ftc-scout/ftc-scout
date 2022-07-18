<script lang="ts">
    import type {
        MatchScores2021Traditional,
        MatchScores2021TraditionalAlliance,
    } from "../../../graphql/generated/graphql-operations";
    import ExpandButton from "../../ExpandButton.svelte";
    import { slide } from "svelte/transition";
    import { trad2021Expansions } from "./expansions";

    type PropFn = (_: MatchScores2021TraditionalAlliance) => number;

    export let score: MatchScores2021Traditional;
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
            <ExpandButton bind:open={showSub} style="position:absolute; left: 0" />
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
        <td class="data red" class:nz={red != 0}>+{red}</td>
        <td class="data blue" class:nz={blue != 0}>+{blue}</td>
    </tr>
{/each}

<style>
    * {
        /* We don't use the global vars because the modal should be full size even on phones */
        font-size: 16px;
    }

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
        padding-left: 8px;
        padding-right: 16px;
        flex-grow: 1;
    }

    .has-subs .name {
        cursor: pointer;
    }

    .heading .name {
        font-weight: bold;
    }

    .normal-row .name {
        padding-left: 24px;
    }

    .sub-row .name {
        padding-left: 48px;
    }

    .data {
        font-weight: bold;
        min-width: 100px;
        text-align: center;
    }

    .sub-row .data {
        font-weight: normal;
    }

    td {
        display: block;
        padding: 8px;
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
