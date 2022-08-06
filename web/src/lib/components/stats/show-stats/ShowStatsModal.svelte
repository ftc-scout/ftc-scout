<script lang="ts">
    import GroupsHeader from "./GroupsHeader.svelte";
    import type { StatSet } from "../../../util/stats/StatSet";
    import Modal from "../../Modal.svelte";
    import ShowStatsRow from "./ShowStatsRow.svelte";
    import Fa from "svelte-fa";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import ShowStandaloneStats from "./ShowStandaloneStats.svelte";

    type T = $$Generic;

    export let data: T;
    export let statSet: StatSet<T, unknown>;
    export let shown = false;
</script>

<Modal bind:shown>
    <b slot="title">
        <span>Statistics</span>
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
            <ShowStandaloneStats statSet={set.set} {data} name={set.name} />
        {:else}
            <table>
                <GroupsHeader groups={set.set.groups} name={set.name} />
                {#each set.set.groupStats as groupStat}
                    <ShowStatsRow myNestedStat={groupStat} groups={set.set.groups} {data} />
                {/each}
            </table>
        {/if}
    {/each}
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

    table {
        border-spacing: 0;
        display: block;

        width: fit-content;

        margin-bottom: var(--vl-gap);
    }
</style>
