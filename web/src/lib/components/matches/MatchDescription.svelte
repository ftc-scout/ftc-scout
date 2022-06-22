<script lang="ts">
    export let winner: "RED" | "BLUE" | "TIE" | "SOLO";
    export let description: string;
</script>

<td
    style:width="4.5em"
    class:red={winner == "RED"}
    class:blue={winner == "BLUE"}
    class:tie={winner == "TIE"}
>
    <strong>{description}</strong>
</td>

<style>
    td {
        display: inline-block;
        padding-left: var(--gap);
    }

    .red {
        color: var(--color-team-red);
    }

    .blue {
        color: var(--color-team-blue);
    }

    .tie {
        color: var(--color-team-neutral);
    }
</style>
