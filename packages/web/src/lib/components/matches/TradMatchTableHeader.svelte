<thead>
    <tr>
        <th class="s">
            <div>Match</div>
            <div>Score</div>
        </th><th class="r">Red Alliance</th>
        <th class="b">Blue Alliance</th>
    </tr>
</thead>

<style>
    thead {
        display: block;
    }

    tr {
        display: grid;
        grid-template-columns: 10.75em 1fr 1fr;
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 9.75em 1fr 1fr;
        }
    }

    th {
        display: block;
        font-weight: bold;
        text-align: center;
        padding: var(--lg-pad);
    }

    .s {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        justify-content: center;
        padding: 0;

        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
    }

    .s * {
        padding: var(--lg-pad);
    }

    .r {
        background-color: var(--red-team-color);
        color: var(--team-text-color);
    }

    .b {
        background-color: var(--blue-team-color);
        color: var(--team-text-color);

        border-top-right-radius: 7px;
    }
</style>
