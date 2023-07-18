<script>
    import Hamburger from "./Hamburger.svelte";
    import Logo from "./Logo.svelte";
</script>

<nav>
    <div class="left">
        <Hamburger />
        <Logo />
    </div>

    <button on:click={() => document.body.classList.toggle("dark")}> Toggle Dark Mode </button>
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
        border-bottom: 1px solid var(--sep-color);
        z-index: var(--navbar-zi);

        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .left {
        display: flex;
        align-items: center;
    }
</style>
