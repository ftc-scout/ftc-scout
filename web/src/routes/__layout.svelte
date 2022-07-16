<script context="module" lang="ts">
    // export let load = queryLoad("me", MeDocument, {});
</script>

<script lang="ts">
    import {
        MeDocument,
        type MeQuery,
    } from "../lib/graphql/generated/graphql-operations";
    import Navbar from "$lib/components/Navbar.svelte";
    import { query, setClient, type ReadableQuery } from "svelte-apollo";
    import { apolloClient } from "../lib/graphql/client";
    import { writable, type Writable } from "svelte/store";
    import { setContext } from "svelte";

    setClient(apolloClient);

    export let me: ReadableQuery<MeQuery> = query(MeDocument);
    $: meData = $me?.data?.me;

    let meStore: Writable<MeQuery["me"] | null> = writable(null);
    $: $meStore = meData;

    setContext("me", meStore);
</script>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<Navbar {meData} />

<div class="content">
    <slot />
</div>

<style>
    .content {
        margin-top: var(--navbar-size);
        padding: var(--padding);
    }

    :global(:root) {
        /* Colors */
        --background-color: #f2f2f2;
        --hover-color: #f9f9f9;
        --foreground-color: #ffffff;
        --theme-color: #2c666e;
        --darkened-theme-color: #225157;

        --text-color: #000000;
        --secondary-text-color: #636466;
        --theme-text-color: #ffffff;

        --inverse-background-color: #212121;
        --inverse-text-color: #ffffff;
        --inverse-secondary-text-color: #bdbdbd;

        --error-color: red;

        --shadow-color: #888888;

        /* Stolen from ftcscores <3 */
        --color-team-transparency: 0.15;
        --color-team-red: rgb(244, 67, 54);
        --color-team-red-darker: var(--paper-red-600);
        --color-team-red-transparent: rgba(
            244,
            67,
            54,
            var(--color-team-transparency)
        );
        --color-team-blue: rgb(33, 150, 243);
        --color-team-blue-darker: var(--paper-blue-600);
        --color-team-blue-transparent: rgba(
            33,
            150,
            243,
            var(--color-team-transparency)
        );
        --color-team-neutral: rgb(170, 0, 255);
        --color-team-text: white;
        --zebra-stripe-color: rgb(245, 245, 245);

        --modal-background-color: rgb(0, 0, 0);
        --modal-background-color: rgba(0, 0, 0, 0.4);

        /* Fonts */
        --main-font: "Inter", sans-serif;
        --small-font-size: 13px;
        --font-size: 16px;
        --large-font-size: 19px;
        --h2-font-size: 24px;
        --h1-font-size: 32px;

        /* Sizes */
        --navbar-size: 60px;

        --small-gap: 4px;
        --medium-hap: 6px;
        --gap: 8px;
        --large-gap: 12px;
        --vl-gap: 22px;
        --xl-gap: 32px;

        --small-padding: 4px;
        --ms-padding: 6px;
        --padding: 8px;
        --ml-padding: 10px;
        --large-padding: 12px;

        /* Utility */
        --pill-border-radius: 999999px; /* Using an overly large value produces a pill shape. */
    }

    @media (max-width: 800px) {
        :global(:root) {
            --small-font-size: 11px;
            --font-size: 14px;
            --large-font-size: 16px;
            --h2-font-size: 20px;
            --h1-font-size: 28px;

            /* Sizes */
            --navbar-size: 60px;

            --small-gap: 2px;
            --medium-hap: 4px;
            --gap: 6px;
            --large-gap: 10px;
            --vl-gap: 15px;
            --xl-gap: 20px;

            --small-padding: 2px;
            --ms-padding: 4px;
            --padding: 6px;
            --ml-padding: 8px;
            --large-padding: 10px;
        }
    }

    @media (max-width: 550px) {
        :global(:root) {
            --small-font-size: 8px;
            --font-size: 11px;
            --large-font-size: 13px;
            --h2-font-size: 18px;
            --h1-font-size: 22px;

            /* Sizes */
            --navbar-size: 60px;

            --small-gap: 2px;
            --medium-hap: 4px;
            --gap: 6px;
            --large-gap: 10px;
            --vl-gap: 15px;
            --xl-gap: 20px;

            --small-padding: 2px;
            --ms-padding: 4px;
            --padding: 6px;
            --ml-padding: 8px;
            --large-padding: 10px;
        }
    }

    :global(body) {
        background-color: var(--background-color);

        color: var(--text-color);
        font-size: var(--font-size);

        margin: 0;
    }

    :global(*) {
        box-sizing: border-box;
        font-family: var(--main-font);
    }

    :global(h1) {
        font-size: var(--h1-font-size);
        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
    }

    :global(h2) {
        font-size: var(--h2-font-size);
    }

    :global(a) {
        text-decoration: none;
    }

    :global(a:hover) {
        text-decoration: underline;
    }
</style>
