import { Match } from "../db/entities/Match";
import { Alliance } from "../db/entities/types/Alliance";
import { Station, stationIsBlue, stationIsRed } from "../db/entities/types/Station";
import { TournamentLevel } from "../db/entities/types/TournamentLevel";
import { Season } from "../ftc-api/types/Season";
import { calculateOPR, OprData } from "./calculate-opr";
import { TeamEventParticipation2022 } from "../db/entities/team-event-participation/TeamEventParticipation2022";
import { TepStats2022 } from "../db/entities/team-event-participation/TepStats2022";
import { MatchScores2022 } from "../db/entities/MatchScores2022";

const total = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
const average = (arr: number[]) => (arr.length == 0 ? 0 : total(arr) / arr.length);
const minimum = (arr: number[]) => (arr.length == 0 ? 0 : Math.min(...arr));
const maximum = (arr: number[]) => (arr.length == 0 ? 0 : Math.max(...arr));
const standardDeviation = (arr: number[]) => {
    let avg = average(arr);
    let diffAvg = average(arr.map((n) => (avg - n) * (avg - n)));
    return Math.sqrt(diffAvg);
};

export function calculateEventStatistics2022(
    eventSeason: Season,
    eventCode: string,
    teams: number[],
    matches: Match[]
): TeamEventParticipation2022[] {
    let participations: Record<number, TeamEventParticipation2022> = {};

    teams.forEach((team) => {
        let [wins, losses, ties, dq, qualMatchesPlayed] = calculateWLTDq(team, matches);

        let tep = TeamEventParticipation2022.create({
            eventSeason,
            eventCode,
            teamNumber: team,
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
        } as TeamEventParticipation2022);

        tep.rp = !tep.hasStats ? null : (tep.wins! * 2 + tep.ties!) / tep.qualMatchesPlayed!;
        tep.tb1 = !tep.hasStats ? null : tep.avg.autoPoints;
        tep.tb2 = !tep.hasStats ? null : tep.avg.endgamePoints;

        participations[team] = tep;
    });

    let oprCalculations = calculateAllOprs(teams, matches, participations);

    for (let [team, opr] of Object.entries(oprCalculations)) {
        participations[+team].opr = opr;
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
    autoTerminalPoints: 0,
    autoConePoints: 0,
    autoGroundPoints: 0,
    autoLowPoints: 0,
    autoMediumPoints: 0,
    autoHighPoints: 0,
    dcTerminalPoints: 0,
    dcGroundPoints: 0,
    dcLowPoints: 0,
    dcMediumPoints: 0,
    dcHighPoints: 0,
    endgameNavigationPoints: 0,
    endgameNavigationPointsIndividual: 0,
    ownershipPoints: 0,
    coneOwnershipPoints: 0,
    beaconOwnershipPoints: 0,
    circuitPoints: 0,
    autoPoints: 0,
    dcPoints: 0,
    endgamePoints: 0,
    penaltyPoints: 0,
    totalPoints: 0,
    totalPointsNp: 0,
};

function calculateWLTDq(
    teamNumber: number,
    matches: Match[]
): [number | null, number | null, number | null, number | null, number | null] {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS && m.scores2022);

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
): TepStats2022 {
    let allDataPoints = {
        autoNavigationPoints: [] as number[],
        autoNavigationPointsIndividual: [] as number[],
        autoConePoints: [] as number[],
        autoTerminalPoints: [] as number[],
        autoGroundPoints: [] as number[],
        autoLowPoints: [] as number[],
        autoMediumPoints: [] as number[],
        autoHighPoints: [] as number[],
        dcTerminalPoints: [] as number[],
        dcGroundPoints: [] as number[],
        dcLowPoints: [] as number[],
        dcMediumPoints: [] as number[],
        dcHighPoints: [] as number[],
        endgameNavigationPoints: [] as number[],
        endgameNavigationPointsIndividual: [] as number[],
        ownershipPoints: [] as number[],
        coneOwnershipPoints: [] as number[],
        beaconOwnershipPoints: [] as number[],
        circuitPoints: [] as number[],
        autoPoints: [] as number[],
        dcPoints: [] as number[],
        endgamePoints: [] as number[],
        penaltyPoints: [] as number[],
        totalPoints: [] as number[],
        totalPointsNp: [] as number[],
    };

    let teamsScores = getTeamsScoresTrad(teamNumber, matches);
    teamsScores.forEach(([ts, station]) => {
        allDataPoints.autoNavigationPoints.push(ts.autoNavigationPoints);
        allDataPoints.autoNavigationPointsIndividual.push(
            MatchScores2022.autoNavPoints(station == 0 ? ts.autoNavigation1 : ts.autoNavigation2)
        );
        allDataPoints.autoConePoints.push(ts.autoConePoints);
        allDataPoints.autoTerminalPoints.push(ts.autoTerminalCones);
        allDataPoints.autoGroundPoints.push(ts.autoGroundCones * 2);
        allDataPoints.autoLowPoints.push(ts.autoLowCones * 3);
        allDataPoints.autoMediumPoints.push(ts.autoMediumCones * 4);
        allDataPoints.autoHighPoints.push(ts.autoHighCones * 5);
        allDataPoints.dcTerminalPoints.push(ts.dcTerminalCones);
        allDataPoints.dcGroundPoints.push(ts.dcGroundCones * 2);
        allDataPoints.dcLowPoints.push(ts.dcLowCones * 3);
        allDataPoints.dcMediumPoints.push(ts.dcMediumCones * 4);
        allDataPoints.dcHighPoints.push(ts.dcHighCones * 5);
        allDataPoints.endgameNavigationPoints.push(ts.endgameNavigationPoints);
        allDataPoints.endgameNavigationPointsIndividual.push(
            (station == 0 ? ts.endgameNavigated1 : ts.endgameNavigated2) ? 2 : 0
        );
        allDataPoints.ownershipPoints.push(ts.ownershipPoints);
        allDataPoints.coneOwnershipPoints.push(ts.coneOwnedJunctions * 3);
        allDataPoints.beaconOwnershipPoints.push(ts.beaconOwnedJunctions * 10);
        allDataPoints.circuitPoints.push(ts.circuit ? 20 : 0);
        allDataPoints.autoPoints.push(ts.autoPoints);
        allDataPoints.dcPoints.push(ts.dcPoints);
        allDataPoints.endgamePoints.push(ts.endgamePoints);
        allDataPoints.penaltyPoints.push(ts.penaltyPoints);
        allDataPoints.totalPoints.push(ts.totalPoints);
        allDataPoints.totalPointsNp.push(ts.totalPointsNp);
    });

    return {
        autoNavigationPoints: aggregationFunction(allDataPoints.autoNavigationPoints),
        autoNavigationPointsIndividual: aggregationFunction(allDataPoints.autoNavigationPointsIndividual),
        autoConePoints: aggregationFunction(allDataPoints.autoConePoints),
        autoTerminalPoints: aggregationFunction(allDataPoints.autoTerminalPoints),
        autoGroundPoints: aggregationFunction(allDataPoints.autoGroundPoints),
        autoLowPoints: aggregationFunction(allDataPoints.autoLowPoints),
        autoMediumPoints: aggregationFunction(allDataPoints.autoMediumPoints),
        autoHighPoints: aggregationFunction(allDataPoints.autoHighPoints),
        dcTerminalPoints: aggregationFunction(allDataPoints.dcTerminalPoints),
        dcGroundPoints: aggregationFunction(allDataPoints.dcGroundPoints),
        dcLowPoints: aggregationFunction(allDataPoints.dcLowPoints),
        dcMediumPoints: aggregationFunction(allDataPoints.dcMediumPoints),
        dcHighPoints: aggregationFunction(allDataPoints.dcHighPoints),
        endgameNavigationPoints: aggregationFunction(allDataPoints.endgameNavigationPoints),
        endgameNavigationPointsIndividual: aggregationFunction(allDataPoints.endgameNavigationPointsIndividual),
        ownershipPoints: aggregationFunction(allDataPoints.ownershipPoints),
        coneOwnershipPoints: aggregationFunction(allDataPoints.coneOwnershipPoints),
        beaconOwnershipPoints: aggregationFunction(allDataPoints.beaconOwnershipPoints),
        circuitPoints: aggregationFunction(allDataPoints.circuitPoints),
        autoPoints: aggregationFunction(allDataPoints.autoPoints),
        dcPoints: aggregationFunction(allDataPoints.dcPoints),
        endgamePoints: aggregationFunction(allDataPoints.endgamePoints),
        penaltyPoints: aggregationFunction(allDataPoints.penaltyPoints),
        totalPoints: aggregationFunction(allDataPoints.totalPoints),
        totalPointsNp: aggregationFunction(allDataPoints.totalPointsNp),
    };
}

