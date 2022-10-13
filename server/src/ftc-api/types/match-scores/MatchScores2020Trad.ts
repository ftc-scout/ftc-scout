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
    team: number;
    adjust: number;
    dcPoints: number;
    autoPoints: number;
    dcTowerLow: number;
    dcTowerMid: number;
    dcTowerHigh: number;
    navigated1: boolean;
    navigated2: boolean;
    wobbleDelivered1: boolean;
    wobbleDelivered2: boolean;
    autoTowerLow: number;
    autoTowerMid: number;
    autoTowerHigh: number;
    autoTowerPoints: number;
    autoPowerShotLeft: boolean;
    autoPowerShotCenter: boolean;
    autoPowerShotRight: boolean;
    autoPowerShotPoints: number;
    wobbleRings1: number;
    wobbleRings2: number;
    wobbleEnd1: number;
    wobbleEnd2: number;
    wobbleEndPoints: number;
    wobbleRingPoints: number;
    autoWobblePoints: number;
    endPowerShotLeft: boolean;
    endPowerShotCenter: boolean;
    endPowerShotRight: boolean;
    endPowerShotPoints: number;
    penaltyPoints: number;
    majorPenalties: number;
    minorPenalties: number;
    navigationPoints: number;
    endgamePoints: number;
    totalPoints: number;
}
