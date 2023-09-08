<script lang="ts">
    import { page } from "$app/stores";
    import { EMAIL } from "../constants";
    import Card from "./Card.svelte";
    import Head from "./Head.svelte";
    import WidthProvider from "./WidthProvider.svelte";

    export let status: number | null = null;
    export let message: string | null = null;

    $: computedStatus = status ?? $page.status;
    $: computedMessage = message ?? $page?.error?.message;
</script>

<Head title="FTCScout" />

<WidthProvider width="800px">
    <Card vis={false}>
        <div class="inner">
            <h1>{computedStatus}</h1>

            {#if computedStatus == 404 && computedMessage == "Not Found"}
                <p class="top">Not Found: {$page.url.pathname}</p>
                <p class="bottom">
                    The page you are looking for doesn't exist. If we linked you here, reach out at
                    <a href="mailto:{EMAIL}">{EMAIL}</a>.
                </p>
            {:else if computedStatus == 404}
                <p class="top">{computedMessage}</p>
            {:else}
                <p class="top">{computedMessage}</p>
                <p class="bottom">
                    There appears to be an error. If the issue persists, reach out at
                    <a href="mailto:{EMAIL}">{EMAIL}</a>.
                </p>
            {/if}

            <p class="help"><slot /></p>
        </div>
    </Card>
</WidthProvider>

<style>
    h1 {
        font-weight: 600;
        font-size: calc(var(--xl-font-size) * 5);
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
