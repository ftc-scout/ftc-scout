import { Alliance } from "../Alliance";
import { Season } from "../Season";
import { Station } from "../Station";
import { TournamentLevel } from "../TournamentLevel";
import { AnyObject, Descriptor, desGqlName } from "../descriptors/descriptor";
import { DESCRIPTORS } from "../descriptors/descriptor-list";
import { OprData, calculateOpr } from "./calculate-opr";

type Match = {
    tournamentLevel: TournamentLevel;
    teams: Tmp[];
    scores: Score[];
};

type Tmp = {
    matchId: number;
    teamNumber: number;
    alliance: Alliance;
    station: Station;
    surrogate: boolean;
    dq: boolean;
    onField: boolean;
};

type Score = {
    matchId: number;
    alliance: Alliance;
    totalPoints: number;
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

export function calculateTeamEventStats(
    season: Season,
    eventCode: string,
    isRemote: boolean,
    matches: Match[],
    teams: number[]
): Tep[] {
    matches = filterMatches(matches);

    let descriptor = DESCRIPTORS[season];

    let emptyGroup = {} as Record<string, any>;
    for (let c of descriptor.columns) {
        if (c.tep == undefined) continue;

        let name = desGqlName(c, isRemote);
        emptyGroup[name] = 0;
        if (c.tep.individual != undefined) emptyGroup[name + "Individual"] = 0;
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

    (isRemote ? calculateRemoteMatchesPlayed : calculateRecords)(matches, teps);
    calculateGroupStats(matches, teps, descriptor, isRemote);
    calculateOprs(matches, teps, isRemote, descriptor);
    calculateRanks(teps, descriptor);

    return Object.values(teps);
}

function filterMatches(matches: Match[]): Match[] {
    return matches.filter((m) => m.tournamentLevel == TournamentLevel.Quals && m?.scores?.length);
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

function calculateRecords(matches: Match[], teps: Record<number, Tep>) {
    for (let m of matches) {
        let red = m.scores.find((m) => m.alliance == Alliance.Red)!;
        let blue = m.scores.find((m) => m.alliance == Alliance.Blue)!;
        let winningAlliance = winner(red, blue);

        for (let t of m.teams) {
            if (t.surrogate) continue;

            let r = teps[t.teamNumber];
            r.qualMatchesPlayed++;
            r.hasStats = true;
            if (t.alliance == winningAlliance) {
                r.wins++;
            } else if (winningAlliance == null) {
                r.ties++;
            } else {
                r.losses++;
            }
            if (t.dq) r.dqs++;
        }
    }
}

function calculateRemoteMatchesPlayed(matches: Match[], teps: Record<number, Tep>) {
    for (let m of matches) {
        let t = m.teams[0];
        if (t.onField) {
            teps[t.teamNumber].qualMatchesPlayed++;
            teps[t.teamNumber].hasStats = true;
        }
    }
}

const tot = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const avg = (arr: number[]) => (arr.length == 0 ? 0 : tot(arr) / arr.length);
const min = (arr: number[]) => (arr.length == 0 ? 0 : Math.min(...arr));
const max = (arr: number[]) => (arr.length == 0 ? 0 : Math.max(...arr));
const dev = (arr: number[]) => {
    let a = avg(arr);
    let diffAvg = avg(arr.map((n) => (a - n) * (a - n)));
    return Math.sqrt(diffAvg);
};

function getStat(s: AnyObject, c: Descriptor["columns"][number], remote: boolean): any {
    let name = desGqlName(c, remote);
    if (name in s) {
        return s[name];
    } else if (c.tep?.fromSelf != undefined) {
        return c.tep.fromSelf(s);
    } else {
        throw `Can't get stat ${c.name}`;
    }
}

function calculateGroupStats(
    matches: Match[],
    teps: Record<number, Tep>,
    descriptor: Descriptor,
    isRemote: boolean
) {
    let dataPoints = {} as Record<number, Record<string, number[]>>;
    for (let team of Object.keys(teps)) {
        dataPoints[+team] = {};
        for (let c of descriptor.columns) {
            if (c.tep == undefined) continue;
            let name = desGqlName(c, isRemote);
            dataPoints[+team][name] = [];
            if (c.tep.individual != undefined) dataPoints[+team][name + "Individual"] = [];
        }
    }

    for (let m of matches) {
        let allianceScores = {
            Red: m.scores.find((s) => s.alliance == Alliance.Red),
            Blue: m.scores.find((s) => s.alliance == Alliance.Blue),
            Solo: m.scores.find((s) => s.alliance == Alliance.Solo),
        };

        for (let t of m.teams) {
            if (t.surrogate) continue;
            let s = allianceScores[t.alliance]!;

            for (let c of descriptor.columns) {
                if (c.tep == undefined) continue;
                let name = desGqlName(c, isRemote);
                dataPoints[t.teamNumber][name].push(getStat(s, c, isRemote));
                if (c.tep.individual != undefined) {
                    let arr = dataPoints[t.teamNumber][name + "Individual"];
                    if (t.station == Station.One) {
                        arr.push(c.tep.individual.first(s));
                    } else if (t.station == Station.Two) {
                        arr.push(c.tep.individual.second(s));
                    } else if (t.station == Station.Solo) {
                        arr.push(getStat(s, c, isRemote));
                    }
                }
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
    matches: Match[],
    teps: Record<number, Tep>,
    isRemote: boolean,
    descriptor: Descriptor
) {
    if (isRemote) {
        for (let [team, data] of Object.entries(teps)) {
            teps[+team].opr = data.avg;
        }
        return;
    }

    let dataPoints = {} as Record<string, OprData[]>;
    for (let c of descriptor.columns) {
        if (c.tep == undefined) continue;
        dataPoints[c.name] = [];

        if (c.tep.individual != undefined) {
            for (let [team, data] of Object.entries(teps)) {
                teps[+team].opr[c.name + "Individual"] = data.avg[c.name];
            }
        }
    }

    for (let m of matches) {
        for (let a of [Alliance.Red, Alliance.Blue]) {
            let [team1, team2] = m.teams.filter((t) => t.alliance == a).map((t) => t.teamNumber);
            let s = m.scores.find((s) => s.alliance == a)!;
            for (let c of descriptor.columns) {
                if (c.tep == undefined) continue;
                dataPoints[c.name].push({ team1, team2, result: getStat(s, c, false) });
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

function calculateRanks(teps: Record<number, Tep>, descriptor: Descriptor) {
    for (let stats of Object.values(teps)) {
        if (!stats.hasStats) continue;

        switch (descriptor.rankings.rp) {
            case "TotalPoints":
                stats.rp = stats.tot.totalPoints;
                break;
            case "Record":
                stats.rp = (2 * stats.wins + 2 * stats.ties) / stats.qualMatchesPlayed;
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
            case "AutoEndgameAvg":
                stats.tb1 = stats.avg.autoPoints;
                stats.tb2 = stats.avg.egPoints;
                break;
            case "LosingScore":
                // TODO: actually implement skystone tb
                stats.tb1 = 0;
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
