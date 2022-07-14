<script lang="ts">
    import {
        LogoutDocument,
        MeDocument,
        SearchDocument,
        type SearchQuery,
    } from "$lib/graphql/generated/graphql-operations";
    import { mutation, query } from "svelte-apollo";
    import { goto } from "$app/navigation";

    export let meData: any; // TODO type

    const logoutMutation = mutation(LogoutDocument);
    const logout = async () =>
        await logoutMutation({ refetchQueries: [{ query: MeDocument }] });
    let searchText = "";

    let searchResults = query(SearchDocument, { variables: { searchText } });
    $: searchResults.refetch({ searchText });

    let searchData: SearchQuery["search"] | undefined;
    $: searchData = ($searchResults.data as any)?.search as any;

    function tryGoto() {
        if (searchData && searchData.length) {
            goto(`/teams/${searchData[0].team.number}`);
            searchText = "";
        }
    }
</script>

<nav>
    <form autocomplete="off" on:submit|preventDefault={tryGoto}>
        <input
            class="searchCSS"
            type="search"
            id="searchInput"
            name="teamsearch"
            bind:value={searchText}
            placeholder="Input team..."
        />
        {#if searchText && searchData && searchData.length}
            <div class="result">
                <div class="header">Teams</div>
                <ol>
                    {#each searchData as oneSearchRes}
                        <li>
                            <a
                                sveltekit:prefetch
                                href={`/teams/${oneSearchRes.team.number}`}
                                on:click={() => (searchText = "")}
                            >
                                {@html oneSearchRes.highlighted}
                            </a>
                        </li>
                    {/each}
                    <!-- <li><a href="/teams/16321">16321 X Drive</a></li>
                    <li><a href="/teams/16321">16321 X Drive</a></li>
                    <li><a href="/teams/16321">16321 X Drive</a></li> -->
                </ol>
            </div>
        {/if}
    </form>
    {#if meData}
        <button class="login-button" on:click={logout}>Log Out</button>
        <p>{meData.username}</p>
    {:else}
        <a class="login-button" href="/login">Log In</a>
        <a class="login-button" href="/register">Register</a>
    {/if}
</nav>

<style>
    form {
        position: relative;
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

    nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: right;

        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--navbar-size);

        padding: var(--padding);

        background-color: var(--foreground-color);

        box-shadow: 0 4px 4px -4px var(--shadow-color);

        z-index: 10;
    }

    .login-button {
        border: var(--theme-color) 2px solid;
        text-decoration: none;

        background-color: transparent;
        color: var(--theme-color);
        font-weight: bold;
        font-size: var(--small-font-size);
        padding: var(--padding) var(--ml-padding);
        margin: 0 var(--small-gap);
        border-radius: var(--pill-border-radius);

        display: inline-block;

        cursor: pointer;
    }

    .login-button:hover {
        /* border: var(--darkened-theme-color) 2px solid; */
        background-color: var(--theme-color);
        color: var(--theme-text-color);
    }

    p {
        font-size: 15px;
        margin-left: var(--large-gap);
    }
</style>
