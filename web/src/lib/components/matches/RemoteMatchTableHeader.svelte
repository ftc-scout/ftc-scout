<thead>
    <tr>
        <td class="team">Team</td>
        <td>Q-1</td>
        <td>Q-2</td>
        <td>Q-3</td>
        <td>Q-4</td>
        <td>Q-5</td>
        <td>Q-6</td>
        <td class="total">Total</td>
    </tr>
</thead>

<style>
    thead {
        display: block;
        width: 100%;
    }

    tr {
        display: grid;
        grid-template-columns: minmax(0, 3fr) repeat(7, minmax(0, 1fr));

        background-color: var(--color-team-neutral);
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;

        width: 100%;
        max-width: 100%;
        min-width: 100%;
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: minmax(0, 1.5fr) repeat(7, minmax(0, 1fr));
        }
    }

    .team {
        border-right: 2px solid lightgray;
    }

    .total {
        border-left: 2px solid lightgray;
    }

    td {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: var(--large-padding);

        color: white;

        font-weight: bold;

        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
    }
</style>
