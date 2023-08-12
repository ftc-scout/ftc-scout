<script lang="ts">
    import type { FilterVal } from "./filter";
    import type { StatSet } from "../stat-table";
    import ChooseStatsModal from "../choose-stats/ChooseStatsModal.svelte";

    type T = $$Generic;

    export let val: FilterVal;
    export let stats: StatSet<T>;
    export let varOnly = false;

    let id: string | null;
    let num: number | null;

    function i(val: FilterVal) {
        if (val.ty == "lit") {
            id = null;
            num = val.lit;
        } else {
            id = val.id;
            num = null;
        }
    }

    function o(id: string | null, num: number | null) {
        val = id != null ? { ty: "var", id } : { ty: "lit", lit: num ?? 0 };
    }

    $: i(val);
    $: o(id, num);

    let shown = false;
    $: selectedStats = id ? [id] : [];

    function chooseStat(newId: string) {
        console.log(newId);
        shown = false;
        id = id == newId ? null : newId;
    }
</script>

<ChooseStatsModal bind:shown {stats} {selectedStats} on:choose-stat={(e) => chooseStat(e.detail)} />

{#if varOnly}
    <input
        name="variable"
        type="text"
        readonly
        on:mousedown|preventDefault
        on:click|preventDefault={() => (shown = true)}
        on:keypress={(e) => {
            if (e.key == "Enter") {
                e.preventDefault();
                shown = true;
            }
        }}
        value={id ? stats.getStat(id).columnName : ""}
    />
{:else}
    <input type="number" />
{/if}

<style>
    input {
        width: 20ch;

        height: 100%;
        border-radius: 0;
        border: none;
        border-left: 1px solid var(--sep-color);
        border-right: 1px solid var(--sep-color);

        padding-top: var(--sm-pad);
        padding-bottom: var(--sm-pad);
    }

    @media (max-width: 800px) {
        input {
            width: 15ch;
        }
    }
</style>
