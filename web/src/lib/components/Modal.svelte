<script lang="ts">
    import { clickOutside } from "../util/directives";
    import { browser } from "$app/env";
    import { fade } from "svelte/transition";

    export let shown = false;

    let element: HTMLElement;

    $: if (browser && shown) {
        setTimeout(() => element?.focus(), 1);
    }

    const hide = () => (shown = false);
</script>

<svelte:body
    on:keydown={(e) => {
        if (e.key == "Escape") shown = false;
    }} />

{#if shown}
    <div transition:fade|local={{ duration: 100 }} bind:this={element} class="outer-wrapper">
        <div class="content-wrapper" use:clickOutside on:click_outside={hide}>
            <div class="title-wrapper">
                <slot name="title" />
            </div>
            <div class="scroll-wrapper">
                <slot />
            </div>
            <button class="close" on:click={hide}> Close </button>
        </div>
    </div>
{/if}

<style>
    .outer-wrapper {
        position: fixed;

        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        max-height: 100%;

        z-index: 1050;

        background: var(--modal-background-color);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content-wrapper {
        background: var(--foreground-color);
        border-radius: 8px;

        box-shadow: -2px 2px 10px 3px rgba(0, 0, 0, 20%);

        margin: var(--gap);

        display: flex;
        flex-direction: column;
        height: auto;
        max-height: calc(100% - var(--large-gap) * 2);
        max-width: 100%;
        position: relative;
    }

    .title-wrapper {
        padding: var(--large-padding);
        padding-bottom: 0;
    }

    .scroll-wrapper {
        padding: var(--large-padding);

        max-height: 100%;
        overflow: auto;
    }

    .close {
        background: var(--theme-color);
        color: var(--theme-text-color);

        border: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;

        padding: var(--large-padding);

        cursor: pointer;

        font-weight: bold;
        /* font-size: var(--large-font-size); */
    }
</style>
