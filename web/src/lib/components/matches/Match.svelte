<script lang="ts">
    import type {
        EventPageMatchFragment,
        FullMatchScores2021RemoteFragment,
        FullMatchScores2021TraditionalFragment,
    } from "../../graphql/generated/graphql-operations";
    import Match2021Remote from "./Match2021Remote.svelte";
    import Match2021Trad from "./MatchTrad.svelte";

    export let match: EventPageMatchFragment;
    export let zebraStripe: boolean;

    let type:
        | "MatchScores2021Remote"
        | "MatchScores2021Traditional"
        | undefined;
    $: type = match.scores?.__typename;

    $: scores2021Trad = match.scores as FullMatchScores2021TraditionalFragment;
    $: scores2021Remote = match.scores as FullMatchScores2021RemoteFragment;
</script>

<tr class:zebra-stripe={zebraStripe}>
    {#if type == "MatchScores2021Traditional"}
        <Match2021Trad {match} scores={scores2021Trad} />
    {:else if type == "MatchScores2021Remote"}
        <Match2021Remote {match} scores={scores2021Remote} />
    {/if}
</tr>

<style>
    tr {
        display: table;
        width: 100%;
        max-width: 100%;
        min-width: 100%;
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }
</style>
