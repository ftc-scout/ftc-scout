export interface MatchScores2020TradFtcApi {
    matchLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
    matchSeries: number;
    matchNumber: number;
    randomization: number;
    alliances: AllianceScores2020TradFtcApi[];
}

export type AutoNavigation2020FtcApi = "NONE" | "PAST_LAUNCH_LINE";

export interface AllianceScores2020TradFtcApi {
    alliance: "Blue" | "Red";
    autoWobble1: boolean;
    autoWobble2: boolean;
    autoNavigated1: AutoNavigation2020FtcApi;
    autoNavigated2: AutoNavigation2020FtcApi;
    autoGoalLow: number;
    autoGoalMid: number;
    autoGoalHigh: number;
    autoPowershot: number;
    driverControlledGoalLow: number;
    driverControlledGoalMid: number;
    driverControlledGoalHigh: number;
    ringsOnWobble1: number;
    ringsOnWObble2: number;
    wobbleEndPosititions1: "NONE" | "DROP_ZONE" | "START_LINE";
    wobbleEndPosititions2: "NONE" | "DROP_ZONE" | "START_LINE";
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
