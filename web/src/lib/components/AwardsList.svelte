<script lang="ts">
    import type { AwardTypes2021 } from "../graphql/generated/graphql-operations";
    import { awardHasName, prettyPrintAwardCategory } from "../util/format/pretty-print-award";
    import { sortAwards } from "../util/sort-awards";

    export let awards: {
        type: AwardTypes2021;
        placement: number;
        personName?: string | null;
        team: { name: string; number: number };
    }[];

    export let selectedTeam: number | null;

    $: types = [...new Set(awards.map((a) => a.type))].sort(sortAwards);

    function handleClick(teamNumber: number) {
        if (teamNumber == selectedTeam) {
            selectedTeam = null;
        } else {
            selectedTeam = teamNumber;
        }
    }
</script>

<div>
    {#each types as type}
        {@const typeAwards = awards.filter((a) => a.type == type)}

        <section>
            <h3>{prettyPrintAwardCategory(type)}</h3>

            {#if !awardHasName(type)}
                <ol>
                    {#each typeAwards as award}
                        <li>
                            <span
                                class:selected={award.team.number == selectedTeam}
                                on:click={() => handleClick(award.team.number)}
                            >
                                {award.team.number} - {award.team.name}
                            </span>
                        </li>
                    {/each}
                </ol>
            {:else}
                <ul>
                    {#each typeAwards as award}
                        <li>
                            <span
                                class:selected={award.team.number == selectedTeam}
                                on:click={() => handleClick(award.team.number)}
                            >
                                {award.personName} ({award.team.number} - {award.team.name})
                            </span>
                        </li>
                    {/each}
                </ul>
            {/if}
        </section>
    {/each}
</div>

<style>
    div {
        padding-left: var(--padding);
    }

    section:not(:last-of-type) {
        margin-bottom: var(--vl-gap);
    }

    h3,
    ol,
    ul {
        margin-top: var(--small-gap);
        margin-bottom: var(--small-gap);
    }

    h3 {
        color: var(--theme-color);
    }

    ol,
    ul {
        padding-left: var(--xl-gap);
    }

    li {
        margin: 0;
        padding: 0;

        border-radius: 4px;

        width: 100%;
    }

    li:hover {
        background: var(--hover-color);
    }

    span {
        color: inherit;
        text-decoration: none;

        display: block;
        width: 100%;
        height: 100%;

        padding: var(--padding);

        border-radius: 4px;

        cursor: pointer;
    }

    span.selected {
        background: var(--color-team-neutral);
        color: var(--color-team-text);
    }
</style>
