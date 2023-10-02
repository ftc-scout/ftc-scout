<script lang="ts">
    import type { ScoreModalComponent, Season } from "@ftc-scout/common";
    import type { RemoteScoresTy } from "../MatchScore.svelte";
    import ExpandButton from "../../ExpandButton.svelte";
    import { slide } from "svelte/transition";
    import { SM_OPEN_SECTIONS } from "./ScoreModal.svelte";

    export let scores: RemoteScoresTy;
    export let prop: ScoreModalComponent;
    export let children: ScoreModalComponent[] = [];
    export let heading: boolean = false;
    export let sub = false;

    $: value = prop.getValue(scores);

    $: p = sub ? "+" : "";

    $: id = prop.id;
    $: openSections = SM_OPEN_SECTIONS[scores.season as Season];
    $: shownList = $openSections[id] ? children ?? [] : [];
</script>

<tr
    class:heading
    class:sub
    class:has-subs={children.length}
    on:click={() => ($openSections[id] = !$openSections[id])}
    transition:slide={{ duration: 250 }}
>
    <td class="name">
        {#if children.length}
            <ExpandButton
                bind:open={$openSections[id]}
                style="position:absolute; left: var(--md-gap)"
            />
        {/if}
        {prop.remoteDisplayName}
    </td>
    <td class="data" class:zero={value == 0} title={prop.getTitle(scores)}> {p}{value} </td>
</tr>

{#each shownList as sub}
    <svelte:self {scores} prop={sub} sub />
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
        font-weight: bold;
        text-align: center;
        background: var(--neutral-team-bg-color);
        color: var(--neutral-team-text-color);
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
