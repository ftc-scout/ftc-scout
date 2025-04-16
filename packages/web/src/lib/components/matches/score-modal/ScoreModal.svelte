<script lang="ts" context="module">
    type OpenMap = Writable<Record<string, boolean>>;
    export const SM_OPEN_SECTIONS = {} as Record<Season, OpenMap>;
    for (let season of ALL_SEASONS) {
        SM_OPEN_SECTIONS[season] = writable({});
    }
</script>

<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { FullMatchFragment } from "../../../graphql/generated/graphql-operations";
    import Modal from "../../Modal.svelte";
    import type { RemoteScoresTy, TradScoresTy } from "../MatchScore.svelte";
    import RemoteScores from "./RemoteScores.svelte";
    import TradScores from "./TradScores.svelte";
    import { writable, type Writable } from "svelte/store";
    import { ALL_SEASONS, type Season } from "@ftc-scout/common";

    export let shown = false;
    export let match: FullMatchFragment | null = null;

    $: scores = match?.scores;
    $: matchDescription = match?.description;

    $: trad = scores != null && "red" in scores ? (scores as TradScoresTy) : null;
    $: remote = scores != null && !("red" in scores) ? (scores as RemoteScoresTy) : null;

    $: worlds = match?.eventCode.startsWith("FTCCMP1")? true : false;
    $: division = match?.eventCode.slice(-4)
    $: matchtype =
            match?.eventCode == "FTCCMP1"? "f" :
            match?.tournamentLevel == TournamentLevel.Quals? "q" :
            match?.tournamentLevel == TournamentLevel.DoubleElim? "p" :
            "aaaaaaaaaaaa" // fallback, should never get here

    let dispatch = createEventDispatcher();
</script>

{#if match && scores && matchDescription}
    <Modal
        bind:shown
        titleText="Match {match.description}"
        close={() => {
            shown = false;
            dispatch("close");
        }}
    >
        {#if worlds}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video preload="none" poster="https://2025worldsclips.reduxrobotics.com/{division}-{matchtype}{match.matchNum}-01.png" controls style="width: 100%; max-height: 60vh">
                <source type="video/mp4" src="https://2025worldsclips.reduxrobotics.com/{division}-{matchtype}{match.matchNum}-01.mp4" />
            </video>
        {/if}
        {#if trad}
            <TradScores scores={trad} {matchDescription} teams={match.teams} />
        {:else if remote}
            <RemoteScores
                scores={remote}
                {matchDescription}
                teams={match.teams}
                teamNumber={match.teams[0].teamNumber}
            />
        {/if}
    </Modal>
{/if}
