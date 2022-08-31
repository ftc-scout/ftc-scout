<script lang="ts">
    import Logo from "./Logo.svelte";
    import HamburgerButton from "./HamburgerButton.svelte";
    import Searchbar from "./Searchbar.svelte";
    import { keyPathName } from "../../util/key-pathname";
    import { page } from "$app/stores";
</script>

<nav>
    <HamburgerButton />

    <Logo />

    <div class="placeholder" />

    {#key keyPathName($page.url.pathname)}
        <Searchbar />
    {/key}
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

        background-color: var(--theme-color);
    }
</style>
