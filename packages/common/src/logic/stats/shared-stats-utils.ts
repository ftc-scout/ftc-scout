import { Alliance } from "../Alliance";
import { Season } from "../Season";
import { Station } from "../Station";
import { TournamentLevel } from "../TournamentLevel";
import { Descriptor } from "../descriptors/descriptor";
import { OprData, calculateOpr } from "./calculate-opr";

export type AnyObject = Record<string, any>;

export type Match = {
    tournamentLevel: TournamentLevel;
    teams: TeamMatch[];
    scores: Score | { red: Score; blue: Score } | null;
};

export type TeamMatch = {
    matchId: number;
    teamNumber: number;
    alliance: Alliance;
    station: Station;
    surrogate: boolean;
    dq: boolean;
    onField: boolean;
};

export type Score = {
    matchId: number;
    alliance: Alliance;
    totalPoints: number;
    totalPointsNp: number;
} & Record<string, any>;

export type Tep = {
    season: Season;
    eventCode: string;
    teamNumber: number;
    isRemote: boolean;
    hasStats: boolean;
    rank: number;
    rp: number;
    tb1: number;
    tb2: number;
    wins: number;
    losses: number;
    ties: number;
    dqs: number;
    qualMatchesPlayed: number;
    tot: AnyObject;
    avg: AnyObject;
    min: AnyObject;
    max: AnyObject;
    dev: AnyObject;
    opr: AnyObject;
};

export const tot = (arr: number[]) => (arr.length == 0 ? null : arr.reduce((a, b) => a + b, 0));
export const avg = (arr: number[]) => (arr.length == 0 ? null : tot(arr)! / arr.length);
export const min = (arr: number[]) => (arr.length == 0 ? null : Math.min(...arr));
export const max = (arr: number[]) => (arr.length == 0 ? null : Math.max(...arr));
export const dev = (arr: number[]) => {
    if (arr.length == 0) return null;

    let a = avg(arr)!;
    let diffAvg = avg(arr.map((n) => (a - n) * (a - n)))!;
    return Math.sqrt(diffAvg);
};

export function determineWinner(red: Score, blue: Score): Alliance | null {
    if (red.totalPoints > blue.totalPoints) {
        return Alliance.Red;
    } else if (blue.totalPoints > red.totalPoints) {
        return Alliance.Blue;
    } else {
        return null;
    }
}

export function hasAllianceScores(scores: Match["scores"]): scores is { red: Score; blue: Score } {
    if (!scores || typeof scores !== "object") return false;
    return (
        "red" in scores &&
        "blue" in scores &&
        !!(scores as any).red &&
        !!(scores as any).blue &&
        (scores as any).red.totalPoints != null &&
        (scores as any).blue.totalPoints != null
    );
}

export function createEmptyTep<T extends Tep>(
    season: Season,
    eventCode: string,
    teamNumber: number,
    isRemote: boolean,
    emptyGroup: Record<string, any>,
    additionalFields?: Partial<T>
): T {
    return {
        season,
        eventCode,
        teamNumber,
        isRemote,
        hasStats: false,
        rank: 0,
        rp: 0,
        tb1: 0,
        tb2: 0,
        wins: 0,
        losses: 0,
        ties: 0,
        dqs: 0,
        qualMatchesPlayed: 0,
        tot: { ...emptyGroup },
        avg: { ...emptyGroup },
        min: { ...emptyGroup },
        max: { ...emptyGroup },
        dev: { ...emptyGroup },
        opr: { ...emptyGroup },
        ...additionalFields,
    } as T;
}

export function createEmptyGroup(descriptor: Descriptor): Record<string, any> {
    let emptyGroup = {} as Record<string, any>;
    for (let c of descriptor.tepColumns()) {
        emptyGroup[c.apiName] = 0;
    }
    return emptyGroup;
}

export function filterQualsMatches<T extends Match>(matches: T[], isRemote: boolean = false): T[] {
    return matches.filter(
        (m) =>
            m.tournamentLevel == TournamentLevel.Quals &&
            !!m.scores &&
            (isRemote || hasAllianceScores(m.scores))
    );
}

export function calculateGroupStats<T extends Tep, M extends Match>(
    matches: M[],
    teps: Record<number, T>,
    descriptor: Descriptor,
    remote: boolean,
    shouldInclude: (teamNumber: number, match: M) => boolean = () => true
) {
    let dataPoints = {} as Record<number, Record<string, number[]>>;
    for (let team of Object.keys(teps)) {
        dataPoints[+team] = {};
        for (let c of descriptor.tepColumns()) {
            dataPoints[+team][c.apiName] = [];
        }
    }

    for (let m of matches) {
        let allianceScores = {
            Red: hasAllianceScores(m.scores) ? m.scores.red : null,
            Blue: hasAllianceScores(m.scores) ? m.scores.blue : null,
            Solo: m.scores,
        } as Record<string, Score | null>;

        for (let t of m.teams) {
            if (t.surrogate) continue;
            if (!shouldInclude(t.teamNumber, m)) continue;
            let s = allianceScores[t.alliance];
            if (!s) continue;

            for (let c of descriptor.tepColumns()) {
                if (c.tradOnly && remote) continue;

                dataPoints[t.teamNumber][c.apiName].push(t.dq ? 0 : c.make(s, t.station));
            }
        }
    }

    for (let [team, data] of Object.entries(dataPoints)) {
        for (let [name, points] of Object.entries(data)) {
            teps[+team].tot[name] = tot(points);
            teps[+team].avg[name] = avg(points);
            teps[+team].min[name] = min(points);
            teps[+team].max[name] = max(points);
            teps[+team].dev[name] = dev(points);
        }
    }
}

