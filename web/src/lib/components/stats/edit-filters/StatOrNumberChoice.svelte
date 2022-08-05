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
    export let statOnly = false;

    let chosenStats: Writable<Stat<T>[]> = writable([]);
    $: $chosenStats = stat != null && typeof stat == "object" ? [stat] : [];

    let shown = false;
</script>

<ChooseStatsModal
    bind:shown
    {chosenStats}
    {statSet}
    oneOnly
    on:stat-change={() => {
        stat = $chosenStats.length ? $chosenStats[0] : 0;
    }}
/>

<span>
    {#if (typeof stat == "number" || stat == null) && !statOnly}
        <input type="number" bind:value={stat} />
    {:else}
        {@const name =
            stat == null || typeof stat == "number"
                ? ""
                : stat.identifierName.length < 20
                ? stat.identifierName
                : stat.columnName}
        <input
            type="text"
            readonly={true}
            on:mousedown|preventDefault
            on:click|preventDefault={() => (shown = true)}
            on:keypress={(e) => {
                if (e.key == "Enter") shown = true;
            }}
            value={name}
        />
    {/if}
    <button on:click={() => (shown = true)} title="Choose stat.">
        <Fa icon={faEdit} fw />
    </button>
</span>

<style>
    * {
        font: inherit;
    }

    span {
        display: inline-flex;
        flex-direction: row;
        min-width: 23ch;
        justify-content: space-between;
    }

    input {
        width: 20ch;
    }

    input[type="text"] {
        cursor: pointer;
    }

    button {
        border: none;
        background: none;
        cursor: pointer;
    }
</style>
