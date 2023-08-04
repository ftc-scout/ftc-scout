<script lang="ts" context="module">
    export const SortType = {
        None: "None",
        Desc: "Desc",
        Asc: "Asc",
    } as const;
    export type SortType = (typeof SortType)[keyof typeof SortType];

    export function cycleSortType(sortType: SortType): SortType {
        switch (sortType) {
            case "None":
                return SortType.Desc;
            case "Desc":
                return SortType.Asc;
            case "Asc":
                return SortType.None;
        }
    }
</script>

<script lang="ts">
    import { faSort, faSortAsc, faSortDesc } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let sort: SortType = SortType.None;
    export let name: string;

    const SORT_ICONS = {
        [SortType.None]: faSort,
        [SortType.Desc]: faSortDesc,
        [SortType.Asc]: faSortAsc,
    };
</script>

<button on:click aria-label="Sort by {name}">
    <Fa icon={SORT_ICONS[sort]} />
</button>

<style>
    button {
        border: none;
        background: none;
        color: inherit;

        cursor: pointer;

        font-size: inherit;
    }
</style>
