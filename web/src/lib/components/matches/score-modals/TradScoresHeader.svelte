<script lang="ts">
    export let score: {
        red: { totalPoints: number };
        blue: { totalPoints: number };
    };

    $: red = score.red;
    $: blue = score.blue;
</script>

<tr>
    <td style="flex-grow: 1;" />
    <td class="red-header nz">Red <br /> <b>{red.totalPoints}</b></td>
    <td class="blue-header nz">Blue <br /> <b>{blue.totalPoints}</b></td>
</tr>

<style>
    tr {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .red-header,
    .blue-header {
        /* display: flex; */
        color: var(--color-team-text);
        text-align: center;
        padding-top: var(--small-padding);
        padding-bottom: var(--small-padding);
        width: 100px;
    }

    @media (max-width: 800px) {
        .red-header,
        .blue-header {
            width: 80px;
        }
    }

    .red-header b,
    .blue-header b {
        font-weight: 900;
    }

    .red-header {
        background: var(--color-team-red);
    }

    .blue-header {
        background: var(--color-team-blue);
    }

    td {
        padding: 8px;
        display: block;
    }
</style>
