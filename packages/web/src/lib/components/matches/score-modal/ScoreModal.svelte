<script lang="ts">
    import type { FullMatchFragment } from "../../../graphql/generated/graphql-operations";
    import Modal from "../../Modal.svelte";
    import type { RemoteScoresTy, TradScoresTy } from "../MatchScore.svelte";
    import RemoteScores from "./RemoteScores.svelte";
    import TradScores from "./TradScores.svelte";

    export let shown = false;
    export let match: FullMatchFragment | null = null;

    $: scores = match?.scores;

    $: trad = scores != null && "red" in scores ? (scores as TradScoresTy) : null;
    $: remote = scores != null && !("red" in scores) ? (scores as RemoteScoresTy) : null;
</script>

{#if match && scores}
    <Modal bind:shown titleText="Match {match.description}">
        {#if trad}
            <TradScores scores={trad} />
        {:else if remote}
            <RemoteScores scores={remote} teamNumber={match.teams[0].teamNumber} />
        {/if}
    </Modal>
{/if}
