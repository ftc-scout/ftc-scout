export interface MatchScores2020RemoteFtcApi {
    matchLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
    matchNumber: number;
    randomization: number;
    teamNumber: number;
    scores: Scores2020RemoteFtcApi;
}

export interface Scores2020RemoteFtcApi {
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
