<script lang="ts">
    import GroupsHeader from "./GroupsHeader.svelte";
    import type { StatSet } from "../../../util/stats/StatSet";
    import Modal from "../../Modal.svelte";
    import ChooseStatsRow from "./ChooseStatsRow.svelte";
    import Fa from "svelte-fa";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import ChooseStandaloneStats from "./ChooseStandaloneStats.svelte";
    import type { Writable } from "svelte/store";
    import type { Stat } from "../../../util/stats/Stat";
    import { createEventDispatcher } from "svelte";

    type T = $$Generic;

    export let chosenStats: Writable<Stat<T>[]>;
    export let statSet: StatSet<unknown, unknown>;
    export let oneOnly = false;
    export let shown = false;

    let dispatch = createEventDispatcher();

    function change() {
        if (oneOnly) {
            shown = false;
        }
        dispatch("stat-change");
    }
</script>

<Modal bind:shown>
    <b slot="title" class="title">
        <span>Choose Statistics</span>
        <button
            on:click={() => {
                shown = false;
            }}
        >
            <Fa icon={faXmark} size="1.5x" />
        </button>
    </b>

    {#each statSet as set}
        {#if set.type == "standalone"}
            <ChooseStandaloneStats statSet={set.set} {chosenStats} {oneOnly} on:stat-change={change} name={set.name} />
        {:else}
            <table>
                <GroupsHeader groups={set.set.groups} name={set.name} />
                {#each set.set.groupStats as groupStat}
                    <ChooseStatsRow
                        myNestedStat={groupStat}
                        groups={set.set.groups}
                        {chosenStats}
                        {oneOnly}
                        on:stat-change={change}
                    />
                {/each}
            </table>
        {/if}
    {/each}
</Modal>

<style>
    .title {
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

    table {
        border-spacing: 0;
        display: block;

        width: fit-content;
    }
</style>
