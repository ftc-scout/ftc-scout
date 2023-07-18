<script lang="ts">
    import { page } from "$app/stores";

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
        <h1>{computedStatus}</h1>
        {#if computedStatus == 404 && computedMessage == "Not Found"}
            <p>Not Found: {$page.url.pathname}</p>
        {:else}
            <p>{computedMessage}</p>
        {/if}
        <p class="help"><slot /></p>
    </div>
</div>

<style>
    h1 {
        font-weight: normal;
        font-size: calc(var(--xl-font-size) * 4);
        margin: 0;
        margin-right: var(--vl-gap);
    }

    p {
        font-size: calc(var(--xl-font-size) * 4 / 3);
        margin: 0;
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
