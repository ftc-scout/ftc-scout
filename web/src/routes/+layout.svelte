<script lang="ts">
    import type { LayoutData } from "./$types";
    import Navbar from "$lib/components/nav/Navbar.svelte";
    import { setClient } from "svelte-apollo";
    import { getMyClient } from "../lib/graphql/client";
    import Sidebar from "../lib/components/nav/Sidebar.svelte";
    import type { HttpOptions } from "@apollo/client";
    import { page } from "$app/stores";
    import { keyPathName } from "../lib/util/key-pathname";
    import Analytics from "../lib/components/Analytics.svelte";

    export let data: LayoutData;
    let f: NonNullable<HttpOptions["fetch"]>;
    $: ({ f } = data);

    setClient(getMyClient(f));
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />

    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2c666e" />
    <meta name="msapplication-TileColor" content="#2c666e" />
    <meta name="theme-color" content="#ffffff" />
</svelte:head>

<Analytics />

<Navbar />
<Sidebar />

{#key keyPathName($page.url.pathname)}
    <div id="content">
        <slot />
    </div>
{/key}

<style>
    @import "/static/css/colors.css";
    @import "/static/css/global.css";

    #content {
        margin-top: var(--navbar-size);
        margin-left: var(--sidebar-size);
        padding: var(--padding);
        padding-bottom: 80px; /* Make room on safari */

        overflow: auto;
        max-height: calc(100vh - var(--navbar-size));
        scrollbar-gutter: stable both-edges;
    }

    @media (max-width: 1600px) {
        #content {
            margin-left: 0;
        }
    }
</style>
