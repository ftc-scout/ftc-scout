<script lang="ts">
    import type { MatchScores2021Remote } from "../../../graphql/generated/graphql-operations";

    export let score: MatchScores2021Remote;
    export let teamNumber: number;
</script>

<tr>
    <td style="flex-grow: 1;" />
    <td class="header nz">Team {teamNumber} <br /> <b>{score.totalPoints}</b></td>
</tr>

<style>
    tr {
        width: 100%;
        display: flex;
        flex-direction: row;
    }

    .header {
        /* display: flex; */
        color: var(--color-team-text);
        text-align: center;
        padding-top: var(--small-padding);
        padding-bottom: var(--small-padding);
        width: 150px;
    }

    @media (max-width: 800px) {
        .header {
            width: 100px;
        }
    }

    .header b {
        font-weight: 900;
    }

    .header {
        background: var(--color-team-neutral);
    }

    td {
        padding: 8px;
        display: block;
    }
</style>
