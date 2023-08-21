<script lang="ts">
    import FilterValInput from "./FilterValInput.svelte";
    import { slide } from "svelte/transition";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import {
        type StatSet,
        type FilterCondition,
        ALL_OPS,
        FILTER_OP_SYMBOLS,
    } from "@ftc-scout/common";
    import Select from "../../ui/form/Select.svelte";
    import { createEventDispatcher } from "svelte";

    type T = $$Generic;

    export let stats: StatSet<T>;
    export let cond: FilterCondition;
    export let depth: number;

    let dispatch = createEventDispatcher();
</script>

<li class="wrap" style:--depth={depth} transition:slide|global={{ duration: 350 }}>
    <FilterValInput bind:val={cond.lhs} {stats} varOnly />
    <Select
        bind:value={cond.op}
        options={ALL_OPS.map((o) => ({ value: o, name: FILTER_OP_SYMBOLS[o] }))}
        style="width: min-content"
        nonForm
    />
    <FilterValInput bind:val={cond.rhs} {stats} />

    <button title="Remove" on:click={() => dispatch("remove")}> <Fa icon={faXmark} fw /> </button>
</li>

<style>
    .wrap {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        width: min-content;
        padding: 0 var(--lg-pad);
        margin-left: calc(var(--depth) * var(--vl-gap));

        border: 1px solid var(--sep-color);
        border-radius: var(--pill-border-radius);
    }

    .wrap:not(:last-child) {
        margin-bottom: var(--md-gap);
    }

    .wrap::before {
        content: "";
        border-top: 1px solid var(--sep-color);

        position: absolute;
        top: 50%;
        width: calc(var(--vl-gap) / 2);
        left: calc(var(--vl-gap) / -2);
    }

    .wrap :global(select) {
        height: 100%;
        border: none;
        border-radius: 0;

        padding-top: var(--sm-pad);
        padding-bottom: var(--sm-pad);
    }

    .wrap :global(input:focus),
    .wrap :global(select:focus) {
        z-index: 1;
    }

    button {
        border: none;
        background: none;
        font-size: inherit;
        font-family: inherit;

        margin-left: var(--md-gap);
        border-radius: var(--pill-border-radius);

        cursor: pointer;
    }

    button:hover {
        background: var(--form-hover-bg-color);
        outline: var(--sm-pad) solid var(--form-hover-bg-color);
    }

    button:active {
        background: var(--form-click-bg-color);
        outline: var(--sm-pad) solid var(--form-click-bg-color);
    }
</style>
