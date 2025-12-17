<script lang="ts">
    import {
        Alliance,
        TournamentLevel,
        type FullMatchFragment,
    } from "../../graphql/generated/graphql-operations";
    import { sortTeams } from "../../util/sorters";
    import DeLives from "./DELives.svelte";
    import MatchScore, { computeWinner } from "./MatchScore.svelte";
    import MatchTeam from "./MatchTeam.svelte";
    import PlaceholderMatchTeam from "./PlaceholderMatchTeam.svelte";
    import VideoPlayerModal from "./VideoPlayerModal.svelte";
    import AddVideoModal from "./AddVideoModal.svelte";
    import { faPlay, faPlus } from "@fortawesome/free-solid-svg-icons";
    import Fa from "svelte-fa";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";

    export let match: FullMatchFragment;
    export let eventCode: string;
    export let season: number;
    export let timeZone: string;
    export let focusedTeam: number | null;
    export let zebraStripe: boolean;
    export let teamCount = 0;

    $: teams = match.teams;
    $: redTeams = teams.filter((t) => t.alliance == Alliance.Red);
    $: blueTeams = teams.filter((t) => t.alliance == Alliance.Blue);

    $: redExtras = Array(Math.max(2 - redTeams.length, 0)).fill(Alliance.Red);
    $: reds = [...redTeams, ...redExtras].sort(sortTeams);
    $: blueExtras = Array(Math.max(2 - blueTeams.length, 0)).fill(Alliance.Blue);
    $: blues = [...blueTeams, ...blueExtras].sort(sortTeams);

    $: isDoubleElim = match.tournamentLevel == TournamentLevel.DoubleElim;
    $: isNewRound = isDoubleElim && checkIsNewRound(match.series, match.matchNum, teamCount);

    $: winner = computeWinner(match.scores);

    let hasVideo = false;
    let videoUrl = "";
    let videoStart = 0;
    let videoEnd = 0;
    let showVideoPlayer = false;
    let showAddVideo = false;
    let user: { canClipVideos: boolean } | null = null;

    onMount(() => {
        if (browser) {
            const userStr = localStorage.getItem("user");
            if (userStr) {
                try {
                    user = JSON.parse(userStr);
                } catch (e) {}
            }
        }
        loadVideos();
    });

    async function loadVideos() {
        try {
            const response = await fetch(`http://${import.meta.env.PUBLIC_SERVER_ORIGIN}/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Ftcscout-Code": import.meta.env.PUBLIC_FRONTEND_CODE,
                },
                credentials: "include",
                body: JSON.stringify({
                    query: `
                        query GetMatchVideos($eventSeason: Int!, $eventCode: String!, $matchId: Int!) {
                            getMatchVideos(eventSeason: $eventSeason, eventCode: $eventCode, matchId: $matchId) {
                                id
                                youtubeUrl
                                startTime
                                endTime
                            }
                        }
                    `,
                    variables: {
                        eventSeason: season,
                        eventCode,
                        matchId: match.id,
                    },
                }),
            });

            const result = await response.json();
            const videos = result.data?.getMatchVideos || [];
            if (videos.length > 0) {
                hasVideo = true;
                videoUrl = videos[0].youtubeUrl;
                videoStart = videos[0].startTime;
                videoEnd = videos[0].endTime;
            }
        } catch (e) {
            console.error("Failed to load videos:", e);
        }
    }

    function playVideo() {
        showVideoPlayer = true;
    }

    function openAddVideo() {
        showAddVideo = true;
    }

    function handleVideoAdded() {
        loadVideos();
    }

    function hasAlreadyLost(series: number, teamCount: number, alliance: Alliance): boolean {
        if (teamCount <= 10) {
            return false;
        } else if (teamCount <= 20) {
            return (
                series == 3 ||
                series == 5 ||
                (series == 6 && alliance == Alliance.Blue) ||
                series == 7
            );
        } else if (teamCount <= 40) {
            return (
                series == 5 ||
                series == 6 ||
                series == 8 ||
                series == 9 ||
                (series == 10 && alliance == Alliance.Blue) ||
                series == 11
            );
        } else {
            return (
                series == 5 ||
                series == 6 ||
                series == 9 ||
                series == 10 ||
                series == 12 ||
                series == 13 ||
                (series == 14 && alliance == Alliance.Blue) ||
                series == 15
            );
        }
    }

    function checkIsNewRound(series: number, matchNum: number, teamCount: number): boolean {
        if (matchNum != 1) {
            return false;
        }

        if (teamCount <= 10) {
            return false;
        } else if (teamCount <= 20) {
            return series == 3 || series == 5 || series == 6;
        } else if (teamCount <= 40) {
            return series == 3 || series == 5 || series == 7 || series == 9 || series == 10;
        } else {
            return series == 5 || series == 9 || series == 11 || series == 13 || series == 14;
        }
    }
</script>

<VideoPlayerModal
    bind:shown={showVideoPlayer}
    {videoUrl}
    startTime={videoStart}
    endTime={videoEnd}
/>

<AddVideoModal
    bind:shown={showAddVideo}
    eventSeason={season}
    {eventCode}
    matchId={match.id}
    matchDescription={match.description}
    on:videoAdded={handleVideoAdded}
/>

<tr class:zebraStripe class:isDoubleElim class:new-round={isNewRound}>
    <MatchScore {match} {timeZone} />

    {#if isDoubleElim}
        <DeLives
            alliance={Alliance.Red}
            alreadyLost={hasAlreadyLost(match.series, teamCount, Alliance.Red)}
            lostThis={winner == Alliance.Blue}
        />
    {/if}

    {#each reds as team}
        {#if team == Alliance.Red}
            <PlaceholderMatchTeam alliance={team} span={6 / reds.length} />
        {:else}
            <MatchTeam
                {team}
                {eventCode}
                {season}
                {focusedTeam}
                winner={winner == Alliance.Red}
                span={6 / reds.length}
            />
        {/if}
    {/each}

    {#if isDoubleElim}
        <DeLives
            alliance={Alliance.Blue}
            alreadyLost={hasAlreadyLost(match.series, teamCount, Alliance.Blue)}
            lostThis={winner == Alliance.Red}
        />
    {/if}

    {#each blues as team}
        {#if team == Alliance.Blue}
            <PlaceholderMatchTeam alliance={team} span={6 / blues.length} />
        {:else}
            <MatchTeam
                {team}
                {eventCode}
                {season}
                {focusedTeam}
                winner={winner == Alliance.Blue}
                span={6 / blues.length}
            />
        {/if}
    {/each}

    <td class="video-actions">
        {#if hasVideo}
            <button class="video-btn play-btn" on:click={playVideo} title="Play match video">
                <Fa icon={faPlay} />
            </button>
        {/if}
        {#if user?.canClipVideos}
            <button class="video-btn add-btn" on:click={openAddVideo} title="Add match video">
                <Fa icon={faPlus} />
            </button>
        {/if}
    </td>
</tr>

<style>
    tr {
        display: grid;
        grid-template-columns: 10.75em repeat(12, 1fr) 3em;

        min-height: 28px;
    }

    tr.isDoubleElim {
        grid-template-columns: 10.75em auto repeat(6, 1fr) auto repeat(6, 1fr) 3em;
    }

    tr.new-round {
        border-top: 1px solid var(--sep-color);
    }

    @media (max-width: 1000px) {
        tr {
            grid-template-columns: 9.75em repeat(12, 1fr) 3em;
        }

        tr.isDoubleElim {
            grid-template-columns: 9.75em auto repeat(6, 1fr) auto repeat(6, 1fr) 3em;
        }
    }

    .zebraStripe {
        background: var(--zebra-stripe-color);
    }

    .video-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 0 4px;
    }

    .video-btn {
        background: transparent;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .video-btn:hover {
        background: var(--sep-color);
    }

    .play-btn {
        color: var(--red-team-color);
    }

    .add-btn {
        color: var(--blue-team-color);
    }
</style>
