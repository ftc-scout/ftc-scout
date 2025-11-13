import { Alliance } from "../Alliance";
import { Season } from "../Season";
import { Station } from "../Station";
import { TournamentLevel } from "../TournamentLevel";
import { Descriptor } from "../descriptors/descriptor";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import { OprData, calculateOpr } from "./calculate-opr";
import type { FrontendMatch as BaseFrontendMatch } from "./calculate-team-event-stats";

type AnyObject = Record<string, any>;

export type LeagueFrontendMatch = BaseFrontendMatch & {
    id: number;
    eventCode: string;
};

type Score = {
    matchId: number;
    alliance: Alliance;
    totalPoints: number;
    totalPointsNp: number;
} & Record<string, any>;

type Tep = {
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
): Tep[] {
    matches = filterMatches(matches, isRemote);

    let descriptor = DESCRIPTORS[season];
    let includeMatch = options.includeMatch ?? (() => true);
    let forceAverageOpr = options.forceAverageOpr ?? false;

    let emptyGroup = {} as Record<string, any>;
    for (let c of descriptor.tepColumns()) {
        emptyGroup[c.apiName] = 0;
    }

    let teps = {} as Record<number, Tep>;
    teams.forEach(
        (t) =>
            (teps[t] = {
                season: season,
                eventCode,
                teamNumber: t,
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
            })
    );

    (isRemote ? calculateRemoteMatchesPlayed : calculateRecords)(matches, teps, includeMatch);
    calculateGroupStats(matches, teps, descriptor, isRemote, includeMatch);
    calculateOprs(matches, teps, isRemote, descriptor, includeMatch, forceAverageOpr);
    calculateRanks(teps, matches, descriptor, includeMatch);

    return Object.values(teps);
}

function filterMatches(matches: LeagueFrontendMatch[], isRemote: boolean): LeagueFrontendMatch[] {
    return matches.filter(
        (m) =>
            m.tournamentLevel == TournamentLevel.Quals &&
            !!m.scores &&
            (isRemote || hasAllianceScores(m.scores))
    );
}

