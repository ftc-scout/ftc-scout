export type ApiConeType =
    | "MY_CONE"
    | "OTHER_CONE"
    | "MY_R1_BEACON"
    | "MY_R2_BEACON"
    | "OTHER_R1_BEACON"
    | "OTHER_R2_BEACON";

export interface AllianceScores2022TradFtcApi {
    alliance: "Blue" | "Red";
    team: number;
    sideOfField: string | "SCORING_SIDE";
    initSignalSleeve1: boolean;
    initSignalSleeve2: boolean;
    robot1Auto: "NONE" | "SIGNAL_ZONE" | "SUBSTATION_TERMINAL";
    robot2Auto: "NONE" | "SIGNAL_ZONE" | "SUBSTATION_TERMINAL";
    autoTerminal: number;
    autoJunctions: ApiConeType[][][];
    dcJunctions: ApiConeType[][][];
    dcTerminalNear: number;
    dcTerminalFar: number;
    dcTerminalOther: number;
    egNavigated1: boolean;
    egNavigated2: boolean;
    minorPenalties: number;
    majorPenalties: number;
    autoNavigationPoints: number;
    signalBonusPoints: number;
    autoJunctionConePoints: number;
    autoTerminalConePoints: number;
    dcJunctionConePoints: number;
    dcTerminalConePoints: number;
    ownershipPoints: number;
    circuitPoints: number;
    egNavigationPoints: number;
    autoPoints: number;
    dcPoints: number;
    endgamePoints: number;
    penaltyPointsCommitted: number;
    prePenaltyTotal: number;
    autoJunctionCones: [number, number, number, number];
    dcJunctionCones: [number, number, number, number];
    beacons: number;
    ownedJunctions: number;
    circuit: boolean;
    totalPoints: number;
}
