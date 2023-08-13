<script lang="ts">
    import { page } from "$app/stores";
    import { sidebarOpen } from "./sidebar";
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";

    export let icon: IconDefinition;
    export let newTab: boolean | null = null;
    export let href: string | null = null;

    $: topLevel = href?.split("/").find((s) => s != "");
    $: active =
        href == null
            ? false
            : topLevel == null
            ? $page.url.pathname == "/"
            : $page.url.pathname.startsWith("/" + topLevel);
</script>

{#if href}
    <a
        class="wrap"
        target={newTab ? "_blank" : null}
        rel={newTab ? "noreferrer" : null}
        {href}
        class:active
        sveltekit:prefetch={href?.startsWith("/") ? true : null}
        on:click={() => ($sidebarOpen = false)}
    >
        <Fa {icon} fw size="1.25x" />
        <div class="name">
            <slot />
        </div>
    </a>
{:else}
    <div class="wrap" {href}>
        <Fa {icon} fw size="1.25x" />
        <div class="name">
            <slot />
        </div>
    </div>
{/if}

<style>
    .wrap {
        margin-bottom: var(--large-gap);

        display: flex;
        flex-direction: row;
        align-items: center;

        padding: var(--large-padding);
        border-radius: 8px;

        cursor: pointer;

        color: var(--secondary-text-color);
        font-size: 16px;
    }

    .wrap:hover {
        background: var(--hover-color);
        text-decoration: none;
    }

    .wrap.active {
        color: var(--theme-text-color);
        font-weight: bold;
        background: var(--theme-color);
    }

    .name {
        margin-left: var(--large-gap);
    }
</style>
