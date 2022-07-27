<script lang="ts">
    import GroupsHeader from "./GroupsHeader.svelte";
    import type { StatsSet } from "../../../util/stats/StatsSet";
    import Modal from "../../Modal.svelte";
    import ShowStatsRow from "./ShowStatsRow.svelte";
    import Fa from "svelte-fa";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import ShowStandaloneStats from "./ShowStandaloneStats.svelte";

    type T = $$Generic;

    export let data: T;
    export let statSet: StatsSet<T, unknown>;
    export let shown = false;
</script>

<Modal bind:shown>
    <b slot="title">
        <span>Choose Statistics</span>
        <button
            on:click={() => {
                shown = false;
            }}
        >
            <Fa icon={faXmark} size="1.5x" />
        </button>
    </b>

    <ShowStandaloneStats {statSet} {data} />

    <table>
        <GroupsHeader groups={statSet.groups} {data} />
        {#each statSet.groupStats as groupStat}
            <ShowStatsRow myNestedStat={groupStat} groups={statSet.groups} {data} />
        {/each}
    </table>
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
    }
</style>
