<script lang="ts">
    import { browser } from "$app/environment";
    import type { EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import { awardIsNotRanked, prettyPrintAwardCategory } from "$lib/printers/award";
    import { sortAwardPlacement, sortAwardTypes } from "$lib/util/sorters";
    import { CURRENT_SEASON, type Season } from "@ftc-scout/common";
    import { TEAM_CLICK_ACTION_CONTEXT } from "$lib/components/matches/MatchTeam.svelte";
    import { getContext } from "svelte";

    type Award = NonNullable<EventPageQuery["eventByCode"]>["awards"][number];

    export let awards: Award[];
    export let season: Season;
    export let eventCode: string;
    export let focusedTeam: number | null;

    $: types = [...new Set(awards.map((a) => a.type))].sort(sortAwardTypes);

    let clickAction = getContext(TEAM_CLICK_ACTION_CONTEXT) as ((_: number) => void) | undefined;
</script>

{#each types as type}
    {@const awardsOfType = awards.filter((a) => a.type == type).sort(sortAwardPlacement)}

    <section>
        <h3>{prettyPrintAwardCategory(type)}</h3>

        <svelte:element this={awardIsNotRanked(type) ? "ul" : "ol"}>
            {#each awardsOfType as award}
                <li>
                    <a
                        href="/teams/{award.team.number}{season == CURRENT_SEASON
                            ? ''
                            : `?season=${season}`}#{eventCode}"
                        class:selected={focusedTeam == award.team.number}
                        role={browser && clickAction ? "button" : "link"}
                        on:click={(e) => {
                            if (clickAction) {
                                e.preventDefault();
                                clickAction(award.team.number);
                            }
                        }}
                    >
                        {#if award.personName == null}
                            {award.team.number} - <em>{award.team.name}</em>
                        {:else}
                            {award.personName} ({award.team.number} -
                            <em>{award.team.name}</em>)
                        {/if}
                    </a>
                </li>
            {/each}
        </svelte:element>
    </section>
{/each}

<style>
    section {
        margin-bottom: var(--lg-gap);
    }

    section:last-child {
        margin-bottom: 0;
    }

    h3 {
        color: var(--inline-theme-color);
        margin-bottom: var(--sm-gap);
    }

    li {
        margin-left: var(--xl-gap);
    }

    a {
        color: inherit;
        text-decoration: none;

        background: none;
        border: none;
        font-size: inherit;
        text-align: inherit;

        display: block;
        width: 100%;

        padding: var(--md-pad);
        border-radius: 4px;
        cursor: pointer;
    }

    a:hover {
        background: var(--hover-color);
    }

    a.selected {
        background-color: var(--neutral-team-color);
        color: var(--team-text-color);
    }
</style>
