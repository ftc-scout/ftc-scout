import { Scores2021RemoteFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2021Remote";
import {
    AllianceScores2021TradFtcApi,
    AutoNavigation2021FtcApi,
} from "../../../ftc-api-types/match-scores/MatchScores2021Trad";
import { Season } from "../../Season";
import { inferDescriptor } from "../descriptor";
import { BoolDTy, EnumDTy, IntDTy } from "../types";

export const BarcodeElement2021 = {
    Duck: "Duck",
    TSE: "TSE",
} as const;
export type BarcodeElement2021 = (typeof BarcodeElement2021)[keyof typeof BarcodeElement2021];
const BarcodeElement2021DTy = EnumDTy(BarcodeElement2021, "BarcodeElement2021");

function barcodeElementFromApi(api: "DUCK" | "TEAM_SHIPPING_ELEMENT"): BarcodeElement2021 {
    switch (api) {
        case "DUCK":
            return BarcodeElement2021.Duck;
        case "TEAM_SHIPPING_ELEMENT":
            return BarcodeElement2021.TSE;
    }
}

export const AutoNav2021 = {
    None: "None",
    InStorage: "InStorage",
    CompletelyInStorage: "CompletelyInStorage",
    InWarehouse: "InWarehouse",
    CompletelyInWarehouse: "CompletelyInWarehouse",
} as const;
export type AutoNav2021 = (typeof AutoNav2021)[keyof typeof AutoNav2021];
const AutoNav2021DTy = EnumDTy(AutoNav2021, "AutoNav2021");

function autoNav2021FromApi(api: AutoNavigation2021FtcApi): AutoNav2021 {
    switch (api) {
        case "NONE":
            return AutoNav2021.None;
        case "IN_STORAGE":
            return AutoNav2021.InStorage;
        case "COMPLETELY_IN_STORAGE":
            return AutoNav2021.CompletelyInStorage;
        case "IN_WAREHOUSE":
            return AutoNav2021.InWarehouse;
        case "COMPLETELY_IN_WAREHOUSE":
            return AutoNav2021.CompletelyInWarehouse;
    }
}

export function autoNav2021Points(nav: AutoNav2021 | null): number {
    if (nav == null) return 0;

    switch (nav) {
        case "None":
            return 0;
        case "InStorage":
            return 3;
        case "CompletelyInStorage":
            return 6;
        case "InWarehouse":
            return 5;
        case "CompletelyInWarehouse":
            return 10;
    }
}

export const EgPark2021 = {
    None: "None",
    InWarehouse: "InWarehouse",
    CompletelyInWarehouse: "CompletelyInWarehouse",
} as const;
export type EgPark2021 = (typeof EgPark2021)[keyof typeof EgPark2021];
const EgPark2021DTy = EnumDTy(EgPark2021, "EgPark2021");

function egPark2021FromApi(api: "NONE" | "IN_WAREHOUSE" | "COMPLETELY_IN_WAREHOUSE"): EgPark2021 {
    switch (api) {
        case "NONE":
            return EgPark2021.None;
        case "IN_WAREHOUSE":
            return EgPark2021.InWarehouse;
        case "COMPLETELY_IN_WAREHOUSE":
            return EgPark2021.CompletelyInWarehouse;
    }
}

export function egPark2021Points(park: EgPark2021 | null): number {
    if (park == null) return 0;

    switch (park) {
        case "None":
            return 0;
        case "InWarehouse":
            return 3;
        case "CompletelyInWarehouse":
            return 6;
    }
}

export const Descriptor2021 = inferDescriptor({
    season: Season.FreightFrenzy,
    hasRemote: true,
    penaltiesSubtract: true,
    rankings: {
        rp: "TotalPoints",
        tb: "AutoEndgameTot",
    },
    columns: [
        {
            name: "barcodeElement1",
            type: BarcodeElement2021DTy,
            ms: {
                fromTradApi: (api: AllianceScores2021TradFtcApi) =>
                    barcodeElementFromApi(api.barcodeElement1),
                fromRemoteApi: (api: Scores2021RemoteFtcApi) =>
                    barcodeElementFromApi(api.barcodeElement),
            },
        },
        {
            name: "barcodeElement2",
            type: BarcodeElement2021DTy,
            tradOnly: true,
            ms: {
                fromTradApi: (api) => barcodeElementFromApi(api.barcodeElement2),
            },
        },
        {
            name: "autoCarousel",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.carousel },
        },
        {
            name: "autoNav2021_1",
            type: AutoNav2021DTy,
            ms: {
                fromTradApi: (api) => autoNav2021FromApi(api.autoNavigated1),
                fromRemoteApi: (api) => autoNav2021FromApi(api.autoNavigated),
            },
        },
        {
            name: "autoNav2021_2",
            type: AutoNav2021DTy,
            tradOnly: true,
            ms: {
                fromTradApi: (api) => autoNav2021FromApi(api.autoNavigated2),
            },
        },
        {
            name: "autoBonus1",
            type: BoolDTy,
            ms: {
                fromTradApi: (api) => api.autoBonus1,
                fromRemoteApi: (api) => api.autoBonus,
            },
        },
        {
            name: "autoBonus2",
            type: BoolDTy,
            tradOnly: true,
            ms: {
                fromTradApi: (api) => api.autoBonus2,
            },
        },
        {
            name: "autoStorageFreight",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoStorageFreight },
        },
        {
            name: "autoFreight1",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoFreight1 },
        },
        {
            name: "autoFreight2",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoFreight2 },
        },
        {
            name: "autoFreight3",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoFreight3 },
        },
        {
            name: "dcStorageFreight",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.driverControlledStorageFreight },
        },
        {
            name: "dcFreight1",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.driverControlledFreight1 },
        },
        {
            name: "dcFreight2",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.driverControlledFreight2 },
        },
        {
            name: "dcFreight3",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.driverControlledFreight3 },
        },
        {
            name: "sharedFreight",
            type: IntDTy(8),
            tradOnly: true,
            ms: {
                fromTradApi: (api) => api.sharedFreight,
            },
        },
        {
            name: "egDucks",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.endgameDelivered },
        },
        {
            name: "allianceBalanced",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.allianceBalanced },
        },
        {
            name: "sharedUnbalanced",
            type: BoolDTy,
            tradOnly: true,
            ms: {
                fromTradApi: (api) => api.sharedUnbalanced,
            },
        },
        {
            name: "egPark1",
            type: EgPark2021DTy,
            ms: {
                fromTradApi: (api) => egPark2021FromApi(api.endgameParked1),
                fromRemoteApi: (api) => egPark2021FromApi(api.endgameParked),
            },
        },
        {
            name: "egPark2",
            type: EgPark2021DTy,
            tradOnly: true,
            ms: {
                fromTradApi: (api) => egPark2021FromApi(api.endgameParked2),
            },
        },
        {
            name: "capped",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.capped },
        },
        {
            name: "minorsCommitted",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.minorPenalties },
        },
        {
            name: "majorsCommitted",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.majorPenalties },
        },
        {
            name: "autoCarouselPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.autoCarousel * 10 },
            tep: {},
        },
        {
            name: "autoNavPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) =>
                    autoNav2021Points(self.autoNav2021_1) + autoNav2021Points(self.autoNav2021_2),
            },
            tep: {
                individual: {
                    first: (self) => autoNav2021Points(self.autoNav2021_1),
                    second: (self) => autoNav2021Points(self.autoNav2021_2),
                },
            },
        },
        {
            name: "autoFreightPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) =>
                    self.autoStorageFreight * 2 +
                    (self.autoFreight1 + self.autoFreight2 + self.autoFreight3) * 6,
            },
            tep: {},
        },
        {
            name: "autoFreight1Points",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.autoFreight1 * 6 },
        },
        {
            name: "autoFreight2Points",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.autoFreight2 * 6 },
        },
        {
            name: "autoFreight3Points",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.autoFreight3 * 6 },
        },
        {
            name: "autoBonusPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) =>
                    (self.autoBonus1
                        ? self.barcodeElement1 == BarcodeElement2021.Duck
                            ? 10
                            : 20
                        : 0) +
                    (self.autoBonus2
                        ? self.barcodeElement2 == BarcodeElement2021.Duck
                            ? 10
                            : 20
                        : 0),
            },
            tep: {
                individual: {
                    first: (self) =>
                        self.autoBonus1
                            ? self.barcodeElement1 == BarcodeElement2021.Duck
                                ? 10
                                : 20
                            : 0,
                    second: (self) =>
                        self.autoBonus2
                            ? self.barcodeElement2 == BarcodeElement2021.Duck
                                ? 10
                                : 20
                            : 0,
                },
            },
        },
        {
            name: "dcAllianceHubPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) => self.dcFreight1 * 2 + self.dcFreight2 * 4 + self.dcFreight3 * 6,
            },
            tep: {},
        },
        {
            name: "dcFreight1Points",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.dcFreight1 * 2 },
        },
        {
            name: "dcFreight2Points",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.dcFreight2 * 4 },
        },
        {
            name: "dcFreight3Points",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.dcFreight3 * 6 },
        },
        {
            name: "dcSharedHubPoints",
            type: IntDTy(8),
            tradOnly: true,
            ms: {
                fromSelf: (self) => (self.sharedFreight ?? 0) * 4,
            },
            tep: {},
        },
        {
            name: "dcStoragePoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.dcStorageFreight ?? 0 },
            tep: {},
        },
        {
            name: "egDuckPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.egDucks * 6 },
            tep: {},
        },
        {
            name: "allianceBalancedPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => (self.allianceBalanced ? 10 : 0) },
            tep: {},
        },
        {
            name: "sharedUnbalancedPoints",
            type: IntDTy(8),
            tradOnly: true,
            ms: {
                fromSelf: (self) => (self.sharedUnbalanced ? 20 : 0),
            },
            tep: {},
        },
        {
            name: "egParkPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) => egPark2021Points(self.egPark1) + egPark2021Points(self.egPark2),
            },
            tep: {
                individual: {
                    first: (self) => egPark2021Points(self.egPark1),
                    second: (self) => egPark2021Points(self.egPark2),
                },
            },
        },
        {
            name: "cappingPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.capped * 15 },
            tep: {},
        },
        {
            name: "majorsCommittedPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.majorsCommitted * -30 },
        },
        {
            name: "minorsCommittedPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.minorsCommitted * -10 },
        },
        {
            name: "autoPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.autoCarouselPoints +
                    self.autoNavPoints +
                    self.autoFreightPoints +
                    self.autoBonusPoints,
            },
            tep: {},
        },
        {
            name: "dcPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.dcAllianceHubPoints + self.dcStoragePoints + self.dcSharedHubPoints,
            },
            tep: {},
        },
        {
            name: "egPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.egDuckPoints +
                    self.allianceBalancedPoints +
                    (self.sharedUnbalancedPoints ?? 0) +
                    self.egParkPoints +
                    self.cappingPoints,
            },
            tep: {},
        },
        {
            name: "penaltyPoints",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.majorsCommitted * -30 + self.minorsCommitted * -10 },
            tep: {},
        },
        {
            name: "totalPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    Math.max(
                        0,
                        self.autoPoints + self.dcPoints + self.egPoints + self.penaltyPoints
                    ),
            },
            tep: {},
        },
        {
            name: "totalPointsNp",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints },
            tep: {},
        },
    ],
    scoreTree: [],
});
