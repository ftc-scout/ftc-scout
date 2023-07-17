<script lang="ts">
    import Navbar from "./Navbar.svelte";
    import { browser } from "$app/environment";
    import Sidebar from "./Sidebar.svelte";

    import "@fontsource/inter";
    import "@fontsource/inter/700.css";

    if (browser) {
        // Svelte uses window.scrollTo to emulate the scroll resetting when navigation. However we
        // have overflow hidden on the body (so the scrollbar is under the navbar). Therefore
        // instead of scrolling the window we scroll the content div.
        // This is pretty hacky but seems to work.
        window.scrollTo = (x: any, y?: any) => document.getElementById("content")?.scrollTo(x, y);
    }
</script>

<Navbar />
<Sidebar />

<!-- Autofocus allows the document to be scrolled immediately without having to click. -->
<!-- svelte-ignore a11y-autofocus -->
<div id="content" tabindex="-1" autofocus>
    <slot />
</div>

<style>
    @import "/static/css/global.css";

    #content {
        margin-top: var(--navbar-size);
        margin-left: var(--sidebar-size);
        padding: var(--padding);
        padding-bottom: 80px;

        overflow: auto;
        max-height: calc(100vh - var(--navbar-size));
        scrollbar-gutter: stable both-edges;
    }

    @media (max-width: 1600px) {
        #content {
            margin-left: 0;
        }
    }

    #content:focus,
    #content:focus-visible {
        outline: none;
    }

    :global(body) {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        position: fixed;
        overflow: hidden;

        background: var(--background-color);

        font-family: "Inter", sans-serif;
        font-size: 16px;
    }
</style>
