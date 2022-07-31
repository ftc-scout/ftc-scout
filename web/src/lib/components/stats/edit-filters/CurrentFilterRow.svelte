<script lang="ts">
    import { faTrash } from "@fortawesome/free-solid-svg-icons";
    import { createEventDispatcher } from "svelte";

    import type { Stat } from "../../../util/stats/Stat";
    import type { StatFilterType } from "../../../util/stats/StatFilter";
    import type { StatsSet } from "../../../util/stats/StatsSet";
    import FaButton from "../../FaButton.svelte";
    import AndOrPlaceholder from "./AndOrPlaceholder.svelte";
    import ChooseAndOr from "./ChooseAndOr.svelte";
    import ChooseCompare from "./ChooseCompare.svelte";
    import ChooseStat from "./ChooseStat.svelte";

    type T = $$Generic;

    export let statSet: StatsSet<T, unknown>;
    export let showGroupType = true;
    export let groupType: "and" | "or";
    export let lhs: Stat<T> | number | null;
    export let compareType: StatFilterType;
    export let rhs: Stat<T> | number | null;

    let dispatch = createEventDispatcher();
</script>

<div>
    {#if showGroupType}
        <ChooseAndOr bind:type={groupType} />
    {:else}
        <AndOrPlaceholder />
    {/if}

    <ChooseStat {statSet} bind:stat={lhs} />
    <ChooseCompare bind:type={compareType} />
    <ChooseStat {statSet} bind:stat={rhs} />

    <FaButton icon={faTrash} fw on:click={() => dispatch("delete-me")} />
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--gap);

        margin: var(--gap);
    }
</style>
