<script lang="ts">
    import {
        TournamentLevel,
        type EventPageMatchFragment,
    } from "../../graphql/generated/graphql-operations";
    import TradMatchTableHeader from "./TradMatchTableHeader.svelte";
    import SectionRow from "./SectionRow.svelte";
    import { groupBy } from "../../util/group-by";
    import RemoteMatches from "./RemoteMatches.svelte";
    import MatchTrad from "./MatchTrad.svelte";
    import RemoteMatchTableHeader from "./RemoteMatchTableHeader.svelte";

    export let matches: EventPageMatchFragment[];
    export let event: { start: string };
    export let isRemote: boolean;
    export let selectedTeam: number | null = null;

    $: qualsMatches = matches
        .filter((m) => m.tournamentLevel == TournamentLevel.Quals)
        .sort((a, b) => a.id - b.id);
    $: semisMatches = matches.filter(
        (m) => m.tournamentLevel == TournamentLevel.Semis
    ); // We don't sort the semifinals because we don't know what order they were played in.
    $: finalsMatches = matches
        .filter((m) => m.tournamentLevel == TournamentLevel.Finals)
        .sort((a, b) => a.id - b.id);

    $: soloMatches = groupBy(matches, (m) => m.id - (m.id % 1000));

    $: anySurrogate = matches.some((m) => m.teams.some((t) => t.surrogate));
    $: anyDq = matches.some((m) => m.teams.some((t) => t.dq));
</script>

<table>
    {#if isRemote}
        <RemoteMatchTableHeader />
    {:else}
        <TradMatchTableHeader />
    {/if}

    <tbody>
        {#if matches.length}
            {#if isRemote}
                {#each soloMatches as oneTeamMatches, i}
                    <RemoteMatches
                        matches={oneTeamMatches}
                        zebraStripe={i % 2 == 1}
                        bind:selectedTeam
                    />
                {/each}
            {:else}
                {#if finalsMatches.length}
                    <SectionRow level={TournamentLevel.Finals} />
                {/if}

                {#each finalsMatches as match, i}
                    {#if match}
                        <MatchTrad
                            {match}
                            bind:selectedTeam
                            zebraStripe={i % 2 == 1}
                        />
                    {/if}
                {/each}

                {#if semisMatches.length}
                    <SectionRow level={TournamentLevel.Semis} />
                {/if}

                {#each semisMatches as match, i}
                    {#if match}
                        <MatchTrad
                            {match}
                            bind:selectedTeam
                            zebraStripe={i % 2 == 1}
                        />
                    {/if}
                {/each}

                {#if qualsMatches.length && (semisMatches.length || finalsMatches.length)}
                    <SectionRow level={TournamentLevel.Quals} />
                {/if}

                {#each qualsMatches as match, i}
                    {#if match}
                        <MatchTrad
                            {match}
                            bind:selectedTeam
                            zebraStripe={i % 2 == 1}
                        />
                    {/if}
                {/each}
            {/if}
        {:else}
            <!-- TODO: deal with timezones -->
            {#if new Date() > new Date(event.start)}
                <tr>Matches have not yet been reported for this event.</tr>
            {:else}
                <tr>This event has not yet begun.</tr>
            {/if}
        {/if}
    </tbody>
</table>

<div style="padding-top: var(--small-padding)">
    {#if anySurrogate && !isRemote}
        <div class="explain">* Surrogate</div>
    {/if}

    {#if anyDq && !isRemote}
        <div class="explain" style="text-decoration: line-through">
            Disqualified or No Show
        </div>
    {/if}
</div>

<style>
    table {
        border-spacing: 0;
        width: 100%;
        display: block;

        border: 1px solid lightgray;
        border-radius: 8px;
    }

    tbody {
        display: block;
    }

    .explain {
        padding-left: var(--small-padding);
    }

    tr {
        display: block;
        width: 100%;
        text-align: center;
        padding: var(--padding);
    }
</style>
