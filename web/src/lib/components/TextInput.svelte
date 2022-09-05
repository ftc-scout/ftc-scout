<script lang="ts">
    import { faSearch } from "@fortawesome/free-solid-svg-icons";

    import Fa from "svelte-fa";

    export let value: string;

    export let search = false;
    export let style = "";
</script>

<div {style}>
    {#if search}
        <Fa icon={faSearch} fw />
    {/if}

    <input type="text" bind:value />
</div>

<style>
    div {
        display: flex;
        align-items: center;
        gap: var(--gap);

        background: var(--foreground-color);
        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
        border-radius: 8px;

        padding: var(--small-padding);
    }

    input {
        font: var(--main-font);

        background: var(--foreground-color);
        border: none;
        color: inherit;

        border-radius: 8px;

        height: 100%;
        width: max-content;
        flex-grow: 1;
    }

    input:focus,
    input:focus-visible {
        outline: none;
    }

    div:focus,
    div:focus-within {
        outline: var(--text-color) 2px solid;
    }
</style>
