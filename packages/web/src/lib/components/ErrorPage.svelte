<script lang="ts">
    import { page } from "$app/stores";
    import Fa from "svelte-fa";
    import { faBomb } from "@fortawesome/free-solid-svg-icons";

    export let status: number | null = null;
    export let message: string | null = null;

    $: computedStatus = status ?? $page.status;
    $: computedMessage = message ?? $page?.error?.message;
</script>

<svelte:head>
    <title>FTCScout</title>
</svelte:head>

<div class="outer">
    <div class="inner">
        <Fa icon={faBomb} size="10x" />
        <h1>{computedStatus}</h1>
        {#if computedStatus == 404 && computedMessage == "Not Found"}
            <p>Not Found: {$page.url.pathname}</p>
            <p style="font-size: 18px;">
                The page you are looking for doesn't exist. If we linked you here, reach out at <a
                    href="mailto:contact@ftcscout.org">contact@ftcscout.org</a
                >.
            </p>
        {:else}
            <p>{computedMessage}</p>
            <p style="font-size: 18px;">
                There appears to be an error. If the issue persists, reach out at <a
                    href="mailto:contact@ftcscout.org">contact@ftcscout.org</a
                >.
            </p>
        {/if}
        <p class="help"><slot /></p>
    </div>
</div>

<style>
    h1 {
        font-weight: normal;
        font-size: calc(var(--xl-font-size) * 2);
        margin: 0;
        margin-right: var(--vl-gap);
    }

    p {
        font-size: calc(var(--xl-font-size));
        margin: 0;
        margin-bottom: 5px;
    }

    .help {
        margin-top: var(--vl-gap);
        font-size: var(--lg-font-size);
    }

    .inner {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .outer {
        display: flex;
        width: 100%;
        height: calc(66vh - var(--navbar-size));
        align-items: center;
        justify-content: center;
    }
</style>
