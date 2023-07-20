<script lang="ts" context="module">
    export function computeWinner(s: FullMatchFragment["scores"]): Alliance | "Tie" | null {
        if (s == undefined) {
            return null;
        } else if ("red" in s) {
            if (s.red.totalPoints > s.blue.totalPoints) {
                return Alliance.Red;
            } else if (s.blue.totalPoints > s.red.totalPoints) {
                return Alliance.Blue;
            } else {
                return "Tie";
            }
        } else {
            return Alliance.Solo;
        }
    }
</script>

<script lang="ts">
    import { Alliance } from "@ftc-scout/common";
    import type { FullMatchFragment } from "../../graphql/generated/graphql-operations";
    import { prettyPrintTimeString } from "../../printers/time";
    import { createTippy } from "svelte-tippy";
    import "tippy.js/dist/tippy.css";
    import "tippy.js/themes/light.css";
    import { tippyTheme } from "../nav/DarkModeToggle.svelte";
    import { matchTimeTip } from "../../util/tippy";

    export let match: FullMatchFragment;
    export let timeZone: string;

    $: winner = computeWinner(match.scores);

    const tippy = createTippy({ placement: "left", delay: [750, 0] });
    $: tip = matchTimeTip(match, timeZone, $tippyTheme);
</script>

<td class:hasScores={match.scores} use:tippy={tip}>
    <div
        class="description"
        class:red={winner == Alliance.Red}
        class:blue={winner == Alliance.Blue}
        class:tie={winner == "Tie"}
    >
        {match.description}
    </div>
    <div class="score">
        {#if match.scores == undefined}
            {prettyPrintTimeString(match.scheduledStartTime, timeZone)}
        {:else if "red" in match.scores}
            <span class="left" class:winner={winner == Alliance.Red} class:tie={winner == "Tie"}>
                {match.scores.red.totalPoints}
            </span>
            <span>-</span>
            <span class="right" class:winner={winner == Alliance.Blue} class:tie={winner == "Tie"}>
                {match.scores.blue.totalPoints}
            </span>
        {:else}
            <b>{match.scores.totalPoints}</b>
        {/if}
    </div>
</td>

<style>
    td {
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        align-items: center;

        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;
    }

    .hasScores {
        cursor: pointer;
    }

    .hasScores:hover {
        z-index: 1;
        outline: 2px solid var(--neutral-team-color);
    }

    .description {
        padding-left: var(--md-gap);
        font-weight: bold;
        color: var(--grayed-out-text-color);
    }

    .red {
        color: var(--red-team-text-color);
    }
    .blue {
        color: var(--blue-team-text-color);
    }
    .tie {
        color: var(--neutral-team-text-color);
    }

    .score {
        display: flex;
        justify-content: space-around;
        gap: var(--sm-gap);
    }

    .score .left {
        width: 100%;
        text-align: right;
    }

    .score .left.winner {
        font-weight: bold;
        color: var(--red-team-text-color);
    }

    .score .right {
        width: 100%;
        text-align: left;
    }

    .score .right.winner {
        font-weight: bold;
        color: var(--blue-team-text-color);
    }

    .score .tie {
        font-weight: bold;
        color: var(--neutral-team-text-color);
    }
</style>
