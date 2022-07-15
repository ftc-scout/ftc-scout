<thead>
    <tr>
        <td class="team">Team</td>
        <td class="q">Q-1</td>
        <td class="q">Q-2</td>
        <td class="q">Q-3</td>
        <td class="q">Q-4</td>
        <td class="q">Q-5</td>
        <td class="q">Q-6</td>
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
        border-top-left-radius: 7.3px;
        border-top-right-radius: 7.3px;

        width: 100%;
        max-width: 100%;
        min-width: 100%;
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

    @media (max-width: 550px) {
        .q {
            font-size: var(--small-font-size);
        }
    }
</style>
