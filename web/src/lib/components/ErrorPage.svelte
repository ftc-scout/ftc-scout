<script lang="ts">
    import { page } from "$app/stores";

    export let status: number | null = null;
    export let message: string | null = null;
</script>

<svelte:head>
    <title>FTCScout</title>
</svelte:head>

<div class="outer">
    <div class="inner">
        <h1>{status ?? $page.status}</h1>
        {#if message ?? $page.error.message}
            <p>{message ?? $page.error.message}</p>
        {/if}
        <p class="help"><slot /></p>
    </div>
</div>

<style>
    h1 {
        font-weight: normal;
        font-size: calc(var(--h1-font-size) * 4);
        margin: 0;
        margin-right: var(--vl-gap);
    }

    p {
        font-size: calc(var(--h1-font-size) * 4 / 3);
        margin: 0;
    }

    .help {
        margin-top: var(--vl-gap);
        font-size: var(--large-font-size);
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
