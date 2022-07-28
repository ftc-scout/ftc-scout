<script lang="ts">
    import Fa from "svelte-fa";
    import { faBars } from "@fortawesome/free-solid-svg-icons";
    import { sidebarOpen } from "./sidebar";

    function click() {
        $sidebarOpen = !$sidebarOpen;
    }
</script>

<div class="wrapper">
    <button class="hamburger-button" on:click={click}>
        <Fa icon={faBars} fw size="1.75x" />
    </button>
</div>

<style>
    .wrapper {
        position: fixed;
        left: 0;
        top: 0;
        width: var(--navbar-size);
        height: var(--navbar-size);

        display: flex;
        align-items: center;
        justify-content: left;
    }

    .hamburger-button {
        margin-left: var(--large-gap);

        background: var(--foreground-color);
        border: none;
        color: var(--theme-color);
        float: left;

        cursor: pointer;

        padding: var(--small-padding);
        border-radius: var(--pill-border-radius);
    }

    .hamburger-button:hover {
        filter: brightness(0.95);
    }

    .hamburger-button:active {
        filter: brightness(0.9);
    }

    @media (min-width: 1600px) {
        .hamburger-button {
            display: none;
        }
    }
</style>
