<script lang="ts">
    import { TournamentLevel } from "../../graphql/generated/graphql-operations";

    export let level: TournamentLevel;
</script>

<tr>
    <td class="red-block" />
    <td class="blue-block" />

    <td class="centerer">
        <span>
            {#if level == TournamentLevel.Quals}
                Qualification Matches
            {:else if level == TournamentLevel.Semis}
                Semifinals
            {:else if level == TournamentLevel.Finals}
                Finals
            {/if}
        </span>
    </td>
</tr>

<style>
    tr {
        width: 100%;
        position: relative;
        height: calc(var(--xl-gap) * 1.5);
        display: table;
    }

    td {
        display: block;
    }

    .centerer {
        position: absolute;
        left: 10.75em;
        right: 0;

        height: calc(var(--xl-gap) * 1.5);

        display: flex;
        align-items: center;
        justify-content: center;

        font-weight: bold;
    }

    span {
        background-color: white;
        padding: var(--small-padding);
        border-radius: 8px;
    }

    .red-block {
        position: absolute;
        left: 10.75em;
        width: calc((100% - 10.75em) / 2);
        height: 100%;
        background-color: var(--color-team-red-transparent);
    }

    .blue-block {
        position: absolute;
        left: calc(10.75em + (100% - 10.75em) / 2);
        width: calc((100% - 10.75em) / 2);
        height: 100%;
        background-color: var(--color-team-blue-transparent);
    }
</style>
