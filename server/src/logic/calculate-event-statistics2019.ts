import { MatchScores2019 } from "../db/entities/MatchScores2019";
import { TeamEventParticipation2019 } from "../db/entities/team-event-participation/TeamEventParticipation2019";
import { TepStats2019 } from "../db/entities/team-event-participation/TepStats2019";
import { Match } from "../db/entities/Match";
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

export function calculateEventStatistics2019(
    eventSeason: Season,
    eventCode: string,
    teams: number[],
    matches: Match[]
): TeamEventParticipation2019[] {
    let participations: Record<number, TeamEventParticipation2019> = {};

    teams.forEach((team) => {
        let [wins, losses, ties, dq, qualMatchesPlayed] = calculateWLTDq(team, matches);

        let tep = TeamEventParticipation2019.create({
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
        } as TeamEventParticipation2019);

        tep.rp = !tep.hasStats ? null : (tep.wins! * 2 + tep.ties!) / tep.qualMatchesPlayed!;
        tep.tb = !tep.hasStats ? null : calcTbPoints(team, matches);

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
        .sort(([_1, v1], [_2, v2]) => v2.tb! - v1.tb!)
        .sort(([_1, v1], [_2, v2]) => v2.rp! - v1.rp!);

    for (let rank = 0; rank < rankedTeams.length; rank++) {
        participations[+rankedTeams[rank][0]].rank = rank + 1;
    }

    return Object.values(participations);
}

const EMPTY_TEP_STATS = {
    autoNavigationPoints: 0,
    autoNavigationPointsIndividual: 0,
    autoRepositioningPoints: 0,
    autoDeliveryPoints: 0,
    autoPlacementPoints: 0,
    dcDeliveryPoints: 0,
    dcPlacementPoints: 0,
    dcSkyscraperBonusPoints: 0,
    cappingPoints: 0,
    cappingPointsIndividual: 0,
    parkingPoints: 0,
    parkingPointsIndividual: 0,
    foundationMovedPoints: 0,
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
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS && m.scores2019);

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

function calcTbPoints(teamNumber: number, matches: Match[]): number | null {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS && m.scores2019);

    let totalLosingScore = 0;
    let matchesPlayed = 0;

    for (let m of matches) {
        if (m.teams.map((t) => t.teamNumber).indexOf(teamNumber) != -1) {
            totalLosingScore += tbPointsForMatch(m);
            matchesPlayed++;
        }
    }

    return matchesPlayed == 0 ? null : totalLosingScore / matchesPlayed;
}

function tbPointsForMatch(match: Match): number {
    return Math.min(match.redTotalNpPoints()!, match.blueTotalNpPoints()!);
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
): TepStats2019 {
    let allDataPoints = {
        autoNavigationPoints: [] as number[],
        autoNavigationPointsIndividual: [] as number[],
        autoRepositioningPoints: [] as number[],
        autoDeliveryPoints: [] as number[],
        autoPlacementPoints: [] as number[],
        dcDeliveryPoints: [] as number[],
        dcPlacementPoints: [] as number[],
        dcSkyscraperBonusPoints: [] as number[],
        cappingPoints: [] as number[],
        cappingPointsIndividual: [] as number[],
        parkingPoints: [] as number[],
        parkingPointsIndividual: [] as number[],
        foundationMovedPoints: [] as number[],
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
        allDataPoints.autoNavigationPointsIndividual.push((station == 0 ? ts.navigated1 : ts.navigated2) ? 5 : 0);
        allDataPoints.autoRepositioningPoints.push(ts.autoRepositioningPoints);
        allDataPoints.autoDeliveryPoints.push(ts.autoDeliveryPoints);
        allDataPoints.autoPlacementPoints.push(ts.autoPlacementPoints);
        allDataPoints.dcDeliveryPoints.push(ts.dcDeliveryPoints);
        allDataPoints.dcPlacementPoints.push(ts.dcPlacementPoints);
        allDataPoints.dcSkyscraperBonusPoints.push(ts.dcSkyscraperBonusPoints);
        allDataPoints.cappingPoints.push(ts.cappingPoints);
        allDataPoints.cappingPointsIndividual.push(
            MatchScores2019.calcCapPoints(station == 0 ? ts.capLevel1 : ts.capLevel2)
        );
        allDataPoints.parkingPoints.push(ts.parkingPoints);
        allDataPoints.parkingPointsIndividual.push((station == 0 ? ts.parked1 : ts.parked2) ? 5 : 0);
        allDataPoints.foundationMovedPoints.push(ts.foundationMovedPoints);
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
        autoRepositioningPoints: aggregationFunction(allDataPoints.autoRepositioningPoints),
        autoDeliveryPoints: aggregationFunction(allDataPoints.autoDeliveryPoints),
        autoPlacementPoints: aggregationFunction(allDataPoints.autoPlacementPoints),
        dcDeliveryPoints: aggregationFunction(allDataPoints.dcDeliveryPoints),
        dcPlacementPoints: aggregationFunction(allDataPoints.dcPlacementPoints),
        dcSkyscraperBonusPoints: aggregationFunction(allDataPoints.dcSkyscraperBonusPoints),
        cappingPoints: aggregationFunction(allDataPoints.cappingPoints),
        cappingPointsIndividual: aggregationFunction(allDataPoints.cappingPointsIndividual),
        parkingPoints: aggregationFunction(allDataPoints.parkingPoints),
        parkingPointsIndividual: aggregationFunction(allDataPoints.parkingPointsIndividual),
        foundationMovedPoints: aggregationFunction(allDataPoints.foundationMovedPoints),
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
    stats: Record<number, TeamEventParticipation2019>
): Record<number, TepStats2019> {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS);

    let allDataPoints = {
        autoNavigationPoints: [] as OprData[],
        // autoNavigationPointsIndividual: [] as OprData[], // opr doesn't make sense for these
        autoRepositioningPoints: [] as OprData[],
        autoDeliveryPoints: [] as OprData[],
        autoPlacementPoints: [] as OprData[],
        dcDeliveryPoints: [] as OprData[],
        dcPlacementPoints: [] as OprData[],
        dcSkyscraperBonusPoints: [] as OprData[],
        cappingPoints: [] as OprData[],
        // cappingPointsIndividual: [] as OprData[], // opr doesn't make sense for these
        parkingPoints: [] as OprData[],
        // parkingPointsIndividual: [] as OprData[], // opr doesn't make sense for these
        foundationMovedPoints: [] as OprData[],
        autoPoints: [] as OprData[],
        dcPoints: [] as OprData[],
        endgamePoints: [] as OprData[],
        penaltyPoints: [] as OprData[],
        totalPoints: [] as OprData[],
        totalPointsNp: [] as OprData[],
    };

    matches.forEach((m) => {
        if (!m.scores2019) return;

        loadOprDataPoints(
            allDataPoints,
            m.scores2019.find((s) => s.alliance == Alliance.RED)!,
            m.teams.filter((t) => stationIsRed(t.station)).map((t) => t.teamNumber)
        );
        loadOprDataPoints(
            allDataPoints,
            m.scores2019.find((s) => s.alliance == Alliance.BLUE)!,
            m.teams.filter((t) => stationIsBlue(t.station)).map((t) => t.teamNumber)
        );
    });

    let ret: Record<number, TepStats2019> = {};
    teams.forEach((t) => {
        let a = stats[t].avg;
        ret[t] = {
            autoNavigationPointsIndividual: a.autoNavigationPointsIndividual,
            cappingPointsIndividual: a.cappingPointsIndividual,
            parkingPointsIndividual: a.parkingPointsIndividual,
        } as any;
    });

    assignOprStat(allDataPoints, ret, "autoNavigationPoints");
    assignOprStat(allDataPoints, ret, "autoRepositioningPoints");
    assignOprStat(allDataPoints, ret, "autoDeliveryPoints");
    assignOprStat(allDataPoints, ret, "autoPlacementPoints");
    assignOprStat(allDataPoints, ret, "dcDeliveryPoints");
    assignOprStat(allDataPoints, ret, "dcPlacementPoints");
    assignOprStat(allDataPoints, ret, "dcSkyscraperBonusPoints");
    assignOprStat(allDataPoints, ret, "cappingPoints");
    assignOprStat(allDataPoints, ret, "parkingPoints");
    assignOprStat(allDataPoints, ret, "foundationMovedPoints");
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
    records: Record<number, TepStats2019>,
    statName: keyof TepStats2019
) {
    let calculated = calculateOPR(data[statName]);

    for (let [team, stat] of Object.entries(calculated)) {
        (records[+team] as any)[statName] = stat;
    }
}

function loadOprDataPoints(data: Record<string, OprData[]>, scores: MatchScores2019, teams: number[]) {
    let [team1, team2] = teams;
    data.autoNavigationPoints.push({ team1, team2, result: scores.autoNavigationPoints });
    data.autoRepositioningPoints.push({ team1, team2, result: scores.autoRepositioningPoints });
    data.autoDeliveryPoints.push({ team1, team2, result: scores.autoDeliveryPoints });
    data.autoPlacementPoints.push({ team1, team2, result: scores.autoPlacementPoints });
    data.dcDeliveryPoints.push({ team1, team2, result: scores.dcDeliveryPoints });
    data.dcPlacementPoints.push({ team1, team2, result: scores.dcPlacementPoints });
    data.dcSkyscraperBonusPoints.push({ team1, team2, result: scores.dcSkyscraperBonusPoints });
    data.cappingPoints.push({ team1, team2, result: scores.cappingPoints });
    // cappingPointsIndividual.push({team1, team2, result: scores.cappingPointsIndividual}); // opr doesn't make sense for these
    data.parkingPoints.push({ team1, team2, result: scores.parkingPoints });
    // parkingPointsIndividual.push({team1, team2, result: scores.parkingPointsIndividual}); // opr doesn't make sense for these
    data.foundationMovedPoints.push({ team1, team2, result: scores.foundationMovedPoints });
    data.autoPoints.push({ team1, team2, result: scores.autoPoints });
    data.dcPoints.push({ team1, team2, result: scores.dcPoints });
    data.endgamePoints.push({ team1, team2, result: scores.endgamePoints });
    data.penaltyPoints.push({ team1, team2, result: scores.penaltyPoints });
    data.totalPoints.push({ team1, team2, result: scores.totalPoints });
    data.totalPointsNp.push({ team1, team2, result: scores.totalPointsNp });
}

function getTeamsScoresTrad(teamNumber: number, matches: Match[]): [MatchScores2019, 0 | 1][] {
    return matches
        .map((m) => {
            if (m.tournamentLevel != TournamentLevel.QUALS || !m.scores2019) return [];

            let rScore = m.scores2019.find((s) => s.alliance == Alliance.RED)!;
            let bScore = m.scores2019.find((s) => s.alliance == Alliance.BLUE)!;

            let r1 = m.teams.find((t) => t.station == Station.RED_1)!;
            let r2 = m.teams.find((t) => t.station == Station.RED_2)!;
            let b1 = m.teams.find((t) => t.station == Station.BLUE_1)!;
            let b2 = m.teams.find((t) => t.station == Station.BLUE_2)!;

            if (teamNumber == r1.teamNumber && !r1.surrogate) {
                return [[rScore, 0] as [MatchScores2019, 0 | 1]];
            } else if (teamNumber == r2.teamNumber && !r2.surrogate) {
                return [[rScore, 1] as [MatchScores2019, 0 | 1]];
            } else if (teamNumber == b1.teamNumber && !b1.surrogate) {
                return [[bScore, 0] as [MatchScores2019, 0 | 1]];
            } else if (teamNumber == b2.teamNumber && !b2.surrogate) {
                return [[bScore, 1] as [MatchScores2019, 0 | 1]];
            } else {
                return [];
            }
        })
        .flat();
}
