<script lang="ts" context="module">
    export let FORM_ID = {};
</script>

<script lang="ts">
    import { setContext } from "svelte";

    export let noscriptSubmit = false;
    export let style: "row" | "col" = "row";
    export let id: string | null;

    $: setContext(FORM_ID, id);
</script>

<form class:row={style == "row"} class:col={style == "col"} {id} on:submit|preventDefault>
    <slot />

    {#if noscriptSubmit}
        <noscript> <input type="submit" /> </noscript>
    {/if}
</form>

<style>
    .row {
        display: flex;
        flex-direction: row;
        gap: var(--md-gap);
    }

    .col {
        display: flex;
        flex-direction: column;
        gap: var(--md-gap);
    }
</style>
