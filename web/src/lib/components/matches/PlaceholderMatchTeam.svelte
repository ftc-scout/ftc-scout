<script lang="ts">
    export let width: string;
    export let color: "red" | "blue";

    $: red = color == "red";
    $: blue = color == "blue";
</script>

<td class:red class:blue style:max-width={width} style:width style:min-width={width} />

<style>
    td {
        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;

        display: table-cell;
    }

    td.red {
        background-color: var(--color-team-red-transparent);
    }

    td.blue {
        background-color: var(--color-team-blue-transparent);
    }
</style>
