<script context="module" lang="ts">
    export let load = queryLoad("me", MeDocument, {});
</script>

<script lang="ts">
    import { get, type Readable, type Writable } from "svelte/store";
    import { queryLoad } from "../lib/graphql/query-load";
    import {
        MeDocument,
        type MeQuery,
    } from "../lib/graphql/generated/graphql-operations";
    import Navbar from "$lib/components/Navbar.svelte";
    import type { ApolloQueryResult } from "@apollo/client";
    import { setClient } from "svelte-apollo";
    import { apolloClient } from "../lib/graphql/client";

    setClient(apolloClient);

    export let me: ApolloQueryResult<MeQuery>;
    $: meData = me.data.me;
</script>

<Navbar {meData} />

<div class="content">
    <slot />
</div>

<style>
    @import "@fontsource/inter/400.css";
    @import "@fontsource/inter/600.css";

    .content {
        margin-top: var(--navbar-size);
        padding: var(--padding);
    }

    :global(:root) {
        /* Colors */
        --background-color: #f5f6f7;
        --foreground-color: #ffffff;
        --theme-color: #2c666e;
        --darkened-theme-color: #225157;

        --text-color: #000000;
        --secondary-text-color: #636466;
        --theme-text-color: #ffffff;

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
        --zebra-stripe-color: rgb(245, 245, 245);

        /* Fonts */
        --main-font: "Inter", sans-serif;
        --small-font-size: 13px;
        --font-size: 16px;
        --large-font-size: 19px;
        --h1-font-size: 32px;

        /* Sizes */
        --navbar-size: 60px;

        --small-gap: 4px;
        --medium-hap: 6px;
        --gap: 8px;
        --large-gap: 12px;
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
            --h1-font-size: 28px;

            /* Sizes */
            --navbar-size: 60px;

            --small-gap: 2px;
            --medium-hap: 4px;
            --gap: 6px;
            --large-gap: 10px;
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
            --h1-font-size: 22px;

            /* Sizes */
            --navbar-size: 60px;

            --small-gap: 2px;
            --medium-hap: 4px;
            --gap: 6px;
            --large-gap: 10px;
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
        font-family: var(--main-font);
        font-size: var(--font-size);

        margin: 0;
    }

    :global(*) {
        box-sizing: border-box;
    }

    :global(h1) {
        font-size: var(--h1-font-size);
        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
    }

    :global(a) {
        text-decoration: none;
    }

    :global(a:hover) {
        text-decoration: underline;
    }
</style>
