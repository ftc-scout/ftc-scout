import { AutoNavigation2020FtcApi } from "./MatchScores2020Trad";

export interface MatchScores2020RemoteFtcApi {
    matchLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
    matchNumber: number;
    randomization: number;
    teamNumber: number;
    scores: Scores2020RemoteFtcApi;
}

export interface Scores2020RemoteFtcApi {
    alliance: "Blue" | "Red";
    autoWobble: boolean;
    autoNavigated: AutoNavigation2020FtcApi;
    autoGoalLow: number;
    autoGoalMid: number;
    autoGoalHigh: number;
    autoPowershot: number;
    driverControlledGoalLow: number;
    driverControlledGoalMid: number;
    driverControlledGoalHigh: number;
    ringsOnWobble: number;
    wobbleEndPosititions: "DROP_ZONE" | "START_LINE";
    endgamePowerShots: number;
    minorPenalties: number;
    majorPenalties: number;
    autoNavigationPoints: number;
    autoGoalLowPoints: number;
    autoGoalMidPoints: number;
    autoGoalHighPoints: number;
    autoWobblePoints: number;
    driverControlledGoalLowPoints: number;
    driverControlledGoalMidPoints: number;
    driverControlledGoalHighPoints: number;
    ringsOnWobblePoints: number;
    totalGoalPoints: number;
    autoPoints: number;
    driverControlledPoints: number;
    endgamePoints: number;
    penaltyPoints: number;
    totalPoints: number;
}
