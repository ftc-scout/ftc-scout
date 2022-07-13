<script lang="ts">
    import {
        LogoutDocument,
        MeDocument,
    } from "$lib/graphql/generated/graphql-operations";
    import { mutation } from "svelte-apollo";

    export let meData: any; // TODO type

    const logoutMutation = mutation(LogoutDocument);
    const logout = async () =>
        await logoutMutation({ refetchQueries: [{ query: MeDocument }] });
    import { goto } from "$app/navigation";
    let searchValue = "";

</script>

<nav>
    <form autocomplete="off" on:submit|preventDefault={() => goto(`/teams/${searchValue}`)}>
        <input
        class="searchCSS"
            type="search"
            id ="searchInput"
            name="teamsearch"
            bind:value={searchValue}
            placeholder="Input team..."
        />
        <div id="result"></div>
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
