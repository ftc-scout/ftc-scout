<script lang="ts">
    export let name: string;
    export let id: string;
</script>

<tr>
    <td />
    <td class="red" />
    <td class="blue" />
    <th class="name" {id}> <span>{name}</span> </th>
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

    td,
    th {
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
        font-weight: normal;
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