function calculateAllOprs(
    teams: number[],
    matches: Match[],
    stats: Record<number, TeamEventParticipation2022>
): Record<number, TepStats2022> {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS);

    let allDataPoints = {
        autoNavigationPoints: [] as OprData[],
        // autoNavigationPointsIndividual: [] as OprData[],
        autoConePoints: [] as OprData[],
        autoTerminalPoints: [] as OprData[],
        autoGroundPoints: [] as OprData[],
        autoLowPoints: [] as OprData[],
        autoMediumPoints: [] as OprData[],
        autoHighPoints: [] as OprData[],
        dcTerminalPoints: [] as OprData[],
        dcGroundPoints: [] as OprData[],
        dcLowPoints: [] as OprData[],
        dcMediumPoints: [] as OprData[],
        dcHighPoints: [] as OprData[],
        endgameNavigationPoints: [] as OprData[],
        // endgameNavigationPointsIndividual: [] as OprData[],
        ownershipPoints: [] as OprData[],
        coneOwnershipPoints: [] as OprData[],
        beaconOwnershipPoints: [] as OprData[],
        circuitPoints: [] as OprData[],
        autoPoints: [] as OprData[],
        dcPoints: [] as OprData[],
        endgamePoints: [] as OprData[],
        penaltyPoints: [] as OprData[],
        totalPoints: [] as OprData[],
        totalPointsNp: [] as OprData[],
    };

    matches.forEach((m) => {
        if (!m.scores2022) return;

        loadOprDataPoints(
            allDataPoints,
            m.scores2022.find((s) => s.alliance == Alliance.RED)!,
            m.teams.filter((t) => stationIsRed(t.station)).map((t) => t.teamNumber)
        );
        loadOprDataPoints(
            allDataPoints,
            m.scores2022.find((s) => s.alliance == Alliance.BLUE)!,
            m.teams.filter((t) => stationIsBlue(t.station)).map((t) => t.teamNumber)
        );
    });

    let ret: Record<number, TepStats2022> = {};
    teams.forEach((t) => {
        let a = stats[t].avg;
        ret[t] = {
            autoNavigationPointsIndividual: a.autoNavigationPointsIndividual,
            endgameNavigationPointsIndividual: a.endgameNavigationPointsIndividual,
        } as any;
    });

    assignOprStat(allDataPoints, ret, "autoNavigationPoints");
    assignOprStat(allDataPoints, ret, "autoConePoints");
    assignOprStat(allDataPoints, ret, "autoTerminalPoints");
    assignOprStat(allDataPoints, ret, "autoGroundPoints");
    assignOprStat(allDataPoints, ret, "autoLowPoints");
    assignOprStat(allDataPoints, ret, "autoMediumPoints");
    assignOprStat(allDataPoints, ret, "autoHighPoints");
    assignOprStat(allDataPoints, ret, "dcTerminalPoints");
    assignOprStat(allDataPoints, ret, "dcGroundPoints");
    assignOprStat(allDataPoints, ret, "dcLowPoints");
    assignOprStat(allDataPoints, ret, "dcMediumPoints");
    assignOprStat(allDataPoints, ret, "dcHighPoints");
    assignOprStat(allDataPoints, ret, "endgameNavigationPoints");
    assignOprStat(allDataPoints, ret, "ownershipPoints");
    assignOprStat(allDataPoints, ret, "coneOwnershipPoints");
    assignOprStat(allDataPoints, ret, "beaconOwnershipPoints");
    assignOprStat(allDataPoints, ret, "circuitPoints");
    assignOprStat(allDataPoints, ret, "autoPoints");
    assignOprStat(allDataPoints, ret, "dcPoints");
    assignOprStat(allDataPoints, ret, "endgamePoints");
    assignOprStat(allDataPoints, ret, "penaltyPoints");
    assignOprStat(allDataPoints, ret, "totalPoints");
    assignOprStat(allDataPoints, ret, "totalPointsNp");

    return ret;
}

