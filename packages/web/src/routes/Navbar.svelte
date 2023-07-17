<nav>
    <button on:click={() => document.body.classList.toggle("dark")}> Toggle Dark Mode </button>
</nav>

<style>
    nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: var(--navbar-size);

        background: var(--theme-color);
        border-bottom: 1px solid var(--separator-color);
        z-index: var(--navbar-zi);

        padding: var(--padding);

        display: flex;
        align-items: center;
        justify-content: right;
    }
</style>
