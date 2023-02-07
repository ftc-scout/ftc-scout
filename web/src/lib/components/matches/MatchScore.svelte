<script lang="ts">
    import type { EventPageMatchFragment } from "../../graphql/generated/graphql-operations";
    import { prettyPrintTimeString } from "../../util/format/pretty-print-time";
    import { createTippy } from "svelte-tippy";
    import "tippy.js/dist/tippy.css";

    export let match: EventPageMatchFragment;
    $: scores = match.scores;
    $: red = (scores as any)?.red?.totalPoints;
    $: blue = (scores as any)?.blue?.totalPoints;
    $: solo = (scores as any)?.totalPoints;
    let winner: "RED" | "BLUE" | "TIE" | "SOLO" | null;
    $: winner =
        solo != undefined ? "SOLO" : red != undefined ? (red > blue ? "RED" : blue > red ? "BLUE" : "TIE") : null;
    export let description: string;

    const tippy = createTippy({ placement: "left", delay: [750, 0] });
    $: showTip = !!scores && !!match.actualStartTime;
    $: tip = showTip
        ? {
              content: prettyPrintTimeString(match.actualStartTime),
          }
        : {
              // Hidden tip
              content: "",
              maxWidth: 0,
              arrow: false,
          };
</script>

<td style:width="10.75em" on:click class:has-scores={!!scores} use:tippy={tip}>
    <div class="wrapper">
        <div class="description" class:red={winner == "RED"} class:blue={winner == "BLUE"} class:tie={winner == "TIE"}>
            <strong>{description}</strong>
        </div>

        <div class="score" style:width="6.25em">
            {#if scores}
                {#if winner == "SOLO"}
                    <b>{solo}</b>
                {:else}
                    <span class="o l" class:winner={winner == "RED"} class:tie={winner == "TIE"}>
                        {red}
                    </span>
                    <span>-</span>
                    <span class="o r" class:winner={winner == "BLUE"} class:tie={winner == "TIE"}>
                        {blue}
                    </span>
                {/if}
            {:else}
                {prettyPrintTimeString(match.scheduledStartTime)}
            {/if}
        </div>
    </div>
</td>

<style>
    .l {
        text-align: right;
        width: 100%;
        padding-right: var(--small-gap);
    }

    .l.winner {
        color: var(--color-team-red);
        font-weight: bold;
    }

    .r {
        text-align: left;
        width: 100%;
        padding-left: var(--small-gap);
    }

    .r.winner {
        color: var(--color-team-blue);
        font-weight: bold;
    }

    .tie {
        color: var(--color-team-neutral);
        font-weight: bold;
    }

    .score {
        display: flex;
        align-items: baseline;
        justify-content: space-around;
    }

    td:not(.has-scores) .description {
        color: var(--grayed-out-text-color);
    }

    .wrapper {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    td {
        display: table-cell;

        outline: transparent solid 2px;
        transition: outline 0.12s ease 0s;

        padding-left: var(--gap);
    }

    td.has-scores {
        cursor: pointer;
    }

    td.has-scores:hover {
        outline: 2px solid var(--color-team-neutral);
        z-index: 1;
    }

    .red {
        color: var(--color-team-red);
    }

    .blue {
        color: var(--color-team-blue);
    }

    .tie {
        color: var(--color-team-neutral);
    }
</style>
