import { Match } from "../db/entities/Match";
import { MatchScores2020 } from "../db/entities/MatchScores2020";
import { TeamEventParticipation2020 } from "../db/entities/team-event-participation/TeamEventParticipation2020";
import { TepStats2020 } from "../db/entities/team-event-participation/TepStats2020";
import { Alliance } from "../db/entities/types/Alliance";
import { Station, stationIsBlue, stationIsRed } from "../db/entities/types/Station";
import { TournamentLevel } from "../db/entities/types/TournamentLevel";
import { Season } from "../ftc-api/types/Season";
import { calculateOPR, OprData } from "./calculate-opr";

const total = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const average = (arr: number[]) => (arr.length == 0 ? 0 : total(arr) / arr.length);
const minimum = (arr: number[]) => (arr.length == 0 ? 0 : Math.min(...arr));
const maximum = (arr: number[]) => (arr.length == 0 ? 0 : Math.max(...arr));
const standardDeviation = (arr: number[]) => {
    let avg = average(arr);
    let diffAvg = average(arr.map((n) => (avg - n) * (avg - n)));
    return Math.sqrt(diffAvg);
};

export function calculateEventStatistics2020(
    eventSeason: Season,
    eventCode: string,
    teams: number[],
    matches: Match[],
    isRemote: boolean
): TeamEventParticipation2020[] {
    let participations: Record<number, TeamEventParticipation2020> = {};

    if (!isRemote) {
        teams.forEach((team) => {
            let [wins, losses, ties, dq, qualMatchesPlayed] = calculateWLTDq(team, matches);

            let tep = TeamEventParticipation2020.create({
                eventSeason,
                eventCode,
                teamNumber: team,
                isRemote: false,
                wins,
                losses,
                ties,
                dq,
                qualMatchesPlayed,
                hasStats: !!qualMatchesPlayed,
                tot: calculateStatsTraditional(team, matches, total),
                avg: calculateStatsTraditional(team, matches, average),
                min: calculateStatsTraditional(team, matches, minimum),
                max: calculateStatsTraditional(team, matches, maximum),
                dev: calculateStatsTraditional(team, matches, standardDeviation),
            } as TeamEventParticipation2020);

            tep.rp = !tep.hasStats ? null : tep.tot.totalPoints;
            tep.tb1 = !tep.hasStats ? null : tep.tot.autoPoints;
            tep.tb2 = !tep.hasStats ? null : tep.tot.endgamePoints;

            participations[team] = tep;
        });

        let oprCalculations = calculateAllOprs(teams, matches, participations);

        for (let [team, opr] of Object.entries(oprCalculations)) {
            participations[+team].opr = opr;
        }
    } else {
        teams.forEach((team) => {
            let qualMatchesPlayed = calcRemoteMatchesPlayed(team, matches);
            let avg = calculateStatsRemote(team, matches, average);
            let tep = TeamEventParticipation2020.create({
                eventSeason,
                eventCode,
                teamNumber: team,
                isRemote: true,
                wins: null,
                losses: null,
                ties: null,
                dq: null,
                qualMatchesPlayed,
                hasStats: !!qualMatchesPlayed,
                tot: calculateStatsRemote(team, matches, total),
                avg,
                opr: avg,
                min: calculateStatsRemote(team, matches, minimum),
                max: calculateStatsRemote(team, matches, maximum),
                dev: calculateStatsRemote(team, matches, standardDeviation),
            } as TeamEventParticipation2020);

            tep.rp = !tep.hasStats ? null : tep.tot.totalPoints;
            tep.tb1 = !tep.hasStats ? null : tep.tot.autoPoints;
            tep.tb2 = !tep.hasStats ? null : tep.tot.endgamePoints;

            participations[team] = tep;
        });
    }

    for (let [team, _] of Object.entries(participations)) {
        if (!participations[+team].hasStats) {
            participations[+team].opr = EMPTY_TEP_STATS;
        }
    }

    let rankedTeams = Object.entries(participations)
        .filter(([_, v]) => v.hasStats)
        .sort(([_1, v1], [_2, v2]) => v2.tb2! - v1.tb2!)
        .sort(([_1, v1], [_2, v2]) => v2.tb1! - v1.tb1!)
        .sort(([_1, v1], [_2, v2]) => v2.rp! - v1.rp!);

    for (let rank = 0; rank < rankedTeams.length; rank++) {
        participations[+rankedTeams[rank][0]].rank = rank + 1;
    }

    return Object.values(participations);
}

