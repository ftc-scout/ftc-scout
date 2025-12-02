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
    }

    .tab {
        font-size: var(--vl-font-size);
        font-weight: 600;
        color: inherit;

        padding: var(--md-pad);

        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border: 1px solid transparent;
        border-bottom: 1px solid var(--sep-color);

        transform: translate(0, 1px);

        cursor: pointer;
    }

    .tab:hover {
        text-decoration: none;
        background: var(--tab-hover-color);
    }

    .tab.selected {
        background: var(--fg-color);

        border: 1px solid var(--sep-color);
        border-bottom: 1px solid transparent;
    }

    .tab:first-child:not(.selected):not(:focus-visible) {
        /* Fix extra border */
        clip-path: polygon(
            0 0,
            100% 0,
            100% 100%,
            8px 100%,
            8px calc(100% - 1px),
            0 calc(100% - 1px)
        );
    }

    .card {
        background-color: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 8px;

        padding: var(--lg-pad);
    }

    .flat-top {
        border-top-left-radius: 0;
    }

    @media (max-width: 825px) {
        .tab:not(.selected) .maybe-hide {
            display: none;
        }
    }
</style>
