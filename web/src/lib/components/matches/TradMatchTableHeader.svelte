<thead>
    <td class="m">Match</td><td class="s">Score</td><td class="r">Red Alliance</td><td class="b">Blue Alliance</td>
</thead>

<style>
    .m {
        width: 4.5em;
        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
    }

    .s {
        width: 6.25em;
        box-shadow: rgb(0 0 0 / 14%) 0px -4px 4px -2px inset;
    }

    .r {
        width: calc((100% - 10.75em) / 2);
        background-color: var(--color-team-red);
        color: white;
    }

    .b {
        width: calc((100% - 10.75em) / 2);
        background-color: var(--color-team-blue);
        color: white;

        border-top-right-radius: 7px;
    }

    thead {
        display: table;
        width: 100%;
        max-width: 100%;
        min-width: 100%;
    }

    td {
        display: inline-block;
        font-weight: bold;
        text-align: center;
        padding: var(--large-padding);
    }
</style>
