import { Match } from "../db/entities/Match";
import { MatchScores2021 } from "../db/entities/MatchScores2021";
import { TeamEventParticipation2021 } from "../db/entities/team-event-participation/TeamEventParticipation2021";
import { TepStats2021 } from "../db/entities/team-event-participation/TepStats2021";
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

export function calculateEventStatistics2021(
    eventSeason: Season,
    eventCode: string,
    teams: number[],
    matches: Match[],
    isRemote: boolean
): TeamEventParticipation2021[] {
    let participations: Record<number, TeamEventParticipation2021> = {};

    if (!isRemote) {
        teams.forEach((team) => {
            let [wins, losses, ties, dq, qualMatchesPlayed] = calculateWLTDq(team, matches);

            let tep = TeamEventParticipation2021.create({
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
            } as TeamEventParticipation2021);

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
            let tep = TeamEventParticipation2021.create({
                eventSeason,
                eventCode,
                teamNumber: team,
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
            } as TeamEventParticipation2021);

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
    autoCarouselPoints: 0,
    autoNavigationPoints: 0,
    autoNavigationPointsIndividual: 0,
    autoFreightPoints: 0,
    autoFreightPointsLevel1: 0,
    autoFreightPointsLevel2: 0,
    autoFreightPointsLevel3: 0,
    autoFreightPointsStorage: 0,
    autoBonusPoints: 0,
    autoBonusPointsIndividual: 0,
    driverControlledAllianceHubPoints: 0,
    driverControlledAllianceHubPointsLevel1: 0,
    driverControlledAllianceHubPointsLevel2: 0,
    driverControlledAllianceHubPointsLevel3: 0,
    driverControlledSharedHubPoints: 0,
    driverControlledStoragePoints: 0,
    endgameDeliveryPoints: 0,
    allianceBalancedPoints: 0,
    sharedUnbalancedPoints: 0,
    endgameParkingPoints: 0,
    endgameParkingPointsIndividual: 0,
    cappingPoints: 0,
    autoPoints: 0,
    driverControlledPoints: 0,
    endgamePoints: 0,
    penaltyPoints: 0,
    totalPoints: 0,
    totalPointsNp: 0,
};

function calculateWLTDq(
    teamNumber: number,
    matches: Match[]
): [number | null, number | null, number | null, number | null, number | null] {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS && m.scores2021);

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
): TepStats2021 {
    let allDataPoints = {
        autoCarouselPoints: [] as number[],
        autoNavigationPoints: [] as number[],
        autoNavigationPointsIndividual: [] as number[],
        autoFreightPoints: [] as number[],
        autoFreightPointsLevel1: [] as number[],
        autoFreightPointsLevel2: [] as number[],
        autoFreightPointsLevel3: [] as number[],
        autoFreightPointsStorage: [] as number[],
        autoBonusPoints: [] as number[],
        autoBonusPointsIndividual: [] as number[],
        driverControlledAllianceHubPoints: [] as number[],
        driverControlledAllianceHubPointsLevel1: [] as number[],
        driverControlledAllianceHubPointsLevel2: [] as number[],
        driverControlledAllianceHubPointsLevel3: [] as number[],
        driverControlledSharedHubPoints: [] as number[],
        driverControlledStoragePoints: [] as number[],
        endgameDeliveryPoints: [] as number[],
        allianceBalancedPoints: [] as number[],
        sharedUnbalancedPoints: [] as number[],
        endgameParkingPoints: [] as number[],
        endgameParkingPointsIndividual: [] as number[],
        cappingPoints: [] as number[],
        autoPoints: [] as number[],
        driverControlledPoints: [] as number[],
        endgamePoints: [] as number[],
        penaltyPoints: [] as number[],
        totalPoints: [] as number[],
        totalPointsNp: [] as number[],
    };

    let teamsScores = getTeamsScoresTrad(teamNumber, matches);
    teamsScores.forEach(([ts, station]) => {
        allDataPoints.autoCarouselPoints.push(ts.autoCarouselPoints);
        allDataPoints.autoNavigationPoints.push(ts.autoNavigationPoints);
        let autoNavIndividual = MatchScores2021.calcAutoNavigationPoints(
            station == 0 ? ts.autoNavigation : ts.autoNavigation2!
        );
        allDataPoints.autoNavigationPointsIndividual.push(autoNavIndividual);
        allDataPoints.autoFreightPoints.push(ts.autoFreightPoints);
        allDataPoints.autoFreightPointsLevel1.push(ts.autoFreight1 * 6);
        allDataPoints.autoFreightPointsLevel2.push(ts.autoFreight2 * 6);
        allDataPoints.autoFreightPointsLevel3.push(ts.autoFreight3 * 6);
        allDataPoints.autoFreightPointsStorage.push(ts.autoStorageFreight * 2);
        allDataPoints.autoBonusPoints.push(ts.autoBonusPoints);
        let autoBonusIndividual = MatchScores2021.calcAutoBonusPoints(
            station == 0 ? ts.autoBonus : ts.autoBonus2!,
            station == 0 ? ts.barcodeElement : ts.barcodeElement2!
        );
        allDataPoints.autoBonusPointsIndividual.push(autoBonusIndividual);
        allDataPoints.driverControlledAllianceHubPoints.push(ts.driverControlledAllianceHubPoints);
        allDataPoints.driverControlledAllianceHubPointsLevel1.push(ts.driverControlledFreight1 * 2);
        allDataPoints.driverControlledAllianceHubPointsLevel2.push(ts.driverControlledFreight2 * 4);
        allDataPoints.driverControlledAllianceHubPointsLevel3.push(ts.driverControlledFreight3 * 6);
        allDataPoints.driverControlledSharedHubPoints.push(ts.driverControlledSharedHubPoints!);
        allDataPoints.driverControlledStoragePoints.push(ts.driverControlledStoragePoints);
        allDataPoints.endgameDeliveryPoints.push(ts.endgameDeliveryPoints);
        allDataPoints.allianceBalancedPoints.push(ts.allianceBalancedPoints);
        allDataPoints.sharedUnbalancedPoints.push(ts.sharedUnbalancedPoints!);
        allDataPoints.endgameParkingPoints.push(ts.endgameParkingPoints);
        let endgameParkIndividual = MatchScores2021.calcParkPoints(station == 0 ? ts.endgamePark : ts.endgamePark2!);
        allDataPoints.endgameParkingPointsIndividual.push(endgameParkIndividual);
        allDataPoints.cappingPoints.push(ts.cappingPoints);
        allDataPoints.autoPoints.push(ts.autoPoints);
        allDataPoints.driverControlledPoints.push(ts.driverControlledPoints);
        allDataPoints.endgamePoints.push(ts.endgamePoints);
        allDataPoints.penaltyPoints.push(ts.penaltyPoints);
        allDataPoints.totalPoints.push(ts.totalPoints);
        allDataPoints.totalPointsNp.push(ts.totalPointsNp);
    });

    return {
        autoCarouselPoints: aggregationFunction(allDataPoints.autoCarouselPoints),
        autoNavigationPoints: aggregationFunction(allDataPoints.autoNavigationPoints),
        autoNavigationPointsIndividual: aggregationFunction(allDataPoints.autoNavigationPointsIndividual),
        autoFreightPoints: aggregationFunction(allDataPoints.autoFreightPoints),
        autoFreightPointsLevel1: aggregationFunction(allDataPoints.autoFreightPointsLevel1),
        autoFreightPointsLevel2: aggregationFunction(allDataPoints.autoFreightPointsLevel2),
        autoFreightPointsLevel3: aggregationFunction(allDataPoints.autoFreightPointsLevel3),
        autoFreightPointsStorage: aggregationFunction(allDataPoints.autoFreightPointsStorage),
        autoBonusPoints: aggregationFunction(allDataPoints.autoBonusPoints),
        autoBonusPointsIndividual: aggregationFunction(allDataPoints.autoBonusPointsIndividual),
        driverControlledAllianceHubPoints: aggregationFunction(allDataPoints.driverControlledAllianceHubPoints),
        driverControlledAllianceHubPointsLevel1: aggregationFunction(
            allDataPoints.driverControlledAllianceHubPointsLevel1
        ),
        driverControlledAllianceHubPointsLevel2: aggregationFunction(
            allDataPoints.driverControlledAllianceHubPointsLevel2
        ),
        driverControlledAllianceHubPointsLevel3: aggregationFunction(
            allDataPoints.driverControlledAllianceHubPointsLevel3
        ),
        driverControlledSharedHubPoints: aggregationFunction(allDataPoints.driverControlledSharedHubPoints),
        driverControlledStoragePoints: aggregationFunction(allDataPoints.driverControlledStoragePoints),
        endgameDeliveryPoints: aggregationFunction(allDataPoints.endgameDeliveryPoints),
        allianceBalancedPoints: aggregationFunction(allDataPoints.allianceBalancedPoints),
        sharedUnbalancedPoints: aggregationFunction(allDataPoints.sharedUnbalancedPoints),
        endgameParkingPoints: aggregationFunction(allDataPoints.endgameParkingPoints),
        endgameParkingPointsIndividual: aggregationFunction(allDataPoints.endgameParkingPointsIndividual),
        cappingPoints: aggregationFunction(allDataPoints.cappingPoints),
        autoPoints: aggregationFunction(allDataPoints.autoPoints),
        driverControlledPoints: aggregationFunction(allDataPoints.driverControlledPoints),
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
): TepStats2021 {
    let allDataPoints = {
        autoCarouselPoints: [] as number[],
        autoNavigationPoints: [] as number[],
        autoNavigationPointsIndividual: [] as number[],
        autoFreightPoints: [] as number[],
        autoFreightPointsLevel1: [] as number[],
        autoFreightPointsLevel2: [] as number[],
        autoFreightPointsLevel3: [] as number[],
        autoFreightPointsStorage: [] as number[],
        autoBonusPoints: [] as number[],
        autoBonusPointsIndividual: [] as number[],
        driverControlledAllianceHubPoints: [] as number[],
        driverControlledAllianceHubPointsLevel1: [] as number[],
        driverControlledAllianceHubPointsLevel2: [] as number[],
        driverControlledAllianceHubPointsLevel3: [] as number[],
        driverControlledStoragePoints: [] as number[],
        endgameDeliveryPoints: [] as number[],
        allianceBalancedPoints: [] as number[],
        endgameParkingPoints: [] as number[],
        endgameParkingPointsIndividual: [] as number[],
        cappingPoints: [] as number[],
        autoPoints: [] as number[],
        driverControlledPoints: [] as number[],
        endgamePoints: [] as number[],
        penaltyPoints: [] as number[],
        totalPoints: [] as number[],
        totalPointsNp: [] as number[],
    };

    let teamsScores = getTeamsScoresRemote(teamNumber, matches);
    teamsScores.forEach((ts) => {
        allDataPoints.autoCarouselPoints.push(ts.autoCarouselPoints);
        allDataPoints.autoNavigationPoints.push(ts.autoNavigationPoints);
        allDataPoints.autoNavigationPointsIndividual.push(ts.autoNavigationPoints);
        allDataPoints.autoFreightPoints.push(ts.autoFreightPoints);
        allDataPoints.autoFreightPointsLevel1.push(ts.autoFreight1 * 6);
        allDataPoints.autoFreightPointsLevel2.push(ts.autoFreight2 * 6);
        allDataPoints.autoFreightPointsLevel3.push(ts.autoFreight3 * 6);
        allDataPoints.autoFreightPointsStorage.push(ts.autoStorageFreight * 2);
        allDataPoints.autoBonusPoints.push(ts.autoBonusPoints);
        allDataPoints.autoBonusPointsIndividual.push(ts.autoBonusPoints);
        allDataPoints.driverControlledAllianceHubPoints.push(ts.driverControlledAllianceHubPoints);
        allDataPoints.driverControlledAllianceHubPointsLevel1.push(ts.driverControlledFreight1 * 2);
        allDataPoints.driverControlledAllianceHubPointsLevel2.push(ts.driverControlledFreight2 * 4);
        allDataPoints.driverControlledAllianceHubPointsLevel3.push(ts.driverControlledFreight3 * 6);
        allDataPoints.driverControlledStoragePoints.push(ts.driverControlledStoragePoints);
        allDataPoints.endgameDeliveryPoints.push(ts.endgameDeliveryPoints);
        allDataPoints.allianceBalancedPoints.push(ts.allianceBalancedPoints);
        allDataPoints.endgameParkingPoints.push(ts.endgameParkingPoints);
        allDataPoints.endgameParkingPointsIndividual.push(ts.endgameParkingPoints);
        allDataPoints.cappingPoints.push(ts.cappingPoints);
        allDataPoints.autoPoints.push(ts.autoPoints);
        allDataPoints.driverControlledPoints.push(ts.driverControlledPoints);
        allDataPoints.endgamePoints.push(ts.endgamePoints);
        allDataPoints.penaltyPoints.push(ts.penaltyPoints);
        allDataPoints.totalPoints.push(ts.totalPoints);
        allDataPoints.totalPointsNp.push(ts.totalPointsNp);
    });

    return {
        autoCarouselPoints: aggregationFunction(allDataPoints.autoCarouselPoints),
        autoNavigationPoints: aggregationFunction(allDataPoints.autoNavigationPoints),
        autoNavigationPointsIndividual: aggregationFunction(allDataPoints.autoNavigationPointsIndividual),
        autoFreightPoints: aggregationFunction(allDataPoints.autoFreightPoints),
        autoFreightPointsLevel1: aggregationFunction(allDataPoints.autoFreightPointsLevel1),
        autoFreightPointsLevel2: aggregationFunction(allDataPoints.autoFreightPointsLevel2),
        autoFreightPointsLevel3: aggregationFunction(allDataPoints.autoFreightPointsLevel3),
        autoFreightPointsStorage: aggregationFunction(allDataPoints.autoFreightPointsStorage),
        autoBonusPoints: aggregationFunction(allDataPoints.autoBonusPoints),
        autoBonusPointsIndividual: aggregationFunction(allDataPoints.autoBonusPointsIndividual),
        driverControlledAllianceHubPoints: aggregationFunction(allDataPoints.driverControlledAllianceHubPoints),
        driverControlledAllianceHubPointsLevel1: aggregationFunction(
            allDataPoints.driverControlledAllianceHubPointsLevel1
        ),
        driverControlledAllianceHubPointsLevel2: aggregationFunction(
            allDataPoints.driverControlledAllianceHubPointsLevel2
        ),
        driverControlledAllianceHubPointsLevel3: aggregationFunction(
            allDataPoints.driverControlledAllianceHubPointsLevel3
        ),
        driverControlledSharedHubPoints: null,
        driverControlledStoragePoints: aggregationFunction(allDataPoints.driverControlledStoragePoints),
        endgameDeliveryPoints: aggregationFunction(allDataPoints.endgameDeliveryPoints),
        allianceBalancedPoints: aggregationFunction(allDataPoints.allianceBalancedPoints),
        sharedUnbalancedPoints: null,
        endgameParkingPoints: aggregationFunction(allDataPoints.endgameParkingPoints),
        endgameParkingPointsIndividual: aggregationFunction(allDataPoints.endgameParkingPointsIndividual),
        cappingPoints: aggregationFunction(allDataPoints.cappingPoints),
        autoPoints: aggregationFunction(allDataPoints.autoPoints),
        driverControlledPoints: aggregationFunction(allDataPoints.driverControlledPoints),
        endgamePoints: aggregationFunction(allDataPoints.endgamePoints),
        penaltyPoints: aggregationFunction(allDataPoints.penaltyPoints),
        totalPoints: aggregationFunction(allDataPoints.totalPoints),
        totalPointsNp: aggregationFunction(allDataPoints.totalPointsNp),
    };
}

function calculateAllOprs(
    teams: number[],
    matches: Match[],
    stats: Record<number, TeamEventParticipation2021>
): Record<number, TepStats2021> {
    matches = matches.filter((m) => m.tournamentLevel == TournamentLevel.QUALS);

    let allDataPoints = {
        autoCarouselPoints: [] as OprData[],
        autoNavigationPoints: [] as OprData[],
        // autoNavigationPointsIndividual: [] as OprData[], // opr doesn't make sense for these
        autoFreightPoints: [] as OprData[],
        autoFreightPointsLevel1: [] as OprData[],
        autoFreightPointsLevel2: [] as OprData[],
        autoFreightPointsLevel3: [] as OprData[],
        autoFreightPointsStorage: [] as OprData[],
        autoBonusPoints: [] as OprData[],
        // autoBonusPointsIndividual: [] as OprData[], // opr doesn't make sense for these
        driverControlledAllianceHubPoints: [] as OprData[],
        driverControlledAllianceHubPointsLevel1: [] as OprData[],
        driverControlledAllianceHubPointsLevel2: [] as OprData[],
        driverControlledAllianceHubPointsLevel3: [] as OprData[],
        driverControlledSharedHubPoints: [] as OprData[],
        driverControlledStoragePoints: [] as OprData[],
        endgameDeliveryPoints: [] as OprData[],
        allianceBalancedPoints: [] as OprData[],
        sharedUnbalancedPoints: [] as OprData[],
        endgameParkingPoints: [] as OprData[],
        // endgameParkingPointsIndividual: [] as OprData[], // opr doesn't make sense for these
        cappingPoints: [] as OprData[],
        autoPoints: [] as OprData[],
        driverControlledPoints: [] as OprData[],
        endgamePoints: [] as OprData[],
        penaltyPoints: [] as OprData[],
        totalPoints: [] as OprData[],
        totalPointsNp: [] as OprData[],
    };

    matches.forEach((m) => {
        if (!m.scores2021) return;

        loadOprDataPoints(
            allDataPoints,
            m.scores2021.find((s) => s.alliance == Alliance.RED)!,
            m.teams.filter((t) => stationIsRed(t.station)).map((t) => t.teamNumber)
        );
        loadOprDataPoints(
            allDataPoints,
            m.scores2021.find((s) => s.alliance == Alliance.BLUE)!,
            m.teams.filter((t) => stationIsBlue(t.station)).map((t) => t.teamNumber)
        );
    });

    let ret: Record<number, TepStats2021> = {};
    teams.forEach((t) => {
        let a = stats[t].avg;
        ret[t] = {
            autoNavigationPointsIndividual: a.autoNavigationPointsIndividual,
            autoBonusPointsIndividual: a.autoBonusPointsIndividual,
            endgameParkingPointsIndividual: a.endgameParkingPointsIndividual,
        } as any;
    });

    assignOprStat(allDataPoints, ret, "autoCarouselPoints");
    assignOprStat(allDataPoints, ret, "autoNavigationPoints");
    assignOprStat(allDataPoints, ret, "autoFreightPoints");
    assignOprStat(allDataPoints, ret, "autoFreightPointsLevel1");
    assignOprStat(allDataPoints, ret, "autoFreightPointsLevel2");
    assignOprStat(allDataPoints, ret, "autoFreightPointsLevel3");
    assignOprStat(allDataPoints, ret, "autoFreightPointsStorage");
    assignOprStat(allDataPoints, ret, "autoBonusPoints");
    assignOprStat(allDataPoints, ret, "driverControlledAllianceHubPoints");
    assignOprStat(allDataPoints, ret, "driverControlledAllianceHubPointsLevel1");
    assignOprStat(allDataPoints, ret, "driverControlledAllianceHubPointsLevel2");
    assignOprStat(allDataPoints, ret, "driverControlledAllianceHubPointsLevel3");
    assignOprStat(allDataPoints, ret, "driverControlledSharedHubPoints");
    assignOprStat(allDataPoints, ret, "driverControlledStoragePoints");
    assignOprStat(allDataPoints, ret, "endgameDeliveryPoints");
    assignOprStat(allDataPoints, ret, "allianceBalancedPoints");
    assignOprStat(allDataPoints, ret, "sharedUnbalancedPoints");
    assignOprStat(allDataPoints, ret, "endgameParkingPoints");
    assignOprStat(allDataPoints, ret, "cappingPoints");
    assignOprStat(allDataPoints, ret, "autoPoints");
    assignOprStat(allDataPoints, ret, "driverControlledPoints");
    assignOprStat(allDataPoints, ret, "endgamePoints");
    assignOprStat(allDataPoints, ret, "penaltyPoints");
    assignOprStat(allDataPoints, ret, "totalPoints");
    assignOprStat(allDataPoints, ret, "totalPointsNp");

    return ret;
}

function assignOprStat(data: Record<string, OprData[]>, records: Record<number, TepStats2021>, statName: string) {
    let calculated = calculateOPR(data[statName]);

    for (let [team, stat] of Object.entries(calculated)) {
        (records[+team] as any)[statName] = stat;
    }
}

function loadOprDataPoints(data: Record<string, OprData[]>, scores: MatchScores2021, teams: number[]) {
    let [team1, team2] = teams;
    data.autoCarouselPoints.push({ team1, team2, result: scores.autoCarouselPoints });
    data.autoNavigationPoints.push({ team1, team2, result: scores.autoNavigationPoints });
    // data.autoNavigationPointsIndividual.push({ team1, team2, result: scores.autoNav });
    data.autoFreightPoints.push({ team1, team2, result: scores.autoFreightPoints });
    data.autoFreightPointsLevel1.push({ team1, team2, result: scores.autoFreight1 * 6 });
    data.autoFreightPointsLevel2.push({ team1, team2, result: scores.autoFreight2 * 6 });
    data.autoFreightPointsLevel3.push({ team1, team2, result: scores.autoFreight3 * 6 });
    data.autoFreightPointsStorage.push({ team1, team2, result: scores.autoStorageFreight * 2 });
    data.autoBonusPoints.push({ team1, team2, result: scores.autoBonusPoints });
    // data.autoBonusPointsIndividual.push({ team1, team2, result: scores });
    data.driverControlledAllianceHubPoints.push({ team1, team2, result: scores.driverControlledAllianceHubPoints });
    data.driverControlledAllianceHubPointsLevel1.push({ team1, team2, result: scores.driverControlledFreight1 * 2 });
    data.driverControlledAllianceHubPointsLevel2.push({ team1, team2, result: scores.driverControlledFreight2 * 4 });
    data.driverControlledAllianceHubPointsLevel3.push({ team1, team2, result: scores.driverControlledFreight3 * 6 });
    data.driverControlledSharedHubPoints.push({ team1, team2, result: scores.driverControlledSharedHubPoints! });
    data.driverControlledStoragePoints.push({ team1, team2, result: scores.driverControlledStoragePoints });
    data.endgameDeliveryPoints.push({ team1, team2, result: scores.endgameDeliveryPoints });
    data.allianceBalancedPoints.push({ team1, team2, result: scores.allianceBalancedPoints });
    data.sharedUnbalancedPoints.push({ team1, team2, result: scores.sharedUnbalancedPoints! });
    data.endgameParkingPoints.push({ team1, team2, result: scores.endgameParkingPoints });
    // data.endgameParkingPointsIndividual.push({ team1, team2, result: scores });
    data.cappingPoints.push({ team1, team2, result: scores.cappingPoints });
    data.autoPoints.push({ team1, team2, result: scores.autoPoints });
    data.driverControlledPoints.push({ team1, team2, result: scores.driverControlledPoints });
    data.endgamePoints.push({ team1, team2, result: scores.endgamePoints });
    data.penaltyPoints.push({ team1, team2, result: scores.penaltyPoints });
    data.totalPoints.push({ team1, team2, result: scores.totalPoints });
    data.totalPointsNp.push({ team1, team2, result: scores.totalPointsNp });
}

function getTeamsScoresTrad(teamNumber: number, matches: Match[]): [MatchScores2021, 0 | 1][] {
    return matches
        .map((m) => {
            if (m.tournamentLevel != TournamentLevel.QUALS || !m.scores2021) return [];

            let rScore = m.scores2021.find((s) => s.alliance == Alliance.RED)!;
            let bScore = m.scores2021.find((s) => s.alliance == Alliance.BLUE)!;

            let r1 = m.teams.find((t) => t.station == Station.RED_1)!;
            let r2 = m.teams.find((t) => t.station == Station.RED_2)!;
            let b1 = m.teams.find((t) => t.station == Station.BLUE_1)!;
            let b2 = m.teams.find((t) => t.station == Station.BLUE_2)!;

            if (teamNumber == r1.teamNumber && !r1.surrogate) {
                return [[rScore, 0] as [MatchScores2021, 0 | 1]];
            } else if (teamNumber == r2.teamNumber && !r2.surrogate) {
                return [[rScore, 1] as [MatchScores2021, 0 | 1]];
            } else if (teamNumber == b1.teamNumber && !b1.surrogate) {
                return [[bScore, 0] as [MatchScores2021, 0 | 1]];
            } else if (teamNumber == b2.teamNumber && !b2.surrogate) {
                return [[bScore, 1] as [MatchScores2021, 0 | 1]];
            } else {
                return [];
            }
        })
        .flat();
}

function getTeamsScoresRemote(teamNumber: number, matches: Match[]): MatchScores2021[] {
    return matches
        .filter((m) => m.teams[0].teamNumber == teamNumber)
        .map((m) => m.scores2021)
        .filter((s) => s)
        .flat();
}
