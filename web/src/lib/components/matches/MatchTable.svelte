<script lang="ts">
    import { TournamentLevel, type EventPageMatchFragment } from "../../graphql/generated/graphql-operations";
    import TradMatchTableHeader from "./TradMatchTableHeader.svelte";
    import SectionRow from "./SectionRow.svelte";
    import { groupBy } from "../../util/group-by";
    import RemoteMatches from "./RemoteMatches.svelte";
    import MatchTrad from "./MatchTrad.svelte";
    import RemoteMatchTableHeader from "./RemoteMatchTableHeader.svelte";
    import ScoreModal from "./score-modals/ScoreModal.svelte";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { browser } from "$app/env";

    export let matches: EventPageMatchFragment[];
    export let event: { start: string; published: boolean; hasStarted: boolean; code: string };
    export let isRemote: boolean;
    export let selectedTeam: number | null = null;
    export let frozen = false;
    export let teamPage = false;

    $: qualsMatches = matches.filter((m) => m.tournamentLevel == TournamentLevel.Quals).sort((a, b) => a.id - b.id);
    $: semisMatches = matches.filter((m) => m.tournamentLevel == TournamentLevel.Semis); // We don't sort the semifinals because we don't know what order they were played in.
    $: finalsMatches = matches.filter((m) => m.tournamentLevel == TournamentLevel.Finals).sort((a, b) => a.id - b.id);

    $: soloMatches = groupBy(matches, (m) => m.id - (m.id % 1000));

    $: anySurrogate = matches.some((m) => m.teams.some((t) => t.surrogate));
    $: anyDq = matches.some((m) => m.teams.some((t) => t.dq));

    let scoresShown = false;
    let scoresShownMatch: EventPageMatchFragment | null = null;

    let initialValue = $page.url.searchParams.get("scores");
    if (!!initialValue) {
        scoresShownMatch = matches.find((m) => encodeURL(m) == initialValue) ?? null;
        scoresShown = !!scoresShownMatch;
    }

    $: {
        if (scoresShownMatch && scoresShown) {
            $page.url.searchParams.set("scores", encodeURL(scoresShownMatch));
            if (browser) goto(`?${$page.url.searchParams.toString()}`, { replaceState: true, noscroll: true });
        } else if (scoresShownMatch) {
            $page.url.searchParams.delete("scores");
            if (browser) goto(`?${$page.url.searchParams.toString()}`, { replaceState: true, noscroll: true });
        }
    }

    function encodeURL(match: EventPageMatchFragment): string {
        return `${match.eventCode}-${match.id}`;
    }

    function showScores(scores: EventPageMatchFragment) {
        scoresShownMatch = scores;
        scoresShown = true;
    }
</script>

<ScoreModal bind:shown={scoresShown} matchScores={scoresShownMatch} />

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
                    {#if !teamPage}
                        <RemoteMatches
                            matches={oneTeamMatches}
                            zebraStripe={i % 2 == 1}
                            bind:selectedTeam
                            {frozen}
                            showScoresFn={showScores}
                            eventCode={event.code}
                        />
                    {:else}
                        <RemoteMatches
                            matches={oneTeamMatches}
                            zebraStripe={i % 2 == 1}
                            selectedTeam={null}
                            {frozen}
                            showScoresFn={showScores}
                            eventCode={event.code}
                        />
                    {/if}
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
                            {frozen}
                            showScoresFn={showScores}
                            eventCode={event.code}
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
                            {frozen}
                            showScoresFn={showScores}
                            eventCode={event.code}
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
                            {frozen}
                            showScoresFn={showScores}
                            eventCode={event.code}
                        />
                    {/if}
                {/each}
            {/if}
        {:else if !event.hasStarted}
            <tr>
                <td style="display: block; margin: auto">This event has not yet begun.</td>
            </tr>
        {:else if teamPage && event.published}
            <tr>
                <td style="display: block; margin: auto">This team did not play any matches at this event.</td>
            </tr>
        {:else}
            <tr>
                <td style="display: block; margin: auto">Matches have not yet been reported for this event.</td>
            </tr>
        {/if}
    </tbody>
</table>

{#if (anySurrogate || anyDq) && !isRemote}
    <div style="padding-top: var(--small-padding)">
        {#if anySurrogate && !isRemote}
            <div class="explain">* Surrogate</div>
        {/if}

        {#if anyDq && !isRemote}
            <div class="explain" style="text-decoration: line-through">Disqualified or No Show</div>
        {/if}
    </div>
{/if}

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
