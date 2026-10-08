<script lang="ts" context="module">
    export const SHOW_MATCH_SCORE = {};
    export type ShowMatchFn = (match: FullMatchFragment) => void;

    const BREAK_THRESHOLD_MS = 15 * 60 * 1000;

    export function getDelayForMatches(
        sortedSection: {
            id: number;
            scores?: any;
            actualStartTime?: string;
            scheduledStartTime?: string;
        }[]
    ): Map<number, number> {
        const result = new Map<number, number>();

        let lastPlayedIdx = -1;
        let delayMs = 0;
        for (let i = sortedSection.length - 1; i >= 0; i--) {
            const m = sortedSection[i];
            if (m.scores && m.actualStartTime && m.scheduledStartTime) {
                lastPlayedIdx = i;
                delayMs =
                    new Date(m.actualStartTime).getTime() -
                    new Date(m.scheduledStartTime).getTime();
                break;
            }
        }
        if (lastPlayedIdx === -1) return result;

        for (let i = lastPlayedIdx + 1; i < sortedSection.length; i++) {
            const prev = sortedSection[i - 1];
            const curr = sortedSection[i];
            if (curr.scheduledStartTime && prev.scheduledStartTime) {
                const gap =
                    new Date(curr.scheduledStartTime).getTime() -
                    new Date(prev.scheduledStartTime).getTime();
                if (gap > BREAK_THRESHOLD_MS) break;
            }
            if (!curr.scores) result.set(curr.id, delayMs);
        }

        return result;
    }
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
    import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
    import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";
    import Fa from "svelte-fa";

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
    export let showNonPenaltyScores = false;
    export let showHeartLegend = true;

    $: timeZone = event.timezone;
    $: remote = event.remote;
    $: eventCode = event.code;
    $: season = event.season;

    $: quals = matches.filter((m) => m.tournamentLevel == TournamentLevel.Quals).sort(matchSorter);
    $: semis = matches.filter((m) => m.tournamentLevel == TournamentLevel.Semis);
    $: finals = matches
        .filter((m) => m.tournamentLevel == TournamentLevel.Finals)
        .sort(matchSorter);
    $: doubleElim = matches.filter((m) => m.tournamentLevel == TournamentLevel.DoubleElim);

    $: qualsDelays = getDelayForMatches(quals);
    $: finalsDelays = getDelayForMatches(finals);
    $: doubleElimDelays = getDelayForMatches(doubleElim);
    $: semisDelays = getDelayForMatches(semis);

    $: activeDelayMs = (() => {
        for (const map of [qualsDelays, finalsDelays, doubleElimDelays, semisDelays]) {
            if (map.size > 0) return map.values().next().value as number;
        }
        return null;
    })();

    function formatDelay(ms: number): string {
        const mins = Math.round(Math.abs(ms) / 60000);
        if (mins === 0) return "On schedule";
        return ms > 0 ? `~${mins} min behind schedule` : `~${mins} min ahead of schedule`;
    }

    let showPredicted = true;

    $: soloMatches = groupBy(matches, (m) => m.id - (m.id % 1000));

    $: anySurrogate = matches.some((m) => m.teams.some((t) => t.surrogate));
    $: anyDq = matches.some((m) => m.teams.some((t) => t.dq));

    $: teamCount = new Set(matches.flatMap((m) => m.teams.map((t) => t.teamNumber))).size;

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

{#if activeDelayMs !== null && !remote}
    <div class="delay-bar">
        <div class="delay-status" class:late={activeDelayMs > 0} class:early={activeDelayMs < 0}>
            <span class="delay-dot" />
            {formatDelay(activeDelayMs)}
        </div>
        <label class="predicted-toggle">
            <input type="checkbox" bind:checked={showPredicted} />
            Show predicted times
        </label>
    </div>
{/if}

<table class:remote>
    {#if remote}
        <RemoteMatchTableHeader />
    {:else}
        <TradMatchTableHeader />
    {/if}

    <tbody>
        {#if matches.some((m) => !!m.teams)}
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
                {#if doubleElim.length}
                    <SectionRow name={"Playoffs"} />
                {/if}
                {#each doubleElim as match, i}
                    <TradMatchRow
                        {match}
                        {eventCode}
                        {season}
                        {timeZone}
                        {focusedTeam}
                        zebraStripe={i % 2 == 1}
                        {teamCount}
                        {showNonPenaltyScores}
                        delayMs={showPredicted ? doubleElimDelays.get(match.id) ?? null : null}
                    />
                {/each}
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
                        {showNonPenaltyScores}
                        delayMs={showPredicted ? finalsDelays.get(match.id) ?? null : null}
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
                        {showNonPenaltyScores}
                        delayMs={showPredicted ? semisDelays.get(match.id) ?? null : null}
                    />
                {/each}
                {#if quals.length && (finals.length || semis.length || doubleElim.length)}
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
                        {showNonPenaltyScores}
                        delayMs={showPredicted ? qualsDelays.get(match.id) ?? null : null}
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

{#if showHeartLegend && doubleElim.length > 0}
    <div style:margin-top="var(--md-gap)" style="display: flex; gap: var(--vl-gap)">
        <div><Fa icon={faHeart} style="color: var(--red-team-color)" /> Elimination Remaining</div>
        <div>
            <Fa icon={faHeartBroken} style="color: var(--grayed-out-text-color)" /> Lost This Match
        </div>
        <div>
            <Fa icon={faHeartOutline} style="color: var(--grayed-out-text-color)" /> Lost Previous Match
        </div>
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

    .delay-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--md-gap);
        padding: 0 var(--md-pad);
        margin-bottom: var(--sm-gap);
    }

    .delay-status {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        font-weight: 600;
        color: var(--grayed-out-text-color);
    }

    .delay-status.late {
        color: #c87000;
    }

    .delay-status.early {
        color: #2e7d32;
    }

    :global(body.dark) .delay-status.late {
        color: #ffb74d;
    }

    :global(body.dark) .delay-status.early {
        color: #81c784;
    }

    .delay-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
        flex-shrink: 0;
    }

    .predicted-toggle {
        display: flex;
        align-items: center;
        gap: var(--sm-gap);
        cursor: pointer;
        color: var(--grayed-out-text-color);
        font-size: 0.9em;
        white-space: nowrap;
    }

    .predicted-toggle input {
        width: 1.2em;
        height: 1.2em;
        cursor: pointer;
    }
</style>
