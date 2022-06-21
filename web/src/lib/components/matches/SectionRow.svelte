<script lang="ts">
    import { TournamentLevel } from "../../graphql/generated/graphql-operations";

    export let level: TournamentLevel;
</script>

<thead>
    {#if level == TournamentLevel.Quals}
        Qualification Matches
    {:else if level == TournamentLevel.Semis}
        Semifinals
    {:else if level == TournamentLevel.Finals}
        Finals
    {/if}
</thead>

<style>
    thead {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        padding: var(--large-gap);

        font-weight: bold;
    }
</style>
