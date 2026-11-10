<script lang="ts" context="module">
    export const TAB_CONTEXT = {};
</script>

<script lang="ts">
    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
    import { setContext } from "svelte";
    import { writable } from "svelte/store";
    import Card from "../Card.svelte";
    import Fa from "svelte-fa";

    export let tabs: [icon: IconDefinition, name: string, id: string, shown: boolean][];
    $: shownTabs = tabs.filter((n) => n[3]);

    export let selectedTab: string;
    let selectedTabStore = writable(selectedTab);
    $: $selectedTabStore = selectedTab;
    setContext(TAB_CONTEXT, selectedTabStore);

    $: if (!shownTabs.some((t) => t[2] == selectedTab) && shownTabs.length)
        selectedTab = shownTabs[0][2];
</script>

{#if shownTabs.length}
    <Card vis={false}>
        <div class="tabs">
            {#each shownTabs as [icon, name, id]}
                <a
                    class="tab"
                    class:selected={id == selectedTab}
                    on:click|preventDefault={() => (selectedTab = id)}
                    href={id}
                >
                    <Fa {icon} scale="0.75x" />
                    <span class="maybe-hide"> {name} </span>
                </a>
            {/each}
        </div>

        <div class="card" class:flat-top={shownTabs[0][2] == selectedTab}>
            <slot />
        </div>
    </Card>
{:else}
    <slot name="empty" />
{/if}

<style>
    .tabs {
        display: flex;
        gap: var(--md-gap);
        align-items: center;
        justify-content: left;

        /* Make sure tabs don't move when switching to tab with contents wider than requested size */
        max-width: var(--requested-width);
        margin: 0 auto;
        /* Avoid border weirdness if last tab is up against right side */
        padding-right: 8px;
    }

    .tab {
        font-size: var(--vl-font-size);
        font-weight: 600;
        color: inherit;

        padding: var(--md-pad);

        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border: 1px solid transparent;
        border-bottom: none !important;

        transform: translate(0, 1px);

        cursor: pointer;
    }

    .tab:hover {
        text-decoration: none;
        background: var(--tab-hover-color);
    }

    /* Far left tab shows "under" the tab where the broder radius is, so extend hover color down */
    .tab:hover:not(.selected):after {
        position: absolute;
        content: "";
        background: var(--tab-hover-color);
        top: 100%;
        height: 20px;
        right: -1px;
        left: -1px;
    }

    .tab.selected {
        background: var(--fg-color);

        border: 1px solid var(--sep-color);
        z-index: 1; /* Stack selected tab above card, so top border of card in selected tab's area is hidden behind selected tab */
    }

    .card {
        background-color: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 8px;

        padding: var(--lg-pad);

        /* Stack card over non-selected tabs, so tab hover background is behind card */
        position: relative;
    }

    .flat-top {
        border-top-left-radius: 0;
    }

    @media (max-width: 650px) {
        .tab:not(.selected) .maybe-hide {
            display: none;
        }
    }
</style>
