<script lang="ts">
    import type { Descriptor } from "@ftc-scout/common";
    import type { TradScoresTy } from "../MatchScore.svelte";
    import ExpandButton from "../../ExpandButton.svelte";
    import { slide } from "svelte/transition";

    export let scores: TradScoresTy;
    export let prop: Descriptor["scoreTree"][number];

    $: red = prop.getScore(scores.red);
    $: blue = prop.getScore(scores.blue);

    console.log(scores);

    let showSub = false;

    $: shownList = showSub ? prop.subProps ?? [] : [];
</script>

<tr
    class:heading={prop.heading}
    class:has-subs={prop.subProps?.length}
    on:click={() => (showSub = !showSub)}
>
    <td class="name">
        {#if prop.subProps?.length}
            <ExpandButton bind:open={showSub} style="position:absolute; left: var(--md-gap)" />
        {/if}
        {prop.displayName}
    </td>
    {#if prop.getCount}
        <td class="data red" class:zero={red == 0}>
            {prop.getCount(scores.red)}
            {red != 0 ? `(+${red})` : ""}
        </td>
        <td class="data blue" class:zero={blue == 0}>
            {prop.getCount(scores.blue)}
            {blue != 0 ? `(+${blue})` : ""}
        </td>
    {:else}
        <td class="data red" class:zero={red == 0}> {red} </td>
        <td class="data blue" class:zero={blue == 0}> {blue} </td>
    {/if}
</tr>

{#each shownList as sub}
    {@const redS = sub.getScore(scores.red)}
    {@const blueS = sub.getScore(scores.blue)}

    <tr class="sub" transition:slide={{ duration: 250 }}>
        <td class="name"> {sub.displayName} </td>
        {#if sub.getCount}
            <td class="data red" class:zero={redS == 0}>
                {sub.getCount(scores.red)}
                {redS != 0 ? `(+${redS})` : ""}
            </td>
            <td class="data blue" class:zero={blueS == 0}>
                {sub.getCount(scores.blue)}
                {blueS != 0 ? `(+${blueS})` : ""}
            </td>
        {:else}
            <td class="data red" class:zero={redS == 0}> +{redS} </td>
            <td class="data blue" class:zero={blueS == 0}> +{blueS} </td>
        {/if}
    </tr>
{/each}

<style>
    tr {
        transition-property: margin;
        transition-property: 250ms;
    }

    .has-subs {
        cursor: pointer;
    }

    td {
        display: block;
        padding: var(--md-pad);
    }

    .heading {
        background: var(--zebra-stripe-color);
    }

    .name {
        padding-left: var(--md-gap);
        padding-right: calc(var(--md-gap) * 2);
        position: relative;
        display: flex;
        align-items: center;
    }

    :not(.sub) .name {
        padding-left: calc(var(--md-gap) * 3);
    }

    .sub .name {
        padding-left: calc(var(--md-gap) * 6);
    }

    .heading .name {
        padding-left: var(--md-gap);
        font-weight: 700;
    }

    .data {
        /* font-weight: bold; */
        text-align: center;
    }

    .red {
        background: var(--red-team-bg-color);
        color: var(--red-team-color);
    }
    .blue {
        background: var(--blue-team-bg-color);
        color: var(--blue-team-color);
    }

    .zero {
        color: var(--grayed-out-text-color);
        font-weight: normal;
    }

    .heading .data {
        font-weight: bold;
    }

    .sub .data {
        font-weight: normal;
    }
</style>
