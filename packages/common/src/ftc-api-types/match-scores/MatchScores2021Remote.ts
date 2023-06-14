import { AutoNavigation2021FtcApi } from "./MatchScores2021Trad";

export interface Scores2021RemoteFtcApi {
    barcodeElement: "DUCK" | "TEAM_SHIPPING_ELEMENT";
    carousel: boolean;
    autoNavigated: AutoNavigation2021FtcApi;
    autoBonus: boolean;
    autoStorageFreight: number;
    autoFreight1: number;
    autoFreight2: number;
    autoFreight3: number;
    driverControlledStorageFreight: number;
    driverControlledFreight1: number;
    driverControlledFreight2: number;
    driverControlledFreight3: number;
    endgameDelivered: number;
    allianceBalanced: boolean;
    endgameParked: "NONE" | "IN_WAREHOUSE" | "COMPLETELY_IN_WAREHOUSE";
    capped: number;
    minorPenalties: number;
    majorPenalties: number;
    carouselPoints: number;
    autoNavigationPoints: number;
    autoFreightPoints: number;
    autoBonusPoints: number;
    driverControlledAllianceHubPoints: number;
    driverControlledStoragePoints: number;
    endgameDeliveryPoints: number;
    allianceBalancedPoints: number;
    endgameParkingPoints: number;
    cappingPoints: number;
    autoPoints: number;
    driverControlledPoints: number;
    endgamePoints: number;
    penaltyPoints: number;
    totalPoints: number;
}
