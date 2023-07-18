<script lang="ts">
    import Fa from "svelte-fa";
    import { faBars } from "@fortawesome/free-solid-svg-icons";
    import { sidebarOpen } from "./Sidebar.svelte";

    function click() {
        $sidebarOpen = !$sidebarOpen;
    }
</script>

<div class="wrapper" aria-hidden="true">
    <button class="hamburger-button" on:click={click} aria-expanded="true">
        <Fa icon={faBars} fw size="1.75x" />
    </button>
</div>

<style>
    .wrapper {
        width: calc(var(--navbar-size) - 2 * var(--md-pad));
        height: var(--navbar-size);

        display: flex;
        align-items: center;
        justify-content: center;
    }

    button {
        border: none;
        background: none;
        color: var(--theme-text-color);

        cursor: pointer;

        aspect-ratio: 1 / 1;
        padding: var(--sm-pad);
        border-radius: var(--pill-border-radius);
    }

    button:hover {
        background: rgba(0, 0, 0, 0.2);
    }

    @media (min-width: 1600px) {
        .wrapper {
            display: none;
        }
    }
</style>
