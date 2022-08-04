<script context="module" lang="ts">
    export const TAB_CONTEXT = "TAB_SELECTED_CONTEXT";
</script>

<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import { setContext } from "svelte";
    import Fa from "svelte-fa";
    import { writable, type Writable } from "svelte/store";

    export let names: [IconDefinition, string | null][];
    let namesFiltered: [IconDefinition, string][] = names.filter((n) => !!n[1]) as any;
    $: namesFiltered = names.filter((n) => !!n[1]) as any;

    export let selectedName: string | undefined;

    let selectedStore: Writable<string | undefined> = writable(selectedName);
    $: $selectedStore = selectedName;

    setContext(TAB_CONTEXT, selectedStore);

    import { getContext } from "svelte";
    import type { Readable } from "svelte/store";

    let requestedWidth: Readable<string> = getContext("REQUESTED_WIDTH");
    $: minWidth = `min(${$requestedWidth}, 100% - 2 * var(--large-gap))`;
</script>

<div class="wrapper" style:min-width={minWidth}>
    <div class="tabs">
        {#each namesFiltered as [icon, name]}
            <a
                class="tab"
                class:selected={name.toLowerCase() == selectedName?.toLowerCase()}
                on:click|preventDefault={() => (selectedName = name)}
                href={name.toLowerCase()}
            >
                <Fa {icon} scale="0.75x" />
                <span class="maybe-hide" style="padding-left: 1ch">{name}</span>
            </a>
        {/each}
    </div>

    <div class="card" class:unround-top={selectedName?.toLowerCase() == namesFiltered[0][1].toLowerCase()}>
        <slot />
    </div>
</div>

<style>
    .card {
        background-color: var(--foreground-color);
        box-shadow: -2px 2px 10px 3px #e0e0e0;
        border-radius: 8px;

        padding: var(--large-padding);
    }

    .unround-top {
        border-top-left-radius: 0px;
    }

    .wrapper {
        margin: var(--large-gap) auto;
        margin-bottom: var(--xl-gap);

        max-width: calc(100% - 2 * var(--large-gap));
        width: min-content;
    }

    .tabs {
        display: flex;
        gap: var(--gap);
        align-items: center;
        justify-content: left;
    }

    .tab {
        color: inherit;

        min-width: 10ch;

        display: flex;
        justify-content: center;
        align-items: center;

        padding: var(--padding);
        margin-bottom: var(--small-gap);

        background: none;
        border: none;

        cursor: pointer;

        font-weight: 600;
        font-size: var(--h2-font-size);

        border-top-left-radius: 8px;
        border-top-right-radius: 8px;

        transform: translate(0, var(--small-gap));
    }

    .tab:hover {
        text-decoration: none;
    }

    .tab:hover:not(.selected) {
        background: var(--tab-hover-color);
    }

    .selected {
        background: var(--foreground-color);

        box-shadow: -2px 2px 10px 3px #e0e0e0;
        clip-path: inset(-10px -10px 0 -10px);
    }

    @media (max-width: 650px) {
        button:not(.selected) .maybe-hide {
            display: none;
        }

        .tab {
            min-width: 0;
        }
    }
</style>
