<script lang="ts">
    import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let page: number;
    export let totalCount: number;
    export let pageSize: number;

    $: totalPages = Math.ceil(totalCount / pageSize);
    let inputValue = page;
    $: inputValue = page;
</script>

<div class="wrapper">
    <button
        class="left"
        on:click={() => {
            if (page != 1) page--;
        }}
        disabled={page == 1}
    >
        <Fa icon={faArrowLeft} />
    </button>

    <span class="middle">
        <form on:submit|preventDefault={() => (page = inputValue)} on:focusout={() => (page = inputValue)}>
            <input type="number" min="1" max={totalPages} style:width="6ch" bind:value={inputValue} />
        </form>
        / {totalPages}
    </span>

    <button
        class="right"
        on:click={() => {
            if (page != totalPages) page++;
        }}
        disabled={page == totalPages}
    >
        <Fa icon={faArrowRight} />
    </button>
</div>

<style>
    .wrapper {
        border-radius: var(--pill-border-radius);
        margin: var(--large-gap);
        margin-bottom: var(--gap);
        width: fit-content;

        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
    }

    button {
        border: none;
        background: var(--theme-color);
        color: var(--theme-text-color);
        padding: var(--padding);

        cursor: pointer;
    }

    button:hover {
        filter: brightness(0.95);
    }

    button:disabled {
        filter: brightness(0.8);
        cursor: not-allowed;
    }

    button.left {
        border-top-left-radius: var(--pill-border-radius);
        border-bottom-left-radius: var(--pill-border-radius);
    }

    button.right {
        border-top-right-radius: var(--pill-border-radius);
        border-bottom-right-radius: var(--pill-border-radius);
    }

    form {
        display: inline;
    }

    .middle {
        padding: var(--large-padding);
    }

    input {
        font: inherit;
    }
</style>