function assignOprStat(
    data: Record<string, OprData[]>,
    records: Record<number, TepStats2022>,
    statName: keyof TepStats2022
) {
    let calculated = calculateOPR(data[statName]);

    for (let [team, stat] of Object.entries(calculated)) {
        (records[+team] as any)[statName] = stat;
    }
}

function loadOprDataPoints(data: Record<string, OprData[]>, scores: MatchScores2022, teams: number[]) {
    let [team1, team2] = teams;

    data.autoNavigationPoints.push({ team1, team2, result: scores.autoNavigationPoints });
    data.autoConePoints.push({ team1, team2, result: scores.autoConePoints });
    data.autoTerminalPoints.push({ team1, team2, result: scores.autoTerminalCones });
    data.autoGroundPoints.push({ team1, team2, result: scores.autoGroundCones * 2 });
    data.autoLowPoints.push({ team1, team2, result: scores.autoLowCones * 3 });
    data.autoMediumPoints.push({ team1, team2, result: scores.autoMediumCones * 4 });
    data.autoHighPoints.push({ team1, team2, result: scores.autoHighCones * 5 });
    data.dcTerminalPoints.push({ team1, team2, result: scores.dcTerminalCones });
    data.dcGroundPoints.push({ team1, team2, result: scores.dcGroundCones * 2 });
    data.dcLowPoints.push({ team1, team2, result: scores.dcLowCones * 3 });
    data.dcMediumPoints.push({ team1, team2, result: scores.dcMediumCones * 4 });
    data.dcHighPoints.push({ team1, team2, result: scores.dcHighCones * 5 });
    data.endgameNavigationPoints.push({ team1, team2, result: scores.endgameNavigationPoints });
    data.ownershipPoints.push({ team1, team2, result: scores.ownershipPoints });
    data.coneOwnershipPoints.push({ team1, team2, result: scores.coneOwnedJunctions * 3 });
    data.beaconOwnershipPoints.push({ team1, team2, result: scores.beaconOwnedJunctions * 10 });
    data.circuitPoints.push({ team1, team2, result: scores.circuitPoints });

    data.autoPoints.push({ team1, team2, result: scores.autoPoints });
    data.dcPoints.push({ team1, team2, result: scores.dcPoints });
    data.endgamePoints.push({ team1, team2, result: scores.endgamePoints });
    data.penaltyPoints.push({ team1, team2, result: scores.penaltyPoints });
    data.totalPoints.push({ team1, team2, result: scores.totalPoints });
    data.totalPointsNp.push({ team1, team2, result: scores.totalPointsNp });
}

