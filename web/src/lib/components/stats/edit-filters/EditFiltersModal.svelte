<script lang="ts">
    import Fa from "svelte-fa";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";

    import Modal from "../../Modal.svelte";
    import ChooseFilter from "./ChooseFilter.svelte";
    import type { Filter } from "../../../util/stats/filter";
    import type { StatSet } from "../../../util/stats/StatSet";
    import Checkbox from "../choose-stats/Checkbox.svelte";

    type T = $$Generic;

    export let shown = false;
    export let currentFilters: Filter<T>;
    export let statSet: StatSet<T, unknown>;

    let filter: Filter<T> = currentFilters;
    $: if (!shown) currentFilters = filter;

    let advanced = filter.type != "ALL" || filter.conditions.some((c) => c.type != "compare");
    $: canBeSimple = filter.type == "ALL" && filter.conditions.every((c) => c.type == "compare");
</script>

<Modal bind:shown>
    <b slot="title">
        <span>Edit Filters</span>
        <button on:click={() => (shown = false)}>
            <Fa icon={faXmark} size="1.5x" />
        </button>
    </b>

    <div>
        <ChooseFilter {filter} {statSet} on:filters-changed={() => (filter = filter)} {advanced} />
    </div>

    <span>
        <Checkbox bind:checked={advanced} disabled={!canBeSimple && advanced} />
        Advanced Mode
    </span>
</Modal>

<style>
    div {
        font-family: monospace;
        min-width: 65ch;
    }

    span {
        display: flex;
        align-items: center;
        justify-content: right;
        gap: var(--small-gap);
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
