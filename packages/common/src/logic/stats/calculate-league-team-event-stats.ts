import { Season } from "../Season";
import { Descriptor } from "../descriptors/descriptor";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import {
    type Tep,
    type LosingScoreResult,
    createEmptyTep,
    createEmptyGroup,
    filterQualsMatches,
    calculateGroupStats,
    calculateOprs,
    calculateRp,
    calculateTiebreakers,
    calcLosingScoreTb,
    determineWinner,
    hasAllianceScores,
} from "./shared-stats-utils";
import type { FrontendMatch as BaseFrontendMatch } from "./calculate-team-event-stats";

export type LeagueFrontendMatch = BaseFrontendMatch & {
    id: number;
    eventCode: string;
};

type LeagueTep = Tep & {
    avgRp: number;
    emptyMatchesPlayed: number;
};

type IncludePredicate = (teamNumber: number, match: LeagueFrontendMatch) => boolean;

export type TeamEventStatsOptions = {
    includeMatch?: IncludePredicate;
    forceAverageOpr?: boolean;
};

export function calculateLeagueTeamEventStats(
    season: Season,
    eventCode: string,
    isRemote: boolean,
    matches: LeagueFrontendMatch[],
    teams: number[],
    options: TeamEventStatsOptions = {}
): LeagueTep[] {
    matches = filterQualsMatches(matches, isRemote);

    let descriptor = DESCRIPTORS[season];
    let includeMatch = options.includeMatch ?? (() => true);
    let forceAverageOpr = options.forceAverageOpr ?? false;

    let emptyGroup = createEmptyGroup(descriptor);

    let teps = {} as Record<number, LeagueTep>;
    teams.forEach(
        (t) =>
            (teps[t] = createEmptyTep<LeagueTep>(season, eventCode, t, isRemote, emptyGroup, {
                avgRp: 0,
                emptyMatchesPlayed: 0,
            }))
    );

    (isRemote ? calculateRemoteMatchesPlayed : calculateRecords)(matches, teps, includeMatch);
    calculateGroupStats(matches, teps, descriptor, isRemote, includeMatch);
    calculateOprs(matches, teps, isRemote, descriptor, includeMatch, forceAverageOpr);
    calculateRanks(teps, matches, descriptor, includeMatch);

    return Object.values(teps);
}

function calculateRecords(
    matches: LeagueFrontendMatch[],
    teps: Record<number, LeagueTep>,
    include: IncludePredicate
) {
    for (let m of matches) {
        if (!hasAllianceScores(m.scores)) continue;
        let red = m.scores.red;
        let blue = m.scores.blue;
        let winningAlliance = determineWinner(red, blue);

        for (let t of m.teams) {
            if (t.surrogate) continue;
            if (!include(t.teamNumber, m)) continue;

            let r = teps[t.teamNumber];
            if (!r) continue;

            r.qualMatchesPlayed++;
            r.hasStats = true;
            if (t.dq) {
                r.dqs++;
                r.losses++;
                continue;
            }
            if (t.alliance == winningAlliance) {
                r.wins++;
            } else if (winningAlliance == null) {
                r.ties++;
            } else {
                r.losses++;
            }
        }
    }

    for (let t of Object.values(teps)) {
        for (let i = 1; i <= 10; i++) {
            if (!include(t.teamNumber, { eventCode: "filler", id: i } as LeagueFrontendMatch))
                continue;
            t.emptyMatchesPlayed++;
        }
    }
}

function calculateRemoteMatchesPlayed(
    matches: LeagueFrontendMatch[],
    teps: Record<number, LeagueTep>,
    include: IncludePredicate
) {
    for (let m of matches) {
        let t = m.teams[0];
        if (t.onField && include(t.teamNumber, m)) {
            teps[t.teamNumber].qualMatchesPlayed++;
            teps[t.teamNumber].hasStats = true;
        }
    }
}

type RankAverages = {
    rp: number;
    tb1: number;
    tb2: number;
};

function calculateRanks(
    teps: Record<number, LeagueTep>,
    matches: LeagueFrontendMatch[],
    descriptor: Descriptor,
    include: IncludePredicate
) {
    let rankAverages: Record<number, RankAverages> = {};
    for (let team of Object.keys(teps)) {
        rankAverages[+team] = { rp: 0, tb1: 0, tb2: 0 };
    }

    const recordRankSum = (stats: LeagueTep, field: keyof RankAverages) => {
        let value: number | null | undefined;
        switch (field) {
            case "rp":
                value = stats.rp;
                break;
            case "tb1":
                value = stats.tb1;
                break;
            case "tb2":
                value = stats.tb2;
                break;
        }
        let average = Number.isFinite(value ?? NaN) ? value ?? 0 : 0;
        rankAverages[stats.teamNumber][field] = average ?? 0;
    };

    const setTieBreakers = (
        stats: LeagueTep,
        tb1: number | null | undefined,
        tb2: number | null | undefined
    ) => {
        stats.tb1 = tb1 ?? 0;
        stats.tb2 = tb2 ?? 0;
        recordRankSum(stats, "tb1");
        recordRankSum(stats, "tb2");
    };

    for (let stats of Object.values(teps)) {
        if (!stats.hasStats) continue;

        let matchesUsed = (stats.qualMatchesPlayed ?? 0) + (stats.emptyMatchesPlayed ?? 0);
        stats.rp = calculateRp(stats, descriptor, matchesUsed);
        recordRankSum(stats, "rp");
    }

    let losingScoreTotals: LosingScoreResult | null = null;
    const applyLosingScore = (stats: LeagueTep) => {
        if (!losingScoreTotals) {
            losingScoreTotals = calcLosingScoreTb(teps, matches, include);
        }
        let totals = losingScoreTotals[stats.teamNumber];
        let sum = totals?.sum ?? 0;
        let denom = totals?.denom ?? 0;
        stats.tb1 = denom == 0 ? 0 : sum / denom;
        stats.tb2 = 0;
        rankAverages[stats.teamNumber].tb1 = sum;
        rankAverages[stats.teamNumber].tb2 = 0;
    };

    for (let stats of Object.values(teps)) {
        if (!stats.hasStats) continue;

        if (descriptor.rankings.tb === "LosingScore") {
            applyLosingScore(stats);
        } else {
            let { tb1, tb2 } = calculateTiebreakers(stats, descriptor);
            setTieBreakers(stats, tb1, tb2);
        }
    }

    let ranked = Object.entries(teps).sort(([teamA], [teamB]) =>
        compareRank(+teamA, +teamB, rankAverages)
    );

    for (let rank = 0; rank < ranked.length; rank++) {
        teps[+ranked[rank][0]].rank = rank + 1;
    }
}

function compareRank(teamA: number, teamB: number, rankAverages: Record<number, RankAverages>) {
    let a = rankAverages[teamA];
    let b = rankAverages[teamB];

    let rpDiff = b.rp - a.rp;
    if (rpDiff !== 0) return rpDiff;

    let tb1Diff = b.tb1 - a.tb1;
    if (tb1Diff !== 0) return tb1Diff;

    let tb2Diff = b.tb2 - a.tb2;
    if (tb2Diff !== 0) return tb2Diff;

    return 0;
}
