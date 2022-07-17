<script lang="ts">
    import type { MatchScores2021Traditional } from "../../../graphql/generated/graphql-operations";

    export let score: MatchScores2021Traditional;

    $: red = score.red;
    $: blue = score.blue;
</script>

<table colspan="3">
    <tr>
        <td />
        <td class="red-header nz">Red <br /> <b>{red.totalPoints}</b></td>
        <td class="blue-header nz">Blue <br /> <b>{blue.totalPoints}</b></td>
    </tr>
    <tr class="heading">
        <td class="name">Auto</td>
        <td class="data red" class:nz={red.autoPoints != 0}>{red.autoPoints}</td
        >
        <td class="data blue" class:nz={blue.autoPoints != 0}
            >{blue.autoPoints}</td
        >
    </tr>
    <tr class="normal-row">
        <td class="name">Freight Points</td>
        <td class="data red" class:nz={red.autoFreightPoints != 0}
            >{red.autoFreightPoints}</td
        >
        <td class="data blue" class:nz={blue.autoFreightPoints != 0}
            >{blue.autoFreightPoints}</td
        >
    </tr>
    <tr class="normal-row">
        <td class="name">Carousel Points</td>
        <td class="data red" class:nz={red.autoCarouselPoints != 0}
            >{red.autoCarouselPoints}</td
        >
        <td class="data blue" class:nz={blue.autoCarouselPoints != 0}
            >{blue.autoCarouselPoints}</td
        >
    </tr>
</table>

<style>
    * {
        /* We don't use the global vars becuase the modal should be fullsize even on phones */
        font-size: 16px;
    }

    table {
        border-collapse: collapse;
    }

    .red-header,
    .blue-header {
        /* display: flex; */
        color: var(--color-team-text);
        text-align: center;
        padding-top: var(--small-padding);
        padding-bottom: var(--small-padding);
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

    .heading {
        background: var(--zebra-stripe-color);
    }

    .name {
        padding-left: 8px;
        padding-right: 16px;
    }

    .heading .name {
        font-weight: bold;
    }

    .normal-row .name {
        padding-left: 24px;
    }

    .data {
        font-weight: bold;
        min-width: 100px;
        text-align: center;
    }

    td {
        padding: 8px;
    }

    .red {
        color: var(--color-team-red);
        background: var(--color-team-red-transparent);
    }

    .blue {
        color: var(--color-team-blue);
        background: var(--color-team-blue-transparent);
    }

    .data:not(.nz) {
        font-weight: normal;
        color: var(--grayed-out-text-color);
    }

    .heading .data:not(.nz) {
        font-weight: bold;
    }
</style>
