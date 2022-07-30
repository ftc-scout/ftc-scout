<script lang="ts" context="module">
    export function load({ fetch }: { fetch: NonNullable<HttpOptions["fetch"]> }) {
        return {
            props: {
                f: fetch,
            },
        };
    }
</script>

<script lang="ts">
    import { MeDocument, type MeQuery } from "../lib/graphql/generated/graphql-operations";
    import Navbar from "$lib/components/nav/Navbar.svelte";
    import { query, setClient, type ReadableQuery } from "svelte-apollo";
    import { getMyClient } from "../lib/graphql/client";
    import { writable, type Writable } from "svelte/store";
    import { setContext } from "svelte";
    import Sidebar from "../lib/components/nav/Sidebar.svelte";
    import type { HttpOptions } from "@apollo/client";

    export let f: NonNullable<HttpOptions["fetch"]>;
    setClient(getMyClient(f));

    export let me: ReadableQuery<MeQuery> = query(MeDocument);
    $: meData = $me?.data?.me;

    let meStore: Writable<MeQuery["me"] | null | undefined> = writable(undefined);
    $: $meStore = meData;

    setContext("me", meStore);
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

<Navbar />
<Sidebar />

<div class="content">
    <slot />
</div>

<style>
    @import "/static/css/colors.css";
    @import "/static/css/global.css";

    .content {
        margin-top: var(--navbar-size);
        margin-left: var(--sidebar-size);
        padding: var(--padding);
        padding-bottom: 80px; /* Make room on safari */

        overflow: auto;
        max-height: calc(100vh - var(--navbar-size));
        scrollbar-gutter: stable both-edges;
    }

    @media (max-width: 1600px) {
        .content {
            margin-left: 0;
        }
    }
</style>