function hasAllianceScores(
    scores: LeagueFrontendMatch["scores"]
): scores is { red: Score; blue: Score } {
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

function winner(red: Score, blue: Score): Alliance | null {
    if (red.totalPoints > blue.totalPoints) {
        return Alliance.Red;
    } else if (blue.totalPoints > red.totalPoints) {
        return Alliance.Blue;
    } else {
        return null;
    }
}

function calculateRecords(
    matches: LeagueFrontendMatch[],
    teps: Record<number, Tep>,
    include: IncludePredicate
) {
    for (let m of matches) {
        if (!hasAllianceScores(m.scores)) continue;
        let red = m.scores.red;
        let blue = m.scores.blue;
        let winningAlliance = winner(red, blue);

        for (let t of m.teams) {
            if (t.surrogate) continue;
            if (!include(t.teamNumber, m)) continue;

            let r = teps[t.teamNumber];
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
}

function calculateRemoteMatchesPlayed(
    matches: LeagueFrontendMatch[],
    teps: Record<number, Tep>,
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

const tot = (arr: number[]) => (arr.length == 0 ? null : arr.reduce((a, b) => a + b, 0));
const avg = (arr: number[]) => (arr.length == 0 ? null : tot(arr)! / arr.length);
const min = (arr: number[]) => (arr.length == 0 ? null : Math.min(...arr));
const max = (arr: number[]) => (arr.length == 0 ? null : Math.max(...arr));
const dev = (arr: number[]) => {
    if (arr.length == 0) return null;

    let a = avg(arr)!;
    let diffAvg = avg(arr.map((n) => (a - n) * (a - n)))!;
    return Math.sqrt(diffAvg);
};

function calculateGroupStats(
    matches: LeagueFrontendMatch[],
    teps: Record<number, Tep>,
    descriptor: Descriptor,
    remote: boolean,
    include: IncludePredicate
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
            Red: m.scores!.red,
            Blue: m.scores!.blue,
            Solo: m.scores,
        } as Record<string, Score | null>;

        for (let t of m.teams) {
            if (t.surrogate) continue;
            if (!include(t.teamNumber, m)) continue;
            let s = allianceScores[t.alliance]!;

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

function calculateOprs(
    matches: LeagueFrontendMatch[],
    teps: Record<number, Tep>,
    isRemote: boolean,
    descriptor: Descriptor,
    include: IncludePredicate,
    forceAverage: boolean
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
        for (let a of [Alliance.Red, Alliance.Blue]) {
            let allianceTeams = m.teams.filter((t) => t.alliance == a && include(t.teamNumber, m));
            if (allianceTeams.length != 2) continue;
            let [team1, team2] = allianceTeams.map((t) => t.teamNumber);
            let s = a == Alliance.Red ? m.scores!.red : m.scores!.blue;
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

function calculateRanks(
    teps: Record<number, Tep>,
    matches: LeagueFrontendMatch[],
    descriptor: Descriptor,
    include: IncludePredicate
) {
    for (let stats of Object.values(teps)) {
        if (!stats.hasStats) continue;

        switch (descriptor.rankings.rp) {
            case "TotalPoints":
                stats.rp = stats.tot.totalPoints;
                break;
            case "Record":
                stats.rp =
                    stats.qualMatchesPlayed == 0
                        ? 0
                        : (2 * stats.wins + stats.ties) / stats.qualMatchesPlayed;
                break;
            case "DecodeRP":
                stats.rp =
                    stats.qualMatchesPlayed == 0
                        ? 0
                        : (3 * stats.wins +
                              stats.ties +
                              stats.tot.movementRp +
                              stats.tot.goalRp +
                              stats.tot.patternRp) /
                          stats.qualMatchesPlayed;
                break;
        }
    }

    for (let stats of Object.values(teps)) {
        if (!stats.hasStats) continue;

        switch (descriptor.rankings.tb) {
            case "AutoEndgameTot":
                stats.tb1 = stats.tot.autoPoints;
                stats.tb2 = stats.tot.egPoints;
                break;
            case "AutoAscentAvg":
                stats.tb1 = stats.avg.autoPoints;
                stats.tb2 = stats.avg.dcParkPoints;
                break;
            case "AutoEndgameAvg":
                stats.tb1 = stats.avg.autoPoints;
                stats.tb2 = stats.avg.egPoints;
                break;
            case "LosingScore":
                calcLosingScoreTb(teps, matches, include);
                break;
            case "AvgNpBase":
                stats.tb1 = stats.avg.totalPointsNp;
                stats.tb2 = stats.avg.dcBasePoints;
                break;
        }
    }

    let ranked = Object.entries(teps)
        .filter(([_, s]) => s.hasStats)
        .sort(([_1, s1], [_2, s2]) => s2.tb2 - s1.tb2)
        .sort(([_1, s1], [_2, s2]) => s2.tb1 - s1.tb1)
        .sort(([_1, s1], [_2, s2]) => s2.rp - s1.rp);

    for (let rank = 0; rank < ranked.length; rank++) {
        teps[+ranked[rank][0]].rank = rank + 1;
    }
}

function calcLosingScoreTb(
    teps: Record<number, Tep>,
    matches: LeagueFrontendMatch[],
    include: IncludePredicate
) {
    let tbs = {} as Record<number, number[]>;
    for (let team of Object.keys(teps)) {
        tbs[+team] = [];
    }

    for (let m of matches) {
        if (!hasAllianceScores(m.scores)) continue;
        let lowestScore = Math.min(m.scores.red.totalPointsNp, m.scores.blue.totalPointsNp);

        for (let t of m.teams) {
            if (t.surrogate) continue;
            if (!include(t.teamNumber, m)) continue;

            tbs[t.teamNumber].push(t.dq ? 0 : lowestScore);
        }
    }

    for (let team of Object.keys(teps)) {
        let scores = tbs[+team].sort((a, b) => b - a);

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

        teps[+team].tb1 = denom == 0 ? 0 : sum / denom;
        teps[+team].tb2 = 0;
    }
}