const EMPTY_TEP_STATS = {
    autoNavigationPoints: 0,
    autoNavigationPointsIndividual: 0,
    autoGoalPoints: 0,
    autoGoalPointsLow: 0,
    autoGoalPointsMid: 0,
    autoGoalPointsHigh: 0,
    autoWobblePoints: 0,
    autoPowershotPoints: 0,
    endgameWobblePoints: 0,
    endgameWobbleRingPoints: 0,
    majorPenaltyPoints: 0,
    minorPenaltyPoints: 0,
    autoPoints: 0,
    driverControlledPoints: 0,
    driverControlledPointsLow: 0,
    driverControlledPointsMid: 0,
    driverControlledPointsHigh: 0,
    endgamePoints: 0,
    penaltyPoints: 0,
    totalPoints: 0,
    totalPointsNp: 0,
};

function calculateWLTDq(
    teamNumber: number,
    matches: Match[]
): [number | null, number | null, number | null, number | null, number | null] {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS && m.scores2020);

    let wins = 0;
    let losses = 0;
    let ties = 0;
    let dq = 0;
    let qualMatchesPlayed = 0;

    matches.forEach((match) => {
        if (!match.teams.some((t) => t.teamNumber == teamNumber && !t.surrogate)) return;

        let alliance = teamsAlliance(teamNumber, match);
        let winningAlliance = winner(match);

        qualMatchesPlayed++;
        if (alliance == winningAlliance) {
            wins++;
        } else if (winningAlliance == null) {
            ties++;
        } else {
            losses++;
        }

        if (match.teams.some((t) => t.teamNumber == teamNumber && t.dq)) dq++;
    });

    return qualMatchesPlayed != 0 ? [wins, losses, ties, dq, qualMatchesPlayed] : [null, null, null, null, null];
}

function calcRemoteMatchesPlayed(teamNumber: number, matches: Match[]) {
    return matches.filter((m) => m.teams[0].teamNumber == teamNumber && m.teams[0].onField).length;
}

function teamsAlliance(teamNumber: number, match: Match): Alliance {
    return match.teams
        .filter((t) => t.station in [Station.RED_1, Station.RED_2])
        .some((t) => t.teamNumber == teamNumber)
        ? Alliance.RED
        : Alliance.BLUE;
}

function winner(match: Match): Alliance | null {
    let redScore = match.redTotalPoints()!;
    let blueScore = match.blueTotalPoints()!;

    if (redScore > blueScore) {
        return Alliance.RED;
    } else if (blueScore > redScore) {
        return Alliance.BLUE;
    } else {
        return null;
    }
}

