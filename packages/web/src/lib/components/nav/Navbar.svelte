<script>
    import DarkModeToggle from "./DarkModeToggle.svelte";
    import Hamburger from "./Hamburger.svelte";
    import Logo from "./Logo.svelte";
    import Searchbar from "./search/Searchbar.svelte";
    import UserMenu from "./UserMenu.svelte";
</script>

<nav>
    <div class="left">
        <Hamburger />
        <Logo />
    </div>

    <div class="right">
        <Searchbar />
        <UserMenu />
        <DarkModeToggle />
    </div>
</nav>

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--navbar-size);

        padding: var(--md-pad);

        background: var(--theme-color);
        z-index: var(--navbar-zi);

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .left {
        display: flex;
        align-items: center;
    }

    .right {
        display: flex;
        align-items: center;
        gap: calc(var(--lg-gap) * 1.75);
    }
</style>
