<script lang="ts">
    import { faSearch } from "@fortawesome/free-solid-svg-icons";
    import { createEventDispatcher } from "svelte";
    import Fa from "svelte-fa";
    import { CLOSE_ICON } from "../../icons";

    export let value: string;
    export let this_: HTMLElement | null = null;
    export let shown = false;
    export let focusCount = 0;

    let dispatcher = createEventDispatcher();

    function focus() {
        document.getElementById("searchbar-input")?.focus();
    }

    $: if (shown) focus();
</script>

<div class="wrapper" class:shown class:focus={focusCount}>
    <button class="search-button" type="submit" aria-label="Search"><Fa icon={faSearch} /></button>
    <input
        id="searchbar-input"
        type="search"
        placeholder="Search for teams and events"
        bind:value
        on:focus
        on:focusout={() => {
            // shown = false;
            dispatcher("focusout");
        }}
        on:keydown
        bind:this={this_}
        tabindex="0"
    />
    <button class="close" on:click|preventDefault={() => (shown = false)}>
        <Fa icon={CLOSE_ICON} size="1.25x" />
    </button>
</div>

<button
    class="only-icon"
    on:click|preventDefault={() => {
        shown = !shown;
        setTimeout(() => this_?.focus(), 1);
    }}
    aria-label="Search"
>
    <Fa icon={faSearch} size="1.25x" />
</button>

<style>
    .wrapper {
        display: flex;
        align-items: center;

        border: transparent 2px solid;
        /* transition: border 300ms; */

        background-color: var(--background-color);
        font-size: 18px;
        border-radius: 8px;

        width: 350px;
        transition: width 300ms, border 300ms;
        position: relative;
    }

    .search-button {
        background-color: transparent;
        border: 0px solid;
        size: 50px;

        padding: var(--padding);
    }

    .only-icon {
        display: none;
        color: var(--theme-text-color);
        padding: var(--padding);
        padding-right: 0;
        margin-right: 12px;

        cursor: pointer;
        background: none;
        border: none;
    }

    .close {
        background: none;
        border: none;
        cursor: pointer;
        display: none;

        /* padding: var(--padding); */
        margin-right: var(--gap);
    }

    input {
        border: none;
        margin: 0;
        background: none;
        font-size: inherit;
        flex-grow: 1;

        padding: var(--padding);
    }

    input:focus,
    input:focus-visible {
        outline: none;
        background: none;
    }

    .wrapper:focus-within,
    .wrapper.focus {
        border: var(--text-color) 2px solid;
        width: 600px;
    }

    @media (max-width: 850px) {
        .wrapper:not(.shown):not(.focus) {
            display: none;
        }

        .wrapper {
            position: fixed;
            width: calc(100% - 2 * var(--gap));
            height: 41px;

            top: 8px;
            left: var(--gap);
            right: var(--gap);

            z-index: 2000;
        }

        .wrapper:focus-within,
        .wrapper.focus {
            width: calc(100% - 2 * var(--gap));
        }

        .close {
            display: block;
        }

        .only-icon {
            display: block;
        }
    }

    /* clears the ‘X’ from Internet Explorer */
    input[type="search"]::-ms-clear {
        display: none;
        width: 0;
        height: 0;
    }
    input[type="search"]::-ms-reveal {
        display: none;
        width: 0;
        height: 0;
    }
    /* clears the ‘X’ from Chrome */
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration {
        display: none;
    }
</style>
