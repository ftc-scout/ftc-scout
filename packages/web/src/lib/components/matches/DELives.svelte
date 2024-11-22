<script lang="ts">
    import {
        faHeart,
        faHeartBroken,
        type IconDefinition as IconDefinitionSolid,
    } from "@fortawesome/free-solid-svg-icons";
    import {
        faHeart as faHeartOutline,
        type IconDefinition as IconDefinitionOutline,
    } from "@fortawesome/free-regular-svg-icons";
    import { Alliance } from "@ftc-scout/common";
    import Fa from "svelte-fa";

    export let alliance: Alliance;
    export let alreadyLost: boolean;
    export let lostThis: boolean;

    function compute(
        i: number,
        alreadyLost: boolean,
        lostThis: boolean
    ): IconDefinitionSolid | IconDefinitionOutline | null {
        if (i == 1 && alreadyLost) return faHeartOutline;

        if (i == +alreadyLost + 1 && lostThis) return faHeartBroken;

        return faHeart;
    }

    $: a = compute(1, alreadyLost, lostThis);
    $: b = compute(2, alreadyLost, lostThis);
</script>

<td class:red={alliance == Alliance.Red} class:blue={alliance == Alliance.Blue} class="hearts">
    {#if a}
        <Fa icon={a} class="heart {a == faHeartBroken || a == faHeartOutline ? 'broken' : ''}" />
    {/if}
    {#if b}
        <Fa icon={b} class="heart {b == faHeartBroken || b == faHeartOutline ? 'broken' : ''}" />
    {/if}
</td>

<style>
    td {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        padding-left: var(--md-gap);
        padding-right: var(--sm-gap);
        gap: var(--sm-gap);
    }

    @media (max-width: 1000px) {
        td {
            flex-direction: row;
            padding-left: var(--sm-gap);
        }
    }

    td.red :global(.heart) {
        color: var(--red-team-text-color);
    }

    td.blue :global(.heart) {
        color: var(--blue-team-text-color);
    }

    td :global(.heart.broken) {
        color: var(--grayed-out-text-color);
    }

    .red {
        background: var(--red-team-bg-color);
    }

    .blue {
        background: var(--blue-team-bg-color);
    }
</style>
