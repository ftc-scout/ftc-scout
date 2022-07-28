<script lang="ts">
    import HamburgerButton from "./HamburgerButton.svelte";

    import Searchbar from "./Searchbar.svelte";
</script>

<nav>
    <HamburgerButton />

    <div class="placeholder" />

    <Searchbar />
</nav>

<style>
    nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--navbar-size);

        padding: var(--padding);

        background-color: var(--foreground-color);

        box-shadow: 0 4px 4px -4px var(--shadow-color);

        z-index: 1000;
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
