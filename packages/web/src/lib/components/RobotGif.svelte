<script lang="ts" context="module">
    // FTCVideos.org makes a GIF of a team's robot out of its match videos. The GIF links to the
    // team's matches on FTCVideos. See https://ftcvideos.org/APIs.md
    const FTC_VIDEOS = "https://ftcvideos.org";
    const TIMEOUT_MS = 5000;

    type Robot = { gif: string; pageUrl: string };

    async function findRobot(season: number, team: number): Promise<Robot | null> {
        let params = new URLSearchParams({ season: "" + season, team: "" + team });
        let controller = new AbortController();
        let timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
        try {
            let res = await fetch(`${FTC_VIDEOS}/api/v1/robot?${params}`, {
                signal: controller.signal,
            });
            if (!res.ok) return null;
            let robot = await res.json();
            let fromFtcVideos = (url: unknown) =>
                typeof url == "string" && url.startsWith(`${FTC_VIDEOS}/`);
            return fromFtcVideos(robot?.gif) && fromFtcVideos(robot?.pageUrl) ? robot : null;
        } catch {
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }
</script>

<script lang="ts">
    export let season: number;
    export let team: number;

    let robot: Robot | null = null;

    $: load(season, team);

    async function load(s: number, t: number) {
        robot = null;
        let found = await findRobot(s, t);
        if (s == season && t == team) robot = found;
    }
</script>

{#if robot}
    <a
        class="robot"
        href={robot.pageUrl}
        target="_blank"
        rel="noreferrer"
        title="Robot of {team} on FTCVideos.org"
    >
        <img src={robot.gif} alt="Robot of team {team}" />
        <span>FTCVideos.org</span>
    </a>
{/if}

<style>
    .robot {
        float: right;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--sm-gap);
        margin-left: var(--lg-gap);
        color: inherit;
        font-size: var(--sm-font-size);
        text-decoration: none;
    }

    img {
        width: 160px;
        height: 160px;
        border-radius: 8px;
        object-fit: cover;
    }

    @media (max-width: 500px) {
        img {
            width: 96px;
            height: 96px;
        }
    }
</style>
