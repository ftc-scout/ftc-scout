<script lang="ts" context="module">
    import { writable } from "svelte/store";
    import { fade, fly } from "svelte/transition";

    export let sidebarOpen = writable(true);
</script>

<div class="sidebar normal" />
{#if $sidebarOpen}
    <div
        aria-hidden="true"
        class="cover"
        on:click={() => ($sidebarOpen = false)}
        transition:fade={{ duration: 300 }}
    />
    <div class="sidebar small" transition:fly={{ duration: 300, x: -300, opacity: 1 }} />
{/if}

<style>
    .sidebar {
        position: fixed;
        left: 0;
        bottom: 0;
        width: var(--sidebar-size);

        background: var(--foreground-color);
        border-right: 1px solid var(--separator-color);
    }

    .normal {
        top: var(--navbar-size);
        z-index: var(--sidebar-zi);
    }

    .small {
        display: none;

        top: 0;
        z-index: var(--mobile-sidebar-zi);
    }

    .cover {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        z-index: var(--mobile-sidebar-bg-zi);
        background: var(--modal-background-color);

        display: none;
    }

    @media (max-width: 1600px) {
        .normal {
            display: none;
        }

        .small {
            display: block;
        }

        .cover {
            display: block;
        }
    }
</style>
