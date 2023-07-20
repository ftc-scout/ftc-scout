<script lang="ts">
    import { createTippy } from "svelte-tippy";
    import type { FullMatchFragment } from "../../graphql/generated/graphql-operations";
    import MatchTeam from "./MatchTeam.svelte";
    import { matchTimeTip } from "../../util/tippy";
    import { tippyTheme } from "../nav/DarkModeToggle.svelte";

    function matchScore(match: FullMatchFragment | undefined | null): number | null {
        if (!match) return null;

        return match.scores && "totalPoints" in match.scores ? match.scores.totalPoints : null;
    }

    export let matches: FullMatchFragment[];
    export let eventCode: string;
    export let timeZone: string;
    export let zebraStripe: boolean;

    $: team = matches[0].teams[0];
    $: totalPoints = matches
        .map((m) => matchScore(m) ?? 0)
        .reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    $: notReported = matches.every((m) => !m.scores);

    const tippy = createTippy({ placement: "bottom", delay: [750, 0] });
</script>

<tr class:zebra-stripe={zebraStripe}>
    <MatchTeam {team} {eventCode} focusedTeam={null} winner={false} span={1} />

    {#if !notReported}
        {#each [1, 2, 3, 4, 5, 6] as n}
            {@const match = matches.find((m) => m.matchNum == n)}
            {@const score = matchScore(match)}
            {@const tip = matchTimeTip(match, timeZone, $tippyTheme)}
            <td class:score={score != undefined} use:tippy={tip}>
                {#if score != undefined}
                    {score}
                {/if}
            </td>
        {/each}

        <td class="total">{totalPoints}</td>
    {:else}
        <td class="msg">Scores have not yet been reported.</td>
    {/if}
</tr>

<style>
    tr {
        display: grid;
        grid-template-columns: 17em repeat(7, minmax(0, 1fr));
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 5em repeat(7, minmax(0, 1fr));
        }
    }

    .zebra-stripe {
        background-color: var(--zebra-stripe-color);
    }

    td {
        display: flex;
        justify-content: center;
        align-items: center;

        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;

        overflow: hidden;
    }

    .score {
        cursor: pointer;
    }

    .score:hover {
        outline: 2px solid var(--neutral-team-color);
        z-index: 1;
    }

    tr *:nth-child(2) {
        border-left: 2px solid var(--sep-color);
        clip-path: inset(-4px -4px -4px 0px);
    }
    tr .score:nth-child(2):hover {
        border-left: 2px solid var(--neutral-team-color);
    }

    tr *:last-child {
        border-left: 2px solid var(--sep-color);
    }

    .msg {
        grid-column: span 7;
    }
</style>
