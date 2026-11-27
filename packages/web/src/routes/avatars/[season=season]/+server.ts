import { error, json } from "@sveltejs/kit";
import { FIRST_SEASON_WITH_AVATARS, MAX_AVATARS_PER_REQUEST } from "$lib/constants";
import type { RequestHandler } from "./$types";

const AVATAR_RULE = /\.team-(\d+)\s*\{\s*background-image:\s*url\("[^"]*\/\1_([^"/]+)"\)/g;
const MAX_AGE_MS = 6 * 60 * 60 * 1000;
const RETRY_AFTER_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 10 * 1000;

type LogoIds = ReadonlyMap<string, string>;

interface SeasonLogos {
    ids: LogoIds | null;
    refreshAfter: number;
    refreshing: Promise<void> | null;
}

const cache = new Map<number, SeasonLogos>();

async function fetchLogoIds(season: number): Promise<LogoIds> {
    let url = `https://ftc-scoring.firstinspires.org/avatars/composed/${season + 1}.css`;
    let response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!response.ok) throw new Error(`Could not load team avatars: ${response.status}`);

    let css = await response.text();
    return new Map([...css.matchAll(AVATAR_RULE)].map(([, number, id]) => [number, id]));
}

async function refresh(season: number, logos: SeasonLogos) {
    try {
        let ids = await fetchLogoIds(season);
        if (!ids.size && logos.ids?.size) throw new Error("The team avatar list came back empty.");
        logos.ids = ids;
        logos.refreshAfter = Date.now() + MAX_AGE_MS;
    } catch (e) {
        logos.refreshAfter = Date.now() + RETRY_AFTER_MS;
        console.error(e);
    } finally {
        logos.refreshing = null;
    }
}

async function getLogoIds(season: number): Promise<LogoIds | null> {
    let logos = cache.get(season);
    if (!logos) {
        logos = { ids: null, refreshAfter: 0, refreshing: null };
        cache.set(season, logos);
    }

    if (!logos.refreshing && Date.now() >= logos.refreshAfter) {
        logos.refreshing = refresh(season, logos);
    }
    if (!logos.ids) {
        await logos.refreshing;
    }

    return logos.ids;
}

export const GET: RequestHandler = async ({ params, url, setHeaders }) => {
    let season = +params.season;
    let teams = url.searchParams.get("teams")?.split(",") ?? [];
    if (
        !teams.length ||
        teams.length > MAX_AVATARS_PER_REQUEST ||
        !teams.every((t) => /^\d{1,6}$/.test(t))
    ) {
        throw error(400, `Pass 1 to ${MAX_AVATARS_PER_REQUEST} team numbers  as ?teams=1,2,3`);
    }

    let ids = season < FIRST_SEASON_WITH_AVATARS ? new Map() : await getLogoIds(season);
    if (!ids) throw error(503, "Team logos are unavailable.");

    let found: Record<string, string> = {};
    for (let team of teams) {
        let id = ids.get(team);
        if (id) found[team] = id;
    }

    setHeaders({ "cache-control": `public, max-age=${MAX_AGE_MS / 1000}` });
    return json(found);
};
