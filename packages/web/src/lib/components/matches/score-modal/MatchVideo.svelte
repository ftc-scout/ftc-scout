<script lang="ts" context="module">
    // FTCVideos.org cuts the matches out of event livestreams. Its player shows one match and links
    // back to FTCVideos. See https://ftcvideos.org/APIs.md
    const FTC_VIDEOS = "https://ftcvideos.org";
    const TIMEOUT_MS = 5000;

    type MatchKey = {
        season: number;
        eventCode: string;
        tournamentLevel: string;
        series: number;
        matchNum: number;
    };

    async function findVideo(match: MatchKey): Promise<string | null> {
        let params = new URLSearchParams({
            season: "" + match.season,
            event: match.eventCode,
            level: match.tournamentLevel,
            series: "" + match.series,
            number: "" + match.matchNum,
        });
        let controller = new AbortController();
        let timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
            let res = await fetch(`${FTC_VIDEOS}/api/v1/match?${params}`, {
                signal: controller.signal,
            });
            if (!res.ok) return null;
            let found = await res.json();
            let url = found?.video ? found.embedUrl : null;
            return typeof url == "string" && url.startsWith(`${FTC_VIDEOS}/`) ? url : null;
        } catch {
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }
</script>

<script lang="ts">
    import type { FullMatchFragment } from "../../../graphql/generated/graphql-operations";

    export let match: FullMatchFragment;

    let embedUrl: string | null = null;

    $: load(match);

    async function load(m: FullMatchFragment) {
        embedUrl = null;
        // remote matches have one team and no video
        if (m.teams.length < 4) return;
        let url = await findVideo(m);
        if (m == match) embedUrl = url;
    }
</script>

{#if embedUrl}
    <div class="video">
        <iframe
            src={embedUrl}
            title="Video of match {match.description}"
            allow="autoplay; encrypted-media"
            loading="lazy"
        />
    </div>
{/if}

<style>
    .video {
        width: 100%;
        max-width: 800px;
        margin: 0 auto var(--lg-gap);
    }

    iframe {
        display: block;
        width: 100%;
        /* 16:9 video and 36px of controls below it */
        aspect-ratio: 16 / 10;
        border: none;
        border-radius: 8px;
    }
</style>
