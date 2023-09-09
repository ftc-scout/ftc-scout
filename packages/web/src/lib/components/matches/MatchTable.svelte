<script lang="ts" context="module">
    export const SHOW_MATCH_SCORE = {};
    export type ShowMatchFn = (match: FullMatchFragment) => void;
</script>

<script lang="ts">
    import { groupBy } from "@ftc-scout/common";
    import {
        TournamentLevel,
        type FullMatchFragment,
    } from "../../graphql/generated/graphql-operations";
    import { matchSorter } from "../../util/sorters";
    import RemoteMatchTableHeader from "./RemoteMatchTableHeader.svelte";
    import SectionRow from "./SectionRow.svelte";
    import TradMatchRow from "./TradMatchRow.svelte";
    import TradMatchTableHeader from "./TradMatchTableHeader.svelte";
    import RemoteMatches from "./RemoteMatches.svelte";
    import { page } from "$app/stores";
    import ScoreModal from "./score-modal/ScoreModal.svelte";
    import { setContext } from "svelte";
    import { queryParam } from "../../util/search-params/search-params";

    export let matches: FullMatchFragment[];
    export let event: {
        season: number;
        code: string;
        started: boolean;
        published: boolean;
        timezone: string;
        remote: boolean;
    };
    export let focusedTeam: number | null = null;

    $: timeZone = event.timezone;
    $: remote = event.remote;
    $: eventCode = event.code;
    $: season = event.season;

    $: quals = matches.filter((m) => m.tournamentLevel == TournamentLevel.Quals).sort(matchSorter);
    $: semis = matches.filter((m) => m.tournamentLevel == TournamentLevel.Semis);
    $: finals = matches
        .filter((m) => m.tournamentLevel == TournamentLevel.Finals)
        .sort(matchSorter);

    $: soloMatches = groupBy(matches, (m) => m.id - (m.id % 1000));

    $: anySurrogate = matches.some((m) => m.teams.some((t) => t.surrogate));
    $: anyDq = matches.some((m) => m.teams.some((t) => t.dq));

    let modalShown = false;
    let modalMatch: FullMatchFragment | null;

    function show(match: FullMatchFragment) {
        modalMatch = match;
        $modalMatchId = [match.eventCode, match.id];
        modalShown = true;
    }

    setContext(SHOW_MATCH_SCORE, show);

    let modalMatchId = queryParam<[string, number] | null>("scores", {
        encode: (m) => (m ? `${m[0]}-${m[1]}` : null),
        decode: (s) => {
            if (s == null) return null;
            let parts = s.split("-");
            return [parts[0], +parts[1]];
        },
        pushState: false,
    });
    if ($modalMatchId?.[0] == event.code) {
        let m = matches.find((m) => $modalMatchId?.[1] == m.id);
        if (m) show(m);
    }
</script>

<ScoreModal
    bind:shown={modalShown}
    bind:match={modalMatch}
    on:close={() => ($modalMatchId = null)}
/>

<table class:remote>
    {#if remote}
        <RemoteMatchTableHeader />
    {:else}
        <TradMatchTableHeader />
    {/if}

    <tbody>
        {#if matches.some((m) => !!m.scores)}
            {#if event.remote}
                {#each Object.values(soloMatches).filter( (ms) => ms.some((m) => m.scores) ) as matches, i}
                    <RemoteMatches
                        {matches}
                        {eventCode}
                        {season}
                        {timeZone}
                        {focusedTeam}
                        zebraStripe={i % 2 == 1}
                    />
                {/each}
            {:else}
                {#if finals.length}
                    <SectionRow name={"Finals"} />
                {/if}
                {#each finals as match, i}
                    <TradMatchRow
                        {match}
                        {eventCode}
                        {season}
                        {timeZone}
                        {focusedTeam}
                        zebraStripe={i % 2 == 1}
                    />
                {/each}
                {#if semis.length}
                    <SectionRow name={"Semifinals"} />
                {/if}
                {#each semis as match, i}
                    <TradMatchRow
                        {match}
                        {eventCode}
                        {season}
                        {timeZone}
                        {focusedTeam}
                        zebraStripe={i % 2 == 1}
                    />
                {/each}
                {#if quals.length && (finals.length || semis.length)}
                    <SectionRow name={"Qualification Matches"} />
                {/if}
                {#each quals as match, i}
                    <TradMatchRow
                        {match}
                        {eventCode}
                        {season}
                        {timeZone}
                        {focusedTeam}
                        zebraStripe={i % 2 == 1}
                    />
                {/each}
            {/if}
        {:else if !event.started}
            <tr class="info">
                <td>This event has not yet begun.</td>
            </tr>
        {:else if event.published && $page.route.id?.startsWith("/teams")}
            <tr class="info">
                <td> This team did not play any matches at this event. </td>
            </tr>
        {:else}
            <tr class="info">
                <td> Matches have not yet been reported for this event. </td>
            </tr>
        {/if}
    </tbody>
</table>

{#if (anySurrogate || anyDq) && !event.remote}
    <div style:margin-top="var(--sm-gap)">
        {#if anySurrogate}
            <div>* Surrogate</div>
        {/if}
        {#if anyDq}
            <div style:text-decoration="line-through">Disqualified or No Show</div>
        {/if}
    </div>
{/if}

<style>
    table {
        display: block;

        border: 1px solid var(--sep-color);
        border-radius: 8px;
    }

    tbody {
        display: block;
    }

    table tbody :global(tr:last-child) {
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
    }
    table tbody :global(tr:last-child) :global(td:first-child) {
        border-bottom-left-radius: 7px;
    }
    table tbody :global(tr:last-child) :global(td:last-child) {
        border-bottom-right-radius: 7px;
    }

    .info {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: var(--lg-pad);
    }

    .info td {
        display: block;
    }
</style>
