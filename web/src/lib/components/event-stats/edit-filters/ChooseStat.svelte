<script lang="ts">
    import { faEdit } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { writable, type Writable } from "svelte/store";
    import type { Stat } from "../../../util/stats/Stat";
    import type { StatsSet } from "../../../util/stats/StatsSet";
    import ChooseStatsModal from "../choose-stats/ChooseStatsModal.svelte";

    type T = $$Generic;

    export let statSet: StatsSet<T, unknown>;
    export let stat: Stat<T> | number | null;

    let chosenStats: Writable<Stat<T>[]> = writable([]);
    $: $chosenStats = stat != null && typeof stat == "object" ? [stat] : [];

    let shown = false;

    function click() {
        if (stat != null && typeof stat == "object") {
            shown = true;
        }
    }
</script>

<ChooseStatsModal
    bind:shown
    {chosenStats}
    {statSet}
    oneOnly
    on:stat-change={() => {
        stat = $chosenStats.length ? $chosenStats[0] : null;
    }}
/>

<div on:click={click}>
    {#if stat == null || typeof stat != "object"}
        <input type="number" class="left" bind:value={stat} />
    {:else if stat != null}
        <span class="left">{stat.identifierName}</span>
    {/if}
    <button on:click={() => (shown = true)}>
        <Fa icon={faEdit} fw />
    </button>
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        align-items: center;

        background: var(--foreground-color);
        border: none;
        color: inherit;

        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;
    }

    .left {
        padding: var(--small-padding);
        width: 300px;
    }

    span.left {
        cursor: pointer;
        user-select: none;
    }

    input,
    button {
        background: none;
        border: none;
    }

    input {
        font-family: var(--main-font);
        font-size: inherit;
    }

    @media (max-width: 900px) {
        .left {
            width: 200px;
        }
    }

    @media (max-width: 650px) {
        .left {
            width: 100px;
        }
    }

    div:focus-within {
        outline: 2px solid;
    }

    input:focus,
    input:focus-visible {
        outline: none;
    }

    button {
        cursor: pointer;
        background: var(--foreground-color);
        border-radius: var(--pill-border-radius);
    }

    button:hover {
        filter: brightness(0.95);
    }

    button:active {
        filter: brightness(0.9);
    }
</style>
