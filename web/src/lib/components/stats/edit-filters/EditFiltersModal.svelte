<script lang="ts">
    import Fa from "svelte-fa";
    import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
    import {
        StatFilterType,
        type StatFilter,
        type StatFilterAndGroup,
        type StatFilterOrGroup,
    } from "../../../util/stats/StatFilter";
    import Modal from "../../Modal.svelte";
    import FaButton from "../../FaButton.svelte";
    import CurrentFilterRow from "./CurrentFilterRow.svelte";
    import type { StatsSet } from "../../../util/stats/StatsSet";

    type T = $$Generic;
    let id = 0;

    function flatten(or: StatFilterOrGroup<T>): [number, "and" | "or", StatFilter<T>][] {
        let ret = [];
        for (let ands of or) {
            let andOr = "or";
            for (let filter of ands) {
                ret.push([id++, andOr, filter] as [number, "and" | "or", StatFilter<T>]);
                andOr = "and";
            }
        }
        return ret;
    }

    function unflatten(flat: [number, "and" | "or", StatFilter<T>][]): StatFilterOrGroup<T> {
        let ors: StatFilterOrGroup<T> = [];
        let curAnd: StatFilterAndGroup<T> = [];

        for (let [_, andOr, filter] of flat) {
            if (andOr == "or") {
                ors.push(curAnd);
                curAnd = [];
            }
            curAnd.push(filter);
        }
        ors.push(curAnd);

        return ors.filter((and) => and.length);
    }

    export let shown = false;
    export let currentFilters: StatFilterOrGroup<T> = [];
    export let statSet: StatsSet<T, unknown>;

    let flat: [number, "and" | "or", StatFilter<T>][] = flatten(currentFilters);
    $: if (!shown) currentFilters = unflatten(flat);

    function add() {
        flat = [...flat, [id++, "and", { lhs: null, type: StatFilterType.EQ, rhs: null }]];
    }

    function del(i: number) {
        flat = flat.filter((_, j) => i != j);
    }
</script>

<Modal bind:shown>
    <b slot="title">
        <span>Edit Filters</span>
        <button on:click={() => (shown = false)}>
            <Fa icon={faXmark} size="1.5x" />
        </button>
    </b>

    {#each flat as [id, groupType, oneFilter], i (id)}
        <CurrentFilterRow
            bind:groupType
            bind:lhs={oneFilter.lhs}
            bind:compareType={oneFilter.type}
            bind:rhs={oneFilter.rhs}
            {statSet}
            showGroupType={i != 0}
            on:delete-me={() => del(i)}
        />
    {/each}

    <div style:margin="var(--gap)">
        <FaButton icon={faPlus} fw on:click={add} />
    </div>

    <div class="min-width" />
</Modal>

<style>
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

    .min-width {
        min-width: 838px;
    }

    @media (max-width: 900px) {
        .min-width {
            min-width: 638px;
        }
    }

    @media (max-width: 800px) {
        .min-width {
            min-width: 609px;
        }
    }

    @media (max-width: 650px) {
        .min-width {
            min-width: 409px;
        }
    }

    @media (max-width: 550px) {
        .min-width {
            min-width: 400px;
        }
    }

    @media (max-width: 450px) {
        .min-width {
            min-width: 0;
        }
    }
</style>
