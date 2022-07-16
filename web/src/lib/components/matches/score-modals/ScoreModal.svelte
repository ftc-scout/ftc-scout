<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import type { EventPageMatchFragment } from "../../../graphql/generated/graphql-operations";

    export let matchScores: EventPageMatchFragment | null = null;
    export let shown = false;
</script>

{#if matchScores}
    <Modal bind:shown>
        <h1>Match {matchScores.matchDescription}</h1>
    </Modal>
{/if}
