<script lang="ts">
    import Modal from "$lib/components/Modal.svelte";
    import { faXmark } from "@fortawesome/free-solid-svg-icons";
    import type { EventPageMatchFragment } from "../../../graphql/generated/graphql-operations";
    import ScoreTrad2021 from "./ScoreTrad2021.svelte";
    import Fa from "svelte-fa";

    export let matchScores: EventPageMatchFragment | null = null;
    export let shown = false;
</script>

{#if matchScores}
    <Modal bind:shown>
        <b>
            <span>Match {matchScores.matchDescription}</span>
            <button
                on:click={() => {
                    shown = false;
                }}
            >
                <Fa icon={faXmark} size="1.5x" />
            </button>
        </b>

        {#if matchScores.scores?.__typename == "MatchScores2021Traditional"}
            <ScoreTrad2021 score={matchScores.scores} />
        {/if}
    </Modal>
{/if}

<style>
    b {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--h2-font-size);
        margin-bottom: var(--large-gap);
    }

    button {
        background: none;
        border: none;

        cursor: pointer;
    }
</style>
