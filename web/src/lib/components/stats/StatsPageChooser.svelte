<script lang="ts" context="module">
    function pageOffsetUrl(currentUrl: URL, offset: number): string {
        let params = currentUrl.searchParams;
        let currPage = params.get("page");
        let newPage = +(currPage ?? 1) + offset;
        params.set("page", "" + newPage);
        let url = params.toString();

        if (currPage == null) {
            params.delete("page");
        } else {
            params.set("page", currPage);
        }

        return url;
    }
</script>

<script lang="ts">
    import { browser } from "$app/env";
    import { page } from "$app/stores";
    import { goto, prefetch } from "$app/navigation";
    import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let currentPage: number;
    export let totalCount: number;
    export let pageSize: number;

    $: totalPages = Math.ceil(totalCount / pageSize);
    let inputValue = currentPage;
    $: inputValue = currentPage;
    $: if (browser && +inputValue >= 1 && +inputValue <= totalPages) {
        let url = $page.url;
        let old = url.searchParams.get("page");
        url.searchParams.set("page", "" + inputValue);
        let urlString = url.toString();
        if (old) {
            url.searchParams.set("page", old);
        } else {
            url.searchParams.delete("page");
        }
        prefetch(urlString);
    }

    function go() {
        if (
            browser &&
            +inputValue >= 1 &&
            inputValue <= totalPages &&
            ($page.url.searchParams.get("page") ?? "1") != "" + inputValue
        ) {
            let url = $page.url;
            let old = url.searchParams.get("page");
            url.searchParams.set("page", "" + inputValue);
            let urlString = url.toString();
            if (old) {
                url.searchParams.set("page", old);
            } else {
                url.searchParams.delete("page");
            }
            goto(urlString);
        }
    }

    $: nextPageURL = pageOffsetUrl($page.url, 1);
    $: previousPageURL = pageOffsetUrl($page.url, -1);
</script>

<div class="wrapper">
    <a class="left" href="?{previousPageURL}" sveltekit:prefetch class:disabled={currentPage == 1}>
        <Fa icon={faArrowLeft} />
    </a>

    <span class="middle">
        <form on:submit|preventDefault={go} on:focusout={go}>
            <input type="number" min="1" max={totalPages} style:width="6ch" bind:value={inputValue} />
        </form>
        / {totalPages}
    </span>

    <a class="right" href="?{nextPageURL}" sveltekit:prefetch class:disabled={currentPage == totalPages}>
        <Fa icon={faArrowRight} />
    </a>
</div>

<style>
    .wrapper {
        border-radius: var(--pill-border-radius);
        margin: var(--large-gap);
        margin-bottom: var(--gap);
        width: fit-content;

        box-shadow: var(--shadow-color) 0px 2px 5px -1px, var(--shadow-color) 0px 1px 3px -1px;
    }

    a {
        display: inline-block;

        border: none;
        background: var(--theme-color);
        color: var(--theme-text-color);
        padding: var(--padding);

        cursor: pointer;
    }

    a:hover {
        filter: brightness(0.95);
    }

    a.disabled {
        pointer-events: none;
        filter: brightness(0.8);
        cursor: not-allowed;
    }

    a.left {
        border-top-left-radius: var(--pill-border-radius);
        border-bottom-left-radius: var(--pill-border-radius);
    }

    a.right {
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
