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

    export type TradScoresTy = NonNullable<
        Exclude<FullMatchFragment["scores"], { __typename: `${string}Remote` }>
    >;
    export type RemoteScoresTy = NonNullable<
        Extract<FullMatchFragment["scores"], { __typename: `${string}Remote` }>
    >;
</script>

<script lang="ts">
    import { Alliance, Season } from "@ftc-scout/common";
    import {
        TournamentLevel,
        type FullMatchFragment,
        type FullMatchScore2025AllianceFragment,
    } from "../../graphql/generated/graphql-operations";
    import { prettyPrintTimeString } from "../../printers/time";
    import { createTippy } from "svelte-tippy";
    import "tippy.js/dist/tippy.css";
    import "tippy.js/themes/light.css";
    import { tippyTheme } from "../nav/DarkModeToggle.svelte";
    import { matchTimeTip } from "../../util/tippy";
    import { getContext } from "svelte";
    import { SHOW_MATCH_SCORE, type ShowMatchFn } from "./MatchTable.svelte";

    export let match: FullMatchFragment;
    export let timeZone: string;
    export let showNonPenaltyScores = false;

    $: winner = computeWinner(match.scores);

    function calculateRP(s: FullMatchFragment["scores"]) {
        if (s?.season == Season.Decode) {
            let red = (s as any).red as FullMatchScore2025AllianceFragment;
            let blue = (s as any).blue as FullMatchScore2025AllianceFragment;
            return [
                +red.goalRp + +red.patternRp + +red.movementRp,
                +blue.goalRp + +blue.patternRp + +blue.movementRp,
            ];
        } else {
            return [0, 0];
        }
    }
    $: rps = calculateRP(match.scores);

    const tippy = createTippy({ placement: "left", delay: [750, 0], touch: false });
    $: tip = matchTimeTip(match, timeZone, $tippyTheme);

    let show: ShowMatchFn = getContext(SHOW_MATCH_SCORE);

    function scoreValue(score: any): number {
        if (!score || !("totalPoints" in score)) return 0;
        if (showNonPenaltyScores && "totalPointsNp" in score && score.totalPointsNp != null) {
            return score.totalPointsNp;
        }
        return score.totalPoints;
    }
</script>

<td
    class:hasScores={match.scores}
    use:tippy={tip}
    on:click={() => show(match)}
    id="{match.eventCode}-{match.id}"
>
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
            <div class="left" class:winner={winner == Alliance.Red} class:tie={winner == "Tie"}>
                <!-- // Help: Season Specific -->
                {#if match.season == Season.Decode && match.tournamentLevel == TournamentLevel.Quals}
                    <div class="dots red">
                        {#each new Array(rps[0] + 3 * +(winner == Alliance.Red) + +(winner == "Tie")) as _, i}
                            <div class="dot" style="right: calc({i} * var(--dot-stride))" />
                        {/each}
                    </div>
                {/if}

                {scoreValue(match.scores.red)}
            </div>
            <div class="minus">-</div>
            <div class="right" class:winner={winner == Alliance.Blue} class:tie={winner == "Tie"}>
                {scoreValue(match.scores.blue)}

                {#if match.season == Season.Decode && match.tournamentLevel == TournamentLevel.Quals}
                    <div class="dots blue">
                        {#each new Array(rps[1] + 3 * +(winner == Alliance.Blue) + +(winner == "Tie")) as _, i}
                            <div class="dot" style="left: calc({i} * var(--dot-stride))" />
                        {/each}
                    </div>
                {/if}
            </div>
        {:else}
            <b>{scoreValue(match.scores)}</b>
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

    .minus {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .left,
    .right {
        position: relative;
    }

    .dots {
        position: absolute;
        bottom: 0px;
        --dot-stride: 8px;
        --dot-size: 6px;
    }

    @media (max-width: 1000px) {
        .dots {
            bottom: 1px;
            --dot-stride: 6px;
            --dot-size: 4px;
        }
    }

    .left .dots {
        right: 0px;
    }

    .right .dots {
        left: 0px;
    }

    .dot {
        position: absolute;
        width: var(--dot-size);
        height: var(--dot-size);
        border-radius: 100%;
        background: blue;
    }

    .red .dot {
        background: var(--red-team-text-color);
    }
    .blue .dot {
        background: var(--blue-team-text-color);
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
