<script lang="ts">
    import Fa from "svelte-fa";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";

    import Modal from "../../Modal.svelte";
    import ChooseFilter from "./ChooseFilter.svelte";
    import type { Filter } from "../../../util/stats/filter";
    import type { StatsSet } from "../../../util/stats/StatsSet";

    type T = $$Generic;

    export let shown = false;
    export let currentFilters: Filter<T>;
    export let statSet: StatsSet<T, unknown>;

    let filter: Filter<T> = currentFilters;

    $: if (!shown) currentFilters = filter;
</script>

<Modal bind:shown>
    <b slot="title">
        <span>Edit Filters</span>
        <button on:click={() => (shown = false)}>
            <Fa icon={faXmark} size="1.5x" />
        </button>
    </b>

    <div>
        <ChooseFilter {filter} {statSet} on:filters-changed={() => console.log(filter)} />
    </div>
</Modal>

<style>
    div {
        font-family: monospace;
        min-width: 65ch;
    }

    b {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--h2-font-size);
        margin-bottom: var(--large-gap);
    }

    button {
        background: none;
        border: none;

        cursor: pointer;
    }
</style>
