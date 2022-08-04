<script lang="ts" context="module">
    export type ChosenSort<T> = {
        stat: Stat<T>;
        type: SortType.HIGH_LOW | SortType.LOW_HIGH;
    };
</script>

<script lang="ts">
    import StatRow from "./StatRow.svelte";
    import StatHeaders from "./StatHeaders.svelte";
    import type { Stat } from "../../util/stats/Stat";
    import ChooseStatsModal from "./choose-stats/ChooseStatsModal.svelte";
    import FaButton from "../FaButton.svelte";
    import { faEdit, faFileArrowDown, faFilter } from "@fortawesome/free-solid-svg-icons";
    import type { StatsSet } from "../../util/stats/StatsSet";
    import type { Writable } from "svelte/store";
    import ShowStatsModal from "./show-stats/ShowStatsModal.svelte";
    import { exportStatsCSV } from "../../util/stats/export-stats-csv";
    import EditFiltersModal from "./edit-filters/EditFiltersModal.svelte";
    import type { StatFilterOrGroup } from "../../util/stats/StatFilter";
    import type { SortType } from "../SortButton.svelte";

    type T = $$Generic;

    export let statSet: StatsSet<T, unknown>;

    export let data: T[];
    export let shownStats: Writable<Stat<T>[]>;
    export let selectedTeam: number | null = null;
    export let selectedTeamName: string | null = null;

    export let defaultSort: ChosenSort<T>;
    export let currentSort: ChosenSort<T> = defaultSort;
    export let currentFilters: StatFilterOrGroup<T> = [];

    export let fileName: string;

    let chooseStatsModalShown = false;
    let editFiltersModalShown = false;
    let seeStatsData: T | null = null;
</script>

<div class="options">
    <div>
        <FaButton
            icon={faEdit}
            on:click={() => (chooseStatsModalShown = !chooseStatsModalShown)}
            buttonStyle="font-size: var(--medium-font-size);">Choose Statistics</FaButton
        >
        <FaButton
            icon={faFilter}
            on:click={() => (editFiltersModalShown = !editFiltersModalShown)}
            buttonStyle="font-size: var(--medium-font-size); margin-left: var(--gap);"
            iconColor={currentFilters.length ? "var(--theme-color)" : ""}
        >
            Edit Filters
            {#if currentFilters.length}
                <span style:color="var(--secondary-text-color)" style:font-weight="bold">
                    ({currentFilters.length})
                </span>
            {/if}
        </FaButton>
    </div>

    <FaButton
        icon={faFileArrowDown}
        on:click={() => exportStatsCSV(fileName, data, $shownStats)}
        buttonStyle="font-size: var(--medium-font-size);"
        disabled={$shownStats.length == 0
            ? "Select statistics to export csv."
            : data.length == 0
            ? "Select data to export csv."
            : null}
    >
        Export CSV
    </FaButton>
</div>

<ChooseStatsModal bind:shown={chooseStatsModalShown} {statSet} bind:chosenStats={shownStats} />
<EditFiltersModal bind:shown={editFiltersModalShown} bind:currentFilters {statSet} />
{#if seeStatsData != null} <ShowStatsModal shown={seeStatsData != null} data={seeStatsData} {statSet} /> {/if}

<table tabindex="-1">
    <StatHeaders bind:shownStats bind:sort={currentSort} {defaultSort} />
    {#if data.length}
        <tbody>
            {#each data as dataRow, i}
                <StatRow
                    {dataRow}
                    shownStats={$shownStats}
                    zebraStripe={i % 2 == 1}
                    bind:selectedTeam
                    bind:selectedTeamName
                    bind:seeStatsData
                />
            {/each}
        </tbody>
    {:else}
        <tr style:display="flex" style:width="100%" style:align-items="center" style:justify-content="center">
            <td style:display="block" style:padding="var(--padding)"> No items match your current filters. </td>
        </tr>
    {/if}
</table>

<style>
    .options {
        margin-bottom: var(--large-gap);

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    table {
        border-spacing: 0;
        border-collapse: collapse;

        border: 1px solid lightgray;
        border-radius: 8px;

        display: block;
        min-width: 100%;
        width: min-content;
        max-width: 100%;
        overflow: auto;

        position: relative;

        /* Adapted from: https://lea.verou.me/2012/04/background-attachment-local/ */
        background: linear-gradient(to right, white 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to left, white, rgba(255, 255, 255, 0)) 100% 0,
            linear-gradient(to right, rgba(0, 0, 0, 0.2), white),
            linear-gradient(to left, rgba(0, 0, 0, 0.2), white) 100% 0;
        background-repeat: no-repeat;
        background-color: white;
        background-size: 60px 100%, 60px 100%, 25px 100%, 25px 100%;

        /* Opera doesn't support this in the shorthand */
        background-attachment: local, local, scroll, scroll;
    }

    table:focus-visible {
        outline: none;
        border: 1px solid black;
    }
</style>
