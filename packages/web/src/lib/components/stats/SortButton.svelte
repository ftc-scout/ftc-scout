<script lang="ts" context="module">
    export function cycleSortDir(dir: SortDir | null): SortDir | null {
        switch (dir) {
            case null:
                return SortDir.Desc;
            case "Desc":
                return SortDir.Asc;
            case "Asc":
                return null;
        }
    }

    export function cycleSortDirNoNull(dir: SortDir | null): SortDir {
        switch (dir) {
            case null:
                return SortDir.Desc;
            case "Desc":
                return SortDir.Asc;
            case "Asc":
                return SortDir.Desc;
        }
    }
</script>

<script lang="ts">
    import { faSort, faSortAsc, faSortDesc } from "@fortawesome/free-solid-svg-icons";
    import { SortDir } from "@ftc-scout/common";
    import Fa from "svelte-fa";

    export let sort: SortDir | null = null;
    export let name: string;

    $: icon = sort == null ? faSort : sort == SortDir.Desc ? faSortDesc : faSortAsc;
</script>

<button on:click aria-label="Sort by {name}">
    <Fa {icon} />
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
