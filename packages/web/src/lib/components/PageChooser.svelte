<script lang="ts">
    import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { queryParamUrl } from "../util/search-params/search-params";
    import { PAGE_EC_DC } from "../util/search-params/int";

    export let page: number;
    export let totalPageCount: number;

    let inputVal = page;
    $: inputVal = page;

    function constrain(p: number): number {
        return Math.max(Math.min(p, totalPageCount), 1);
    }

    $: previousPage = constrain(page - 1);
    $: nextPage = constrain(page + 1);

    $: previousUrl = queryParamUrl("page", PAGE_EC_DC, previousPage);
    $: nextUrl = queryParamUrl("page", PAGE_EC_DC, nextPage);
</script>

<form class="wrap" on:submit|preventDefault>
    <a
        class="left"
        href={$previousUrl}
        class:disabled={page == 1}
        aria-disabled={page == 1}
        on:click|preventDefault={() => (page = previousPage)}
        aria-label="Previous Page"
    >
        <Fa icon={faArrowLeft} />
    </a>
    <div class="count">
        <input
            class="non-form"
            type="number"
            bind:value={inputVal}
            min="1"
            max={totalPageCount}
            on:focusout={() => (page = constrain(inputVal))}
            on:keypress={(e) => {
                if (e.code == "Enter") page = constrain(inputVal);
            }}
        />
        <span>/ {totalPageCount}</span>
    </div>
    <a
        class="right"
        href={$nextUrl}
        class:disabled={page == totalPageCount}
        aria-disabled={page == totalPageCount}
        on:click|preventDefault={() => (page = nextPage)}
        aria-label="Next Page"
    >
        <Fa icon={faArrowRight} />
    </a>
</form>

<style>
    .wrap {
        display: flex;
        gap: 0;
    }

    a {
        border: none;
        background: none;
        font-size: inherit;
        font-family: inherit;

        background: var(--theme-color);
        color: var(--theme-text-color);
        padding: var(--md-pad);
        cursor: pointer;
    }

    a.disabled {
        opacity: var(--form-disabled-opacity);
        cursor: not-allowed;
    }

    .left {
        border-top-left-radius: var(--pill-border-radius);
        border-bottom-left-radius: var(--pill-border-radius);
    }

    .right {
        border-top-right-radius: var(--pill-border-radius);
        border-bottom-right-radius: var(--pill-border-radius);
    }

    .count {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--md-gap);
        padding-right: var(--md-pad);

        border-top: 1px solid var(--sep-color);
        border-bottom: 1px solid var(--sep-color);
    }

    input {
        border-radius: 0;
        padding: 0;
        background: none;
        border: none;

        width: 7ch;
        height: 100%;
        padding: var(--sm-gap);
        padding-left: var(--md-gap);

        border-left: 1px solid var(--sep-color);
        border-right: 1px solid var(--sep-color);
    }
</style>
