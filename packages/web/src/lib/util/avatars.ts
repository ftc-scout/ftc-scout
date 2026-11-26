import { browser } from "$app/environment";
import { get, readable, writable, type Readable, type Writable } from "svelte/store";
import { FIRST_SEASON_WITH_AVATARS, MAX_AVATARS_PER_REQUEST } from "$lib/constants";

const BATCH_DELAY_MS = 50;
const REMEMBER_MS = 6 * 60 * 60 * 1000;
const STORAGE_KEY = "ftc-scout:avatars:";

type Logo = { id: string | null; expires: number };
type Logos = Readonly<Record<number, Logo>>;

interface SeasonLogos {
    known: Writable<Logos>;
    queued: Set<number>;
    pending: Set<number>;
}

const NO_LOGOS: Readable<Logos> = readable({});
const cache = new Map<number, SeasonLogos>();

function restore(season: number): Logos {
    try {
        let saved: Logos = JSON.parse(localStorage.getItem(STORAGE_KEY + season) ?? "{}");
        return Object.fromEntries(
            Object.entries(saved).filter(([, logo]) => logo.expires > Date.now())
        );
    } catch {
        return {};
    }
}

function save(season: number, logos: Logos) {
    try {
        localStorage.setItem(STORAGE_KEY + season, JSON.stringify(logos));
    } catch {}
}

function getSeason(season: number): SeasonLogos {
    let logos = cache.get(season);
    if (!logos) {
        logos = { known: writable(restore(season)), queued: new Set(), pending: new Set() };
        cache.set(season, logos);
    }
    return logos;
}

async function fetchBatch(season: number, teams: number[]) {
    let logos = getSeason(season);
    try {
        let response = await fetch(`/avatars/${season}?teams=${teams.join(",")}`);
        if (!response.ok) throw new Error(`Could not load team avatars: ${response.status}`);
        let ids: Record<number, string> = await response.json();

        let expires = Date.now() + REMEMBER_MS;
        logos.known.update((known) => {
            let next = { ...known };
            for (let team of teams) next[team] = { id: ids[team] ?? null, expires };
            save(season, next);
            return next;
        });
    } catch (e) {
        console.warn(e);
    } finally {
        for (let team of teams) logos.pending.delete(team);
    }
}

function flush(season: number) {
    let logos = getSeason(season);
    let teams = [...logos.queued].sort((a, b) => a - b);
    logos.queued.clear();

    for (let i = 0; i < teams.length; i += MAX_AVATARS_PER_REQUEST) {
        fetchBatch(season, teams.slice(i, i + MAX_AVATARS_PER_REQUEST));
    }
}

export function teamLogos(season: number): Readable<Logos> {
    if (!browser || season < FIRST_SEASON_WITH_AVATARS) return NO_LOGOS;
    return getSeason(season).known;
}

export function requestTeamLogo(season: number, team: number) {
    if (!browser || season < FIRST_SEASON_WITH_AVATARS) return;

    let logos = getSeason(season);
    if (logos.pending.has(team) || get(logos.known)[team]?.expires > Date.now()) return;

    if (!logos.queued.size) setTimeout(() => flush(season), BATCH_DELAY_MS);
    logos.queued.add(team);
    logos.pending.add(team);
}

export function teamLogoUrl(season: number, team: number, id: string): string {
    return `https://event-portal.firstinspires.org/ftc/${
        season + 1
    }/avatars/composed/${team}_${id}`;
}
