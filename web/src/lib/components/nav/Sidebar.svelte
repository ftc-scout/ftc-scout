<script lang="ts">
    import { sidebarOpen } from "./sidebar";
    import { fly, fade } from "svelte/transition";
    import SidebarContent from "./SidebarContent.svelte";
</script>

<div class="sidebar normal"><SidebarContent /></div>
{#if $sidebarOpen}
    <div class="background-cover" on:click={() => ($sidebarOpen = false)} transition:fade={{ duration: 400 }} />
    <div class="sidebar small" transition:fly={{ duration: 400, x: -300, opacity: 1 }}><SidebarContent /></div>
{/if}

<style>
    .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        width: var(--sidebar-size);

        background: var(--foreground-color);

        margin-top: var(--navbar-size);

        padding: var(--padding);

        box-shadow: 4px 0 4px -4px var(--shadow-color);

        z-index: 500;
    }

    .background-cover {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: var(--modal-background-color);
        z-index: 1400;
    }

    .sidebar.small {
        display: none;
        z-index: 1500;
        margin-top: 0;
    }

    @media (max-width: 1600px) {
        .sidebar.normal {
            display: none;
        }

        .sidebar.small {
            display: block;
        }
    }
</style>
