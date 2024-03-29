<script lang="ts">
    import { longestCommonPrefix, type Season } from "@ftc-scout/common";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import Card from "$lib/components/Card.svelte";
    import { sortString } from "$lib/util/sorters";

    type RelatedEvent = NonNullable<EventPageQuery["eventByCode"]>["relatedEvents"][number];

    export let relatedEvents: RelatedEvent[];
    export let thisEventName: string;
    export let season: Season;

    $: allEventNames = [thisEventName, ...relatedEvents.map((e) => e.name)];
    $: mainEventName = longestCommonPrefix(allEventNames);
    $: sorted = [...relatedEvents].sort((a, b) => sortString(a.code, b.code));

    function mapName(name: string): string {
        let sliced = name.slice(mainEventName.length).trim().replace(/\-\s*/, "");
        return sliced.length == 0 ? "Finals Division" : sliced;
    }
</script>

{#if relatedEvents.length}
    <Card vis={false}>
        <ul class:many={relatedEvents.length > 2}>
            {#each sorted as relatedEvent}
                <li>
                    <a href="/events/{season}/{relatedEvent.code}/matches">
                        {mapName(relatedEvent.name)}
                    </a>
                </li>
            {/each}
        </ul>
    </Card>
{/if}

<style>
    ul {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: stretch;
        gap: var(--lg-gap);

        width: 100%;
    }

    li {
        display: block;
        list-style: none;

        background: var(--fg-color);
        border: 1px solid var(--sep-color);
        border-radius: 8px;

        font-weight: bold;
        text-align: center;

        cursor: pointer;

        width: 100%;

        text-transform: capitalize;
        /* height: 100%;
        flex-grow: 1;
        flex-basis: 0; */
    }

    li:hover {
        background: var(--hover-color);
    }

    a {
        display: block;
        padding: var(--md-pad);
        width: 100%;
        height: 100%;

        color: inherit;
        text-decoration: none;
    }

    @media (max-width: 600px) {
        ul.many {
            flex-wrap: wrap;
        }

        .many li {
            flex-grow: 1;
            flex-basis: 40%;
        }
    }
</style>
