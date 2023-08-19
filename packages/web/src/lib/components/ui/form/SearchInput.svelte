<script lang="ts">
    import { faSearch, faXmark } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let value: string;
    export let placeholder = "Search";
    export let name: string | null = null;
    export let id: string | null = null;
</script>

<div>
    <span class="glass">
        <Fa icon={faSearch} />
    </span>

    <input type="search" autocomplete="off" {placeholder} {name} {id} bind:value />

    <button on:mousedown|preventDefault on:click={() => (value = "")}>
        <Fa icon={faXmark} />
    </button>
</div>

<style>
    div {
        flex-grow: 1;
        position: relative;
    }

    div :global(.glass) {
        position: absolute;
        left: var(--md-gap);
        top: 0;
        bottom: 0;

        pointer-events: none;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    button {
        position: absolute;
        right: var(--md-gap);
        top: 0;
        bottom: 0;

        border: none;
        background: none;
        font-size: inherit;
        font-family: inherit;

        cursor: pointer;

        display: none;
    }

    input:focus:not(:placeholder-shown) + button,
    input:hover:not(:placeholder-shown) + button,
    input:not(:placeholder-shown) + button:hover,
    input:not(:placeholder-shown) + button:focus-visible {
        display: block;
    }

    input {
        width: 100%;

        padding-left: var(--xl-gap);
    }

    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        display: none;
    }
</style>
