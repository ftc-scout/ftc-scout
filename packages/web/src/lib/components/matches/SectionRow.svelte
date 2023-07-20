<script lang="ts">
    export let name: string;
</script>

<tr>
    <td />
    <td class="red" />
    <td class="blue" />
    <td class="name"> <span>{name}</span> </td>
</tr>

<style>
    tr {
        display: grid;
        grid-template-columns: 10.75em 1fr 1fr;
        height: calc(var(--xl-gap) * 1.5);
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 9.75em 1fr 1fr;
        }
    }

    td {
        display: block;
    }

    .red {
        background: var(--red-team-bg-color);
        grid-row: 1 / 1;
        grid-column: 2 / 3;
    }
    .blue {
        background: var(--blue-team-bg-color);
        grid-row: 1 / 1;
        grid-column: 3 / 4;
    }
    .name {
        display: flex;
        align-items: center;
        justify-content: center;

        grid-row: 1 / 1;
        grid-column: 2 / 4;
    }
    .name span {
        background: var(--fg-color);
        padding: var(--sm-pad);
        border-radius: 8px;
    }
</style>
