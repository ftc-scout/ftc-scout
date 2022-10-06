<script lang="ts">
    import type { LayoutData } from "./$types";
    import Navbar from "$lib/components/nav/Navbar.svelte";
    import { setClient } from "svelte-apollo";
    import { getMyClient } from "../lib/graphql/client";
    import Sidebar from "../lib/components/nav/Sidebar.svelte";
    import type { HttpOptions } from "@apollo/client";
    import { page } from "$app/stores";
    import { keyPathName } from "../lib/util/key-pathname";

    export let data: LayoutData;
    let f: NonNullable<HttpOptions["fetch"]>;
    $: ({ f } = data);

    setClient(getMyClient(f));
</script>

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
