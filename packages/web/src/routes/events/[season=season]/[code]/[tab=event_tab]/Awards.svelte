<script lang="ts">
    import { browser } from "$app/environment";
    import type { AwardType, EventPageQuery } from "$lib/graphql/generated/graphql-operations";
    import { awardIsNotRanked, prettyPrintAwardCategory } from "$lib/printers/award";
    import { sortAwardPlacement, sortAwardTypes } from "$lib/util/sorters";
    import { CURRENT_SEASON, type Season } from "@ftc-scout/common";
    import { TEAM_CLICK_ACTION_CTX } from "$lib/components/matches/MatchTeam.svelte";
    import { getContext } from "svelte";

    type Award = NonNullable<EventPageQuery["eventByCode"]>["awards"][number];

    export let awards: Award[];
    export let season: Season;
    export let eventCode: string;
    export let focusedTeam: number | null;

    function handleAwards(awards: Award[]) {
        let types = awards.map((a) => JSON.stringify([a.type, a.divisionName]));
        let unique: [AwardType, string | null][] = [...new Set(types)].map((s) => JSON.parse(s));
        return unique
            .sort((a, b) => (a[1] ?? "").localeCompare(b[1] ?? ""))
            .sort((a, b) => sortAwardTypes(a[0], b[0]));
    }

    $: typeDivisions = handleAwards(awards);

    let clickAction = getContext(TEAM_CLICK_ACTION_CTX) as
        | ((num: number, name: string) => void)
        | undefined;
</script>

<div>
    {#each typeDivisions as [type, divisionName]}
        {@const awardsOfType = awards
            .filter((a) => a.type == type && a.divisionName == divisionName)
            .sort(sortAwardPlacement)}

        <section>
            <h3>
                {divisionName ?? ""}
                {prettyPrintAwardCategory(type)}
            </h3>

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
                                    clickAction(award.team.number, award.team.name);
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
</div>

<style>
    div {
        column-count: 2;
    }

    section {
        margin-bottom: var(--lg-gap);
        break-inside: avoid;
    }

    section:last-child {
        margin-bottom: 0;
    }

    h3 {
        background: var(--hover-color);
        padding: var(--sm-pad) var(--md-pad);
        border-radius: 6px;
        margin-bottom: var(--md-gap);
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

    @media (max-width: 850px) {
        div {
            gap: var(--md-gap) var(--lg-gap);
        }
    }

    @media (max-width: 600px) {
        div {
            column-count: 1;
        }

        h3 {
            text-align: center;
        }
    }
</style>
