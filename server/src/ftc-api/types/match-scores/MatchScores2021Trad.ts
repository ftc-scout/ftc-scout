export interface MatchScores2021TradFtcApi {
    matchLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
    matchSeries: number;
    matchNumber: number;
    randomization: number;
    alliances: AllianceScores2021TradFtcApi[];
}

export type AutoNavigation2021FtcApi =
    | "NONE"
    | "IN_STORAGE"
    | "COMPLETELY_IN_STORAGE"
    | "IN_WAREHOUSE"
    | "COMPLETELY_IN_WAREHOUSE";

export interface AllianceScores2021TradFtcApi {
    alliance: "Blue" | "Red";
    barcodeElement1: "DUCK" | "TEAM_SHIPPING_ELEMENT";
    barcodeElement2: "DUCK" | "TEAM_SHIPPING_ELEMENT";
    carousel: boolean;
    autoNavigated1: AutoNavigation2021FtcApi;
    autoNavigated2: AutoNavigation2021FtcApi;
    autoBonus1: boolean;
    autoBonus2: boolean;
    autoStorageFreight: number;
    autoFreight1: number;
    autoFreight2: number;
    autoFreight3: number;
    driverControlledStorageFreight: number;
    driverControlledFreight1: number;
    driverControlledFreight2: number;
    driverControlledFreight3: number;
    sharedFreight: number;
    endgameDelivered: number;
    allianceBalanced: boolean;
    sharedUnbalanced: boolean;
    endgameParked1: "NONE" | "IN_WAREHOUSE" | "COMPLETELY_IN_WAREHOUSE";
    endgameParked2: "NONE" | "IN_WAREHOUSE" | "COMPLETELY_IN_WAREHOUSE";
    capped: number;
    minorPenalties: number;
    majorPenalties: number;
    carouselPoints: number;
    autoNavigationPoints: number;
    autoFreightPoints: number;
    autoBonusPoints: number;
    driverControlledAllianceHubPoints: number;
    driverControlledSharedHubPoints: number;
    driverControlledStoragePoints: number;
    endgameDeliveryPoints: number;
    allianceBalancedPoints: number;
    sharedUnbalancedPoints: number;
    endgameParkingPoints: number;
    cappingPoints: number;
    autoPoints: number;
    driverControlledPoints: number;
    endgamePoints: number;
    penaltyPoints: number;
    totalPoints: number;
}
