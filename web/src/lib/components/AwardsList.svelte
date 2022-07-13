<script lang="ts">
    import type { AwardTypes2021 } from "../graphql/generated/graphql-operations";
    import { prettyPrintAwardCategory } from "../util/format/pretty-print-award";
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

            {#if type != "DEANS_LIST"}
                <ol>
                    {#each typeAwards as award}
                        <li>
                            <span
                                class:selected={award.team.number ==
                                    selectedTeam}
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
                                class:selected={award.team.number ==
                                    selectedTeam}
                                on:click={() => handleClick(award.team.number)}
                            >
                                {award.personName} ({award.team.number} - {award
                                    .team.name})
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

    section {
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

    ol {
        list-style: none;
        counter-reset: list;
    }

    li {
        /* margin-top: var(--large-gap); */
        /* margin-bottom: var(--large-gap); */
        counter-increment: list;

        margin: 0;
        padding: 0;

        /* display: block; */
        width: 100%;
    }

    li:hover {
        background: var(--hover-color);
    }

    ol li::marker {
        content: counter(list) ")\a0";
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
