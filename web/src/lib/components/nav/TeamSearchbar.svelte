<script lang="ts">
    import { SearchDocument, type SearchQuery } from "$lib/graphql/generated/graphql-operations";
    import { query, type ReadableQuery } from "svelte-apollo";
    import { goto, prefetch } from "$app/navigation";
    import SkeletonRow from "../skeleton/SkeletonRow.svelte";
    import SearchbarInput from "./SearchbarInput.svelte";

    let searchText = "";

    let searchResults: ReadableQuery<SearchQuery> = query(SearchDocument, {
        variables: { searchText: searchText.trim() },
    });
    $: searchResults = query(SearchDocument, { variables: { searchText: searchText.trim() } });

    let teamsSearchData: SearchQuery["search"]["teams"];
    $: teamsSearchData = $searchResults.data?.search.teams ?? [];

    $: teamsSearchData.length && prefetch(`/teams/${teamsSearchData[0].team.number}`);
    $: !teamsSearchData.length;

    function tryGoto() {
        if (teamsSearchData.length) {
            goto(`/teams/${teamsSearchData[0].team.number}`);
            searchText = "";
        }
    }

    let barElement: HTMLElement | null = null;
    let teamElements: HTMLElement[] = [];
    $: elements = [barElement!, ...teamElements.filter((e) => e)];

    function handleType(e: KeyboardEvent) {
        let active = document.activeElement;
        if (!active) return;

        let focusNum = elements.indexOf(active as HTMLElement);
        if (focusNum == -1) return;

        if (e.key == "ArrowUp") {
            focusNum = Math.max(0, focusNum - 1);
            elements[focusNum].focus();
            e.preventDefault();
        } else if (e.key == "ArrowDown") {
            focusNum = Math.min(elements.length - 1, focusNum + 1);
            elements[focusNum].focus();
            e.preventDefault();
        }
    }

    let focusCount = 0;
    let barShown = false;

    $: if (focusCount == 0) barShown = false;

    $: showSearchResults = searchText && teamsSearchData.length && focusCount;
    $: showSkeleton = searchText && focusCount && $searchResults.loading;

    let resultElement: HTMLElement | null;
    let lastResultHeight: number | null = null;
    $: lastResultHeight = resultElement
        ? resultElement.clientHeight
        : teamsSearchData.length == 0 && !$searchResults.loading
        ? null
        : lastResultHeight;
</script>

<form autocomplete="off" on:submit|preventDefault={tryGoto}>
    <SearchbarInput
        bind:value={searchText}
        on:focus={() => focusCount++}
        on:focusout={() => setTimeout(() => focusCount--, 1)}
        on:keydown={handleType}
        bind:this_={barElement}
        bind:shown={barShown}
        {focusCount}
    />

    {#if showSearchResults}
        <div bind:this={resultElement} class="result" class:bar-shown={barShown}>
            <ol>
                {#each teamsSearchData as oneSearchRes, i}
                    {@const link = `/teams/${oneSearchRes.team.number}`}

                    <li>
                        <a
                            sveltekit:prefetch
                            href={link}
                            on:click={() => (searchText = "")}
                            on:focus={() => {
                                focusCount++;
                                prefetch(link);
                            }}
                            on:focusout={() => setTimeout(() => focusCount--, 1)}
                            on:keydown={handleType}
                            bind:this={teamElements[i]}
                            tabindex="0"
                        >
                            {@html oneSearchRes.highlighted}
                        </a>
                    </li>
                {/each}
            </ol>
        </div>
    {:else if showSkeleton && lastResultHeight}
        <div
            class="result"
            style:height={`${lastResultHeight}px`}
            style:max-height={`${lastResultHeight}px`}
            style:overflow="hidden"
            class:bar-shown={barShown}
        >
            <SkeletonRow rows={20} card={false} header={false} />
        </div>
    {/if}
</form>

<style>
    form {
        position: relative;
        height: 500px;
    }

    a:focus {
        outline: var(--text-color) 2px auto;
        background: var(--hover-color);
    }

    a:hover {
        background: var(--hover-color);
    }

    .result {
        position: absolute;
        top: 60px;

        background: var(--foreground-color);
        width: 50%;

        padding: var(--padding);
        border-radius: 8px;

        box-shadow: -2px 2px 10px 3px #e0e0e0;
    }

    @media (max-width: 850px) {
        .result {
            position: fixed;
            width: calc(100% - 2 * var(--gap));
            left: var(--gap);
            right: var(--gap);
        }

        .result:not(.bar-shown) {
            display: none;
        }
    }

    .result .header {
        margin-bottom: var(--small-gap);
        font-weight: bold;
        color: var(--secondary-text-color);
    }

    .result ol {
        padding: 0;
        margin: 0;
    }

    .result li {
        list-style: none;
        display: block;
        width: 100%;
    }

    .result a {
        display: block;
        width: 100%;
        height: 100%;

        color: inherit;

        padding: var(--padding);

        text-decoration: none;

        border-radius: 8px;
    }
</style>
