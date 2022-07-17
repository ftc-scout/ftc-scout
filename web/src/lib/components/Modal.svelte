<script>
    import Card from "./Card.svelte";
    import { clickOutside } from "../util/directives";
    import { fade } from "svelte/transition";
    import { browser } from "$app/env";

    export let shown = false;

    $: if (browser) {
        if (shown) {
            let width = document.body.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.width = `${width}px`;
        } else {
            document.body.style.overflow = "auto";
            document.body.style.width = "auto";
        }
    }
</script>

<svelte:body
    on:keydown={(e) => {
        if (e.key == "Escape") shown = false;
    }} />

{#if shown}
    <div class="outer-wrapper" in:fade|local={{ duration: 100 }}>
        <div
            class="content-wrapper"
            use:clickOutside
            on:click_outside={() => (shown = false)}
        >
            <slot />
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

        z-index: 50;

        background: var(--modal-background-color);

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content-wrapper {
        background: var(--foreground-color);
        padding: var(--large-padding);
        border-radius: 8px;

        box-shadow: -2px 2px 10px 3px rgba(0, 0, 0, 20%);
    }
</style>