function getTeamsScoresTrad(teamNumber: number, matches: Match[]): [MatchScores2022, 0 | 1][] {
    return matches
        .map((m) => {
            if (m.tournamentLevel != TournamentLevel.QUALS || !m.scores2022) return [];

            let rScore = m.scores2022.find((s) => s.alliance == Alliance.RED)!;
            let bScore = m.scores2022.find((s) => s.alliance == Alliance.BLUE)!;

            let r1 = m.teams.find((t) => t.station == Station.RED_1)!;
            let r2 = m.teams.find((t) => t.station == Station.RED_2)!;
            let b1 = m.teams.find((t) => t.station == Station.BLUE_1)!;
            let b2 = m.teams.find((t) => t.station == Station.BLUE_2)!;

            if (teamNumber == r1.teamNumber && !r1.surrogate) {
                return [[rScore, 0] as [MatchScores2022, 0 | 1]];
            } else if (teamNumber == r2.teamNumber && !r2.surrogate) {
                return [[rScore, 1] as [MatchScores2022, 0 | 1]];
            } else if (teamNumber == b1.teamNumber && !b1.surrogate) {
                return [[bScore, 0] as [MatchScores2022, 0 | 1]];
            } else if (teamNumber == b2.teamNumber && !b2.surrogate) {
                return [[bScore, 1] as [MatchScores2022, 0 | 1]];
            } else {
                return [];
            }
        })
        .flat();
}
