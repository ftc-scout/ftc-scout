<script lang="ts" context="module">
    export type Scores2022 = Extract<
        FullMatchFragment["scores"],
        { __typename: "MatchScores2022" }
    >;
</script>

<script lang="ts">
    import type { FullMatchFragment } from "../../../../graphql/generated/graphql-operations";
    import Modal from "../../../Modal.svelte";

    export let shown = false;
    export let matchDescription: string;
    export let scores: Scores2022;

    let PowerPlayVis: any;

    async function load() {
        PowerPlayVis = (await import("./PowerPlayVis.svelte")).default;
    }

    $: shown && PowerPlayVis == undefined && load();

    let cones: "All Cones" | "Auto Cones" = "All Cones";
    $: layout = cones == "All Cones" ? scores.dcConeLayout : scores.autoConeLayout;
</script>

<Modal bind:shown titleText="Match {matchDescription} Cones">
    <form on:submit|preventDefault>
        <span>
            <input type="radio" bind:group={cones} id="auto" name="cones" value="Auto Cones" />
            <label for="auto">Auto Cones</label>
        </span>
        <span>
            <input type="radio" bind:group={cones} id="all" name="cones" value="All Cones" />
            <label for="all">All Cones</label>
        </span>
    </form>

    {#if PowerPlayVis}
        <svelte:component this={PowerPlayVis} {layout} />
    {:else}
        <div />
    {/if}
</Modal>

<style>
    form {
        display: flex;
        justify-content: center;
        gap: var(--xl-gap);
        align-items: center;
    }
    div {
        width: 1200px;
        max-width: calc(100vw - var(--lg-gap) * 4);
        max-height: calc(100vh - var(--lg-gap) * 20);
        aspect-ratio: 16 / 9;
        margin: auto;
        position: relative;
    }
</style>
