<script lang="ts" context="module">
    export enum SortType {
        NONE,
        LOW_HIGH,
        HIGH_LOW,
    }

    export function toggleSortType(sortType: SortType) {
        switch (sortType) {
            case SortType.NONE:
                return SortType.HIGH_LOW;
            case SortType.HIGH_LOW:
                return SortType.LOW_HIGH;
            default:
                return SortType.HIGH_LOW;
        }
    }
</script>

<script lang="ts">
    import { faSort, faSortAsc, faSortDesc } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let sort: SortType = SortType.NONE;

    const SORT_ICONS = {
        [SortType.NONE]: faSort,
        [SortType.LOW_HIGH]: faSortAsc,
        [SortType.HIGH_LOW]: faSortDesc,
    };
</script>

<button on:click>
    <Fa icon={SORT_ICONS[sort]} />
</button>

<style>
    button {
        border: none;
        background: none;
        color: inherit;

        cursor: pointer;
    }
</style>
