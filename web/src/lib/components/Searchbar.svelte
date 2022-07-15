<script lang="ts">
    import {
        SearchDocument,
        type SearchQuery,
    } from "$lib/graphql/generated/graphql-operations";
    import { query } from "svelte-apollo";
    import { goto, prefetch } from "$app/navigation";

    let searchText = "";

    let searchResults = query(SearchDocument, { variables: { searchText } });
    $: searchResults.refetch({ searchText });

    let searchData: SearchQuery["search"] | undefined;
    $: searchData = ($searchResults.data as any)?.search as any;

    $: searchData &&
        searchData.length &&
        prefetch(`/teams/${searchData[0].team.number}`);

    function tryGoto() {
        if (searchData && searchData.length) {
            goto(`/teams/${searchData[0].team.number}`);
            searchText = "";
        }
    }

    let elements: HTMLElement[] = [];

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
            focusNum = Math.min(
                elements.filter((e) => e).length - 1,
                focusNum + 1
            );
            elements[focusNum].focus();
            e.preventDefault();
        }
    }

    let focusCount = 0;

    $: showSearchResults =
        searchText && searchData && searchData.length && focusCount;
</script>

<form autocomplete="off" on:submit|preventDefault={tryGoto}>
    <input
        class="searchCSS"
        type="search"
        id="searchInput"
        name="teamsearch"
        bind:value={searchText}
        placeholder="Input team..."
        on:focus={() => focusCount++}
        on:focusout={() => setTimeout(() => focusCount--, 1)}
        on:keydown={handleType}
        bind:this={elements[0]}
        tabindex="0"
    />
    {#if showSearchResults && searchData}
        <div class="result">
            <div class="header">Teams</div>
            <ol>
                {#each searchData as oneSearchRes, i}
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
                            on:focusout={() =>
                                setTimeout(() => focusCount--, 1)}
                            on:keydown={handleType}
                            bind:this={elements[i + 1]}
                            tabindex="0"
                        >
                            {@html oneSearchRes.highlighted}
                        </a>
                    </li>
                {/each}
            </ol>
        </div>
    {/if}
</form>

<style>
    form {
        position: relative;
    }

    input:focus,
    a:focus {
        outline: var(--text-color) 2px auto;
    }

    .result {
        position: absolute;
        top: 60px;

        background: var(--foreground-color);
        width: 100%;

        padding: var(--padding);
        border-radius: 8px;

        box-shadow: -2px 2px 10px 3px #e0e0e0;
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
    }

    .result li:hover {
        background: var(--hover-color);
    }

    .searchCSS {
        border: 1px solid transparent;
        background-color: #f1f1f1;
        padding: 9px;
        font-size: 18px;
        border-radius: var(--pill-border-radius);
    }
</style>