function calculateStatsTraditional(
    teamNumber: number,
    matches: Match[],
    aggregationFunction: (_: number[]) => number
): TepStats2020 {
    let allDataPoints = {
        autoNavigationPoints: [] as number[],
        autoNavigationPointsIndividual: [] as number[],
        autoGoalPoints: [] as number[],
        autoGoalPointsLow: [] as number[],
        autoGoalPointsMid: [] as number[],
        autoGoalPointsHigh: [] as number[],
        autoWobblePoints: [] as number[],
        autoPowershotPoints: [] as number[],
        endgameWobblePoints: [] as number[],
        endgameWobbleRingPoints: [] as number[],
        majorPenaltyPoints: [] as number[],
        minorPenaltyPoints: [] as number[],
        autoPoints: [] as number[],
        driverControlledPoints: [] as number[],
        driverControlledPointsLow: [] as number[],
        driverControlledPointsMid: [] as number[],
        driverControlledPointsHigh: [] as number[],
        endgamePoints: [] as number[],
        penaltyPoints: [] as number[],
        totalPoints: [] as number[],
        totalPointsNp: [] as number[],
    };

    let teamsScores = getTeamsScoresTrad(teamNumber, matches);
    teamsScores.forEach(([ts, station]) => {
        allDataPoints.autoNavigationPoints.push(ts.autoNavigationPoints);
        let autoNavIndividual = (station == 0 ? ts.autoNavigated : ts.autoNavigated2) ? 5 : 0;
        allDataPoints.autoNavigationPointsIndividual.push(autoNavIndividual);
        allDataPoints.autoGoalPoints.push(ts.autoGoalPoints);
        allDataPoints.autoGoalPointsLow.push(ts.autoGoalLow * 3);
        allDataPoints.autoGoalPointsMid.push(ts.autoGoalMid * 6);
        allDataPoints.autoGoalPointsHigh.push(ts.autoGoalHigh * 12);
        allDataPoints.autoWobblePoints.push(ts.autoWobblePoints);
        allDataPoints.autoPowershotPoints.push(ts.autoPowershotPoints);
        allDataPoints.endgameWobblePoints.push(ts.endgameWobblePoints);
        allDataPoints.endgameWobbleRingPoints.push(ts.endgameWobbleRingPoints);
        allDataPoints.majorPenaltyPoints.push(ts.majorPenalties * -30);
        allDataPoints.minorPenaltyPoints.push(ts.minorPenalties * -10);
        allDataPoints.autoPoints.push(ts.autoPoints);
        allDataPoints.driverControlledPoints.push(ts.driverControlledPoints);
        allDataPoints.driverControlledPointsLow.push(ts.driverControlledLow * 2);
        allDataPoints.driverControlledPointsMid.push(ts.driverControlledMid * 4);
        allDataPoints.driverControlledPointsHigh.push(ts.driverControlledHigh * 6);
        allDataPoints.endgamePoints.push(ts.endgamePoints);
        allDataPoints.penaltyPoints.push(ts.penaltyPoints);
        allDataPoints.totalPoints.push(ts.totalPoints);
        allDataPoints.totalPointsNp.push(ts.totalPointsNp);
    });

    return {
        autoNavigationPoints: aggregationFunction(allDataPoints.autoNavigationPoints),
        autoNavigationPointsIndividual: aggregationFunction(allDataPoints.autoNavigationPointsIndividual),
        autoGoalPoints: aggregationFunction(allDataPoints.autoGoalPoints),
        autoGoalPointsLow: aggregationFunction(allDataPoints.autoGoalPointsLow),
        autoGoalPointsMid: aggregationFunction(allDataPoints.autoGoalPointsMid),
        autoGoalPointsHigh: aggregationFunction(allDataPoints.autoGoalPointsHigh),
        autoWobblePoints: aggregationFunction(allDataPoints.autoWobblePoints),
        autoPowershotPoints: aggregationFunction(allDataPoints.autoPowershotPoints),
        endgameWobblePoints: aggregationFunction(allDataPoints.endgameWobblePoints),
        endgameWobbleRingPoints: aggregationFunction(allDataPoints.endgameWobbleRingPoints),
        majorPenaltyPoints: aggregationFunction(allDataPoints.majorPenaltyPoints),
        minorPenaltyPoints: aggregationFunction(allDataPoints.minorPenaltyPoints),
        autoPoints: aggregationFunction(allDataPoints.autoPoints),
        driverControlledPoints: aggregationFunction(allDataPoints.driverControlledPoints),
        driverControlledPointsLow: aggregationFunction(allDataPoints.driverControlledPointsLow),
        driverControlledPointsMid: aggregationFunction(allDataPoints.driverControlledPointsMid),
        driverControlledPointsHigh: aggregationFunction(allDataPoints.driverControlledPointsHigh),
        endgamePoints: aggregationFunction(allDataPoints.endgamePoints),
        penaltyPoints: aggregationFunction(allDataPoints.penaltyPoints),
        totalPoints: aggregationFunction(allDataPoints.totalPoints),
        totalPointsNp: aggregationFunction(allDataPoints.totalPointsNp),
    };
}

