<script lang="ts">
    import { page } from "$app/stores";
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { sidebarOpen } from "./Sidebar.svelte";

    export let icon: IconDefinition;
    export let name: string;
    export let link: string;
    export let strict = false;
    export let newTab: boolean | null = null;

    $: active = strict ? $page.url.pathname == link : $page.url.pathname.startsWith(link);
</script>

<a
    href={link}
    class:active
    target={newTab ? "_blank" : null}
    rel={newTab ? "noreferrer" : null}
    on:click={() => ($sidebarOpen = false)}
>
    <Fa {icon} fw size="1.25x" />
    {name}
</a>

<style>
    a {
        margin-bottom: var(--lg-gap);
        padding: var(--lg-pad);
        font-size: 16px;

        border-radius: 8px;

        color: var(--secondary-text-color);

        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--lg-gap);
    }

    a:hover {
        background: var(--hover-color);
        text-decoration: none;
    }

    a.active {
        background: var(--theme-color);
        color: var(--theme-text-color);
        font-weight: bold;
    }
</style>
