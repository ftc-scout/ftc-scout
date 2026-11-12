<script lang="ts">
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { EMAIL, UNREACHABLE } from "../constants";
    import Card from "./Card.svelte";
    import Head from "./Head.svelte";
    import WidthProvider from "./WidthProvider.svelte";

    export let status: number | null = null;
    export let message: string | null = null;

    let offline = browser && !navigator.onLine;

    $: computedStatus = status ?? $page.status;
    $: computedMessage = message ?? $page?.error?.message;
</script>

<Head title="FTCScout" />

<WidthProvider width="800px">
    <Card vis={false}>
        <div class="inner">
            {#if computedStatus == 404 && computedMessage == "Not Found"}
                <a href="/teams/404"><h1>{computedStatus}</h1></a>
                <p class="top">Not Found: {$page.url.pathname}</p>
                <p class="bottom">
                    The page you are looking for doesn't exist. If we linked you here, reach out at
                    <a href="mailto:{EMAIL}">{EMAIL}</a>.
                </p>
            {:else if computedStatus == 404}
                <h1>{computedStatus}</h1>
                <p class="top">{computedMessage}</p>
            {:else if offline || computedMessage == UNREACHABLE}
                <h1 class="word">{offline ? "Offline" : "Can't reach the server"}</h1>
                <p class="top">This page isn't saved on this device</p>
                <p class="bottom">
                    The site can't reach the server and hasn't been saved this page on your device.
                </p>
            {:else}
                <h1>{computedStatus}</h1>
                <p class="top">{computedMessage}</p>
                <p class="bottom">
                    There appears to be an error. If the issue persists, reach out at
                    <a href="mailto:{EMAIL}">{EMAIL}</a>.
                </p>
            {/if}

            {#if !offline && computedMessage != UNREACHABLE}
                <p class="help"><slot /></p>
            {/if}
        </div>
    </Card>
</WidthProvider>

<style>
    a {
        text-decoration: none;
        color: inherit;
    }

    h1 {
        font-weight: 600;
        font-size: calc(var(--xl-font-size) * 5);
    }

    h1.word {
        font-size: calc(var(--xl-font-size) * 1.5);
        margin-bottom: var(--md-gap);
    }

    p {
        text-align: center;
    }

    .top {
        font-size: calc(var(--xl-font-size));
        margin-bottom: var(--vl-gap);
        font-weight: 600;
    }

    .bottom {
        font-size: var(--lg-font-size);
        color: var(--secondary-text-color);
        margin-bottom: var(--vl-gap);
    }

    .help {
        font-size: var(--lg-font-size);
        color: var(--secondary-text-color);
    }

    .inner {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        margin-top: 10vh;
    }
</style>