function calculateStatsRemote(
    teamNumber: number,
    matches: Match[],
    aggregationFunction: (_: number[]) => number
): TepStats2020 {
    let allDataPoints = {
        autoNavigationPoints: [] as number[],
        autoNavigationPointsIndividual: [] as number[],
        autoGoalPoints: [] as number[],
        autoGoalPointsLow: [] as number[],
        autoGoalPointsMid: [] as number[],
        autoGoalPointsHigh: [] as number[],
        autoWobblePoints: [] as number[],
        autoPowershotPoints: [] as number[],
        endgameWobblePoints: [] as number[],
        endgameWobbleRingPoints: [] as number[],
        majorPenaltyPoints: [] as number[],
        minorPenaltyPoints: [] as number[],
        autoPoints: [] as number[],
        driverControlledPoints: [] as number[],
        driverControlledPointsLow: [] as number[],
        driverControlledPointsMid: [] as number[],
        driverControlledPointsHigh: [] as number[],
        endgamePoints: [] as number[],
        penaltyPoints: [] as number[],
        totalPoints: [] as number[],
        totalPointsNp: [] as number[],
    };

    let teamsScores = getTeamsScoresRemote(teamNumber, matches);
    teamsScores.forEach((ts) => {
        allDataPoints.autoNavigationPoints.push(ts.autoNavigationPoints);
        let autoNavIndividual = ts.autoNavigated ? 5 : 0;
        allDataPoints.autoNavigationPointsIndividual.push(autoNavIndividual);
        allDataPoints.autoGoalPoints.push(ts.autoGoalPoints);
        allDataPoints.autoGoalPointsLow.push(ts.autoGoalLow * 3);
        allDataPoints.autoGoalPointsMid.push(ts.autoGoalMid * 6);
        allDataPoints.autoGoalPointsHigh.push(ts.autoGoalHigh * 12);
        allDataPoints.autoWobblePoints.push(ts.autoWobblePoints);
        allDataPoints.autoPowershotPoints.push(ts.autoPowershotPoints);
        allDataPoints.endgameWobblePoints.push(ts.endgameWobblePoints);
        allDataPoints.endgameWobbleRingPoints.push(ts.endgameWobbleRingPoints);
        allDataPoints.majorPenaltyPoints.push(ts.majorPenalties * -30);
        allDataPoints.minorPenaltyPoints.push(ts.minorPenalties * -10);
        allDataPoints.autoPoints.push(ts.autoPoints);
        allDataPoints.driverControlledPoints.push(ts.driverControlledPoints);
        allDataPoints.driverControlledPointsLow.push(ts.driverControlledLow * 2);
        allDataPoints.driverControlledPointsMid.push(ts.driverControlledMid * 4);
        allDataPoints.driverControlledPointsHigh.push(ts.driverControlledHigh * 6);
        allDataPoints.endgamePoints.push(ts.endgamePoints);
        allDataPoints.penaltyPoints.push(ts.penaltyPoints);
        allDataPoints.totalPoints.push(ts.totalPoints);
        allDataPoints.totalPointsNp.push(ts.totalPointsNp);
    });

    return {
        autoNavigationPoints: aggregationFunction(allDataPoints.autoNavigationPoints),
        autoNavigationPointsIndividual: aggregationFunction(allDataPoints.autoNavigationPointsIndividual),
        autoGoalPoints: aggregationFunction(allDataPoints.autoGoalPoints),
        autoGoalPointsLow: aggregationFunction(allDataPoints.autoGoalPointsLow),
        autoGoalPointsMid: aggregationFunction(allDataPoints.autoGoalPointsMid),
        autoGoalPointsHigh: aggregationFunction(allDataPoints.autoGoalPointsHigh),
        autoWobblePoints: aggregationFunction(allDataPoints.autoWobblePoints),
        autoPowershotPoints: aggregationFunction(allDataPoints.autoPowershotPoints),
        endgameWobblePoints: aggregationFunction(allDataPoints.endgameWobblePoints),
        endgameWobbleRingPoints: aggregationFunction(allDataPoints.endgameWobbleRingPoints),
        majorPenaltyPoints: aggregationFunction(allDataPoints.majorPenaltyPoints),
        minorPenaltyPoints: aggregationFunction(allDataPoints.minorPenaltyPoints),
        autoPoints: aggregationFunction(allDataPoints.autoPoints),
        driverControlledPoints: aggregationFunction(allDataPoints.driverControlledPoints),
        driverControlledPointsLow: aggregationFunction(allDataPoints.driverControlledPointsLow),
        driverControlledPointsMid: aggregationFunction(allDataPoints.driverControlledPointsMid),
        driverControlledPointsHigh: aggregationFunction(allDataPoints.driverControlledPointsHigh),
        endgamePoints: aggregationFunction(allDataPoints.endgamePoints),
        penaltyPoints: aggregationFunction(allDataPoints.penaltyPoints),
        totalPoints: aggregationFunction(allDataPoints.totalPoints),
        totalPointsNp: aggregationFunction(allDataPoints.totalPointsNp),
    };
}

