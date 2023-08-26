<thead>
    <tr>
        <th class="team">Team</th>
        <th>Q-1</th>
        <th>Q-2</th>
        <th>Q-3</th>
        <th>Q-4</th>
        <th>Q-5</th>
        <th>Q-6</th>
        <th class="total">Total</th>
    </tr>
</thead>

<style>
    thead {
        display: block;
        width: 100%;
    }

    tr {
        display: grid;
        grid-template-columns: 17em repeat(7, minmax(0, 1fr));

        background-color: var(--neutral-team-color);
        border-top-left-radius: 7px;
        border-top-right-radius: 7px;

        width: 100%;
        max-width: 100%;
        min-width: 100%;
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 5em repeat(7, minmax(0, 1fr));
        }
    }

    tr :nth-child(2) {
        border-left: 2px solid var(--sep-color);
    }

    .total {
        border-left: 2px solid var(--sep-color);
    }

    th {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: var(--lg-pad);

        color: white;

        font-weight: bold;

        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
    }
</style>
