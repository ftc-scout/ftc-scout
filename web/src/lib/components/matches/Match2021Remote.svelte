<script lang="ts">
    import type {
        EventPageMatchFragment,
        FullMatchScores2021RemoteFragment,
    } from "../../graphql/generated/graphql-operations";

    export let match: EventPageMatchFragment;
    export let scores: FullMatchScores2021RemoteFragment;
</script>

<tr>
    <td>{match.matchDescription}</td>
    <td>{scores.totalPoints}</td>
</tr>