function calculateAllOprs(
    teams: number[],
    matches: Match[],
    stats: Record<number, TeamEventParticipation2020>
): Record<number, TepStats2020> {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS);

    let allDataPoints = {
        autoNavigationPoints: [] as OprData[],
        // autoNavigationPointsIndividual: [] as OprData[],
        autoGoalPoints: [] as OprData[],
        autoGoalPointsLow: [] as OprData[],
        autoGoalPointsMid: [] as OprData[],
        autoGoalPointsHigh: [] as OprData[],
        autoWobblePoints: [] as OprData[],
        autoPowershotPoints: [] as OprData[],
        endgameWobblePoints: [] as OprData[],
        endgameWobbleRingPoints: [] as OprData[],
        majorPenaltyPoints: [] as OprData[],
        minorPenaltyPoints: [] as OprData[],
        autoPoints: [] as OprData[],
        driverControlledPoints: [] as OprData[],
        driverControlledPointsLow: [] as OprData[],
        driverControlledPointsMid: [] as OprData[],
        driverControlledPointsHigh: [] as OprData[],
        endgamePoints: [] as OprData[],
        penaltyPoints: [] as OprData[],
        totalPoints: [] as OprData[],
        totalPointsNp: [] as OprData[],
    };

    matches.forEach((m) => {
        if (!m.scores2020) return;

        loadOprDataPoints(
            allDataPoints,
            m.scores2020.find((s) => s.alliance == Alliance.RED)!,
            m.teams.filter((t) => stationIsRed(t.station)).map((t) => t.teamNumber)
        );
        loadOprDataPoints(
            allDataPoints,
            m.scores2020.find((s) => s.alliance == Alliance.BLUE)!,
            m.teams.filter((t) => stationIsBlue(t.station)).map((t) => t.teamNumber)
        );
    });

    let ret: Record<number, TepStats2020> = {};
    teams.forEach((t) => {
        let a = stats[t].avg;
        ret[t] = {
            autoNavigationPointsIndividual: a.autoNavigationPointsIndividual,
        } as any;
    });

    assignOprStat(allDataPoints, ret, "autoNavigationPoints");
    assignOprStat(allDataPoints, ret, "autoGoalPoints");
    assignOprStat(allDataPoints, ret, "autoGoalPointsLow");
    assignOprStat(allDataPoints, ret, "autoGoalPointsMid");
    assignOprStat(allDataPoints, ret, "autoGoalPointsHigh");
    assignOprStat(allDataPoints, ret, "autoWobblePoints");
    assignOprStat(allDataPoints, ret, "autoPowershotPoints");
    assignOprStat(allDataPoints, ret, "endgameWobblePoints");
    assignOprStat(allDataPoints, ret, "endgameWobbleRingPoints");
    assignOprStat(allDataPoints, ret, "driverControlledPointsLow");
    assignOprStat(allDataPoints, ret, "driverControlledPointsMid");
    assignOprStat(allDataPoints, ret, "driverControlledPointsHigh");
    assignOprStat(allDataPoints, ret, "majorPenaltyPoints");
    assignOprStat(allDataPoints, ret, "minorPenaltyPoints");
    assignOprStat(allDataPoints, ret, "autoPoints");
    assignOprStat(allDataPoints, ret, "driverControlledPoints");
    assignOprStat(allDataPoints, ret, "endgamePoints");
    assignOprStat(allDataPoints, ret, "penaltyPoints");
    assignOprStat(allDataPoints, ret, "totalPoints");
    assignOprStat(allDataPoints, ret, "totalPointsNp");

    return ret;
}