export function calculateOprs<T extends Tep, M extends Match>(
    matches: M[],
    teps: Record<number, T>,
    isRemote: boolean,
    descriptor: Descriptor,
    shouldInclude: (teamNumber: number, match: M) => boolean = () => true,
    forceAverage: boolean = false
) {
    if (isRemote || forceAverage) {
        for (let [team, data] of Object.entries(teps)) {
            teps[+team].opr = data.avg;
        }
        return;
    }

    let dataPoints = {} as Record<string, OprData[]>;
    for (let c of descriptor.tepColumns()) {
        dataPoints[c.apiName] = [];

        if (c.isIndividual) {
            for (let [team, data] of Object.entries(teps)) {
                teps[+team].opr[c.apiName] = data.avg[c.apiName];
            }
        }
    }

    for (let m of matches) {
        if (!hasAllianceScores(m.scores)) continue;

        for (let a of [Alliance.Red, Alliance.Blue]) {
            let allianceTeams = m.teams.filter(
                (t) => t.alliance == a && shouldInclude(t.teamNumber, m)
            );
            if (allianceTeams.length != 2) continue;
            let [team1, team2] = allianceTeams.map((t) => t.teamNumber);
            let s = a == Alliance.Red ? m.scores.red : m.scores.blue;
            for (let c of descriptor.tepColumns()) {
                if (c.isIndividual) continue;
                dataPoints[c.apiName].push({ team1, team2, result: c.make(s, Station.One) });
            }
        }
    }

    for (let [name, data] of Object.entries(dataPoints)) {
        let oprs = calculateOpr(data);
        for (let [team, opr] of Object.entries(oprs)) {
            teps[+team].opr[name] = opr;
        }
    }
}

export function calculateRp<T extends Tep>(
    stats: T,
    descriptor: Descriptor,
    matchesUsed: number = stats.qualMatchesPlayed
): number {
    if (matchesUsed == 0) return 0;

    switch (descriptor.rankings.rp) {
        case "TotalPoints":
            return (stats.tot.totalPoints ?? 0) / matchesUsed;
        case "Record":
            return (2 * stats.wins + stats.ties) / matchesUsed;
        case "DecodeRP":
            return (
                (3 * stats.wins +
                    stats.ties +
                    (stats.tot.movementRp ?? 0) +
                    (stats.tot.goalRp ?? 0) +
                    (stats.tot.patternRp ?? 0)) /
                matchesUsed
            );
    }
}

export function calculateTiebreakers<T extends Tep>(
    stats: T,
    descriptor: Descriptor
): { tb1: number; tb2: number } {
    switch (descriptor.rankings.tb) {
        case "AutoEndgameTot":
        case "AutoEndgameAvg":
            return {
                tb1: stats.avg.autoPoints ?? 0,
                tb2: stats.avg.egPoints ?? 0,
            };
        case "AutoAscentAvg":
            return {
                tb1: stats.avg.autoPoints ?? 0,
                tb2: stats.avg.dcParkPoints ?? 0,
            };
        case "AvgNpBase":
            return {
                tb1: stats.avg.totalPointsNp ?? 0,
                tb2: stats.avg.dcBasePoints ?? 0,
            };
        default:
            return { tb1: 0, tb2: 0 };
    }
}

// Calculate losing score tiebreaker
export type LosingScoreResult = Record<number, { sum: number; denom: number }>;

export function calcLosingScoreTb<T extends Tep, M extends Match>(
    teps: Record<number, T>,
    matches: M[],
    shouldInclude: (teamNumber: number, match: M) => boolean = () => true
): LosingScoreResult {
    let scoresByTeam = {} as Record<number, number[]>;
    for (let team of Object.keys(teps)) {
        scoresByTeam[+team] = [];
    }

    for (let m of matches) {
        if (!hasAllianceScores(m.scores)) continue;
        let lowestScore = Math.min(m.scores.red.totalPointsNp, m.scores.blue.totalPointsNp);

        for (let t of m.teams) {
            if (t.surrogate) continue;
            if (!shouldInclude(t.teamNumber, m)) continue;

            scoresByTeam[t.teamNumber].push(t.dq ? 0 : lowestScore);
        }
    }

    let results: LosingScoreResult = {};
    for (let team of Object.keys(teps)) {
        let scores = scoresByTeam[+team].sort((a, b) => b - a);

        let denom: number;
        if (scores.length == 5 || scores.length == 6) {
            denom = scores.length - 1;
        } else if (scores.length >= 7) {
            denom = scores.length - 2;
        } else {
            denom = scores.length;
        }

        let usable = scores.slice(0, Math.min(scores.length, denom));
        let sum = usable.reduce((a, b) => a + b, 0);
        results[+team] = { sum, denom };
    }

    return results;
}
