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

    $: types = [...new Set(awards.map((a) => a.type))].sort(sortAwards);
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
                            <a href={`/teams/${award.team.number}`}>
                                {award.team.number} - {award.team.name}
                            </a>
                        </li>
                    {/each}
                </ol>
            {:else}
                <ul>
                    {#each typeAwards as award}
                        <li>
                            <a href={`/teams/${award.team.number}`}>
                                {award.personName} ({award.team.number} - {award
                                    .team.name})
                            </a>
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
    ol {
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
        margin-top: var(--large-gap);
        margin-bottom: var(--large-gap);
        counter-increment: list;
    }

    ol li::marker {
        content: counter(list) ")\a0";
    }

    a {
        color: inherit;
    }
</style>