function assignOprStat(data: Record<string, OprData[]>, records: Record<number, TepStats2020>, statName: string) {
    let calculated = calculateOPR(data[statName]);

    for (let [team, stat] of Object.entries(calculated)) {
        (records[+team] as any)[statName] = stat;
    }
}

function loadOprDataPoints(data: Record<string, OprData[]>, scores: MatchScores2020, teams: number[]) {
    let [team1, team2] = teams;
    data.autoNavigationPoints.push({ team1, team2, result: scores.autoNavigationPoints });
    // data.autoNavigationPointsIndividual.push({ team1, team2, result: scores.autoNavigationPointsIndividual });
    data.autoGoalPoints.push({ team1, team2, result: scores.autoGoalPoints });
    data.autoGoalPointsLow.push({ team1, team2, result: scores.autoGoalLow * 3 });
    data.autoGoalPointsMid.push({ team1, team2, result: scores.autoGoalMid * 6 });
    data.autoGoalPointsHigh.push({ team1, team2, result: scores.autoGoalHigh * 12 });
    data.autoWobblePoints.push({ team1, team2, result: scores.autoWobblePoints });
    data.autoPowershotPoints.push({ team1, team2, result: scores.autoPowershotPoints });
    data.endgameWobblePoints.push({ team1, team2, result: scores.endgameWobblePoints });
    data.endgameWobbleRingPoints.push({ team1, team2, result: scores.endgameWobbleRingPoints });
    data.driverControlledPointsLow.push({ team1, team2, result: scores.driverControlledLow * 2 });
    data.driverControlledPointsMid.push({ team1, team2, result: scores.driverControlledMid * 4 });
    data.driverControlledPointsHigh.push({ team1, team2, result: scores.driverControlledHigh * 6 });

    data.majorPenaltyPoints.push({ team1, team2, result: scores.majorPenalties * -30 });
    data.minorPenaltyPoints.push({ team1, team2, result: scores.minorPenalties * -10 });
    data.autoPoints.push({ team1, team2, result: scores.autoPoints });
    data.driverControlledPoints.push({ team1, team2, result: scores.driverControlledPoints });
    data.endgamePoints.push({ team1, team2, result: scores.endgamePoints });
    data.penaltyPoints.push({ team1, team2, result: scores.penaltyPoints });
    data.totalPoints.push({ team1, team2, result: scores.totalPoints });
    data.totalPointsNp.push({ team1, team2, result: scores.totalPointsNp });
}

function getTeamsScoresTrad(teamNumber: number, matches: Match[]): [MatchScores2020, 0 | 1][] {
    return matches
        .map((m) => {
            if (m.tournamentLevel != TournamentLevel.QUALS || !m.scores2020) return [];

            let rScore = m.scores2020.find((s) => s.alliance == Alliance.RED)!;
            let bScore = m.scores2020.find((s) => s.alliance == Alliance.BLUE)!;

            let r1 = m.teams.find((t) => t.station == Station.RED_1)!;
            let r2 = m.teams.find((t) => t.station == Station.RED_2)!;
            let b1 = m.teams.find((t) => t.station == Station.BLUE_1)!;
            let b2 = m.teams.find((t) => t.station == Station.BLUE_2)!;

            if (teamNumber == r1.teamNumber && !r1.surrogate) {
                return [[rScore, 0] as [MatchScores2020, 0 | 1]];
            } else if (teamNumber == r2.teamNumber && !r2.surrogate) {
                return [[rScore, 1] as [MatchScores2020, 0 | 1]];
            } else if (teamNumber == b1.teamNumber && !b1.surrogate) {
                return [[bScore, 0] as [MatchScores2020, 0 | 1]];
            } else if (teamNumber == b2.teamNumber && !b2.surrogate) {
                return [[bScore, 1] as [MatchScores2020, 0 | 1]];
            } else {
                return [];
            }
        })
        .flat();
}

function getTeamsScoresRemote(teamNumber: number, matches: Match[]): MatchScores2020[] {
    return matches
        .filter((m) => m.teams[0].teamNumber == teamNumber)
        .map((m) => m.scores2020)
        .filter((s) => s)
        .flat();
}
