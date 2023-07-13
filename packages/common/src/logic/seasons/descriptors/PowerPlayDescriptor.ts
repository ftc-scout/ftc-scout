import {
    AllianceScores2022TradFtcApi,
    ApiConeType,
} from "../../../ftc-api-types/match-scores/MatchScores2022Trad";
import { Alliance } from "../../Alliance";
import { Season } from "../../Season";
import { type SeasonDescriptor, inferMSTD } from "../descriptor_types";

export const AutoNav2022 = {
    None: "None",
    Terminal: "Terminal",
    Signal: "Signal",
    TeamSignal: "TeamSignal",
} as const;
export type AutoNav2022 = (typeof AutoNav2022)[keyof typeof AutoNav2022];

function autoNav2022FromApi(
    place: "NONE" | "SIGNAL_ZONE" | "SUBSTATION_TERMINAL",
    signalSleeve: boolean
): AutoNav2022 {
    if (place == "NONE") {
        return AutoNav2022.None;
    } else if (place == "SIGNAL_ZONE") {
        return signalSleeve ? AutoNav2022.TeamSignal : AutoNav2022.Signal;
    } else {
        return AutoNav2022.Terminal;
    }
}

function autoNav2022Points(autoNav: AutoNav2022): number {
    switch (autoNav) {
        case "None":
            return 0;
        case "Terminal":
            return 2;
        case "Signal":
            return 10;
        case "TeamSignal":
            return 20;
    }
}

export const ConeType = {
    RedCone: "RedCone",
    BlueCone: "BlueCone",
    RedBeacon1: "RedBeacon1",
    BlueBeacon1: "BlueBeacon1",
    RedBeacon2: "RedBeacon2",
    BlueBeacon2: "BlueBeacon2",
} as const;
export type ConeType = (typeof ConeType)[keyof typeof ConeType];

function coneTypeFromApi(coneType: ApiConeType, myColor: Alliance): ConeType {
    switch (coneType) {
        case "MY_CONE":
            return myColor == Alliance.Red ? ConeType.RedCone : ConeType.BlueCone;
        case "OTHER_CONE":
            return myColor == Alliance.Red ? ConeType.BlueCone : ConeType.RedCone;
        case "MY_R1_BEACON":
            return myColor == Alliance.Red ? ConeType.RedBeacon1 : ConeType.BlueBeacon1;
        case "MY_R2_BEACON":
            return myColor == Alliance.Red ? ConeType.RedBeacon2 : ConeType.BlueBeacon2;
        case "OTHER_R1_BEACON":
            return myColor == Alliance.Red ? ConeType.BlueBeacon1 : ConeType.RedBeacon1;
        case "OTHER_R2_BEACON":
            return myColor == Alliance.Red ? ConeType.BlueBeacon2 : ConeType.RedBeacon2;
    }
}

function coneLayoutFromApi(api: ApiConeType[][][], myAlliance: Alliance): ConeType[][][] {
    let res: ConeType[][][] = [
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
        [[], [], [], [], []],
    ];
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            if (api.length > x && api[x].length > y) {
                for (let c of api[x][y]) {
                    res[4 - y][4 - x].push(coneTypeFromApi(c, myAlliance));
                }
            }
        }
    }
    return res;
}

export const SeasonDescriptor2022: SeasonDescriptor = {
    season: Season.PowerPlay,
    hasRemote: false,
};

export const MatchScoreTD2022 = inferMSTD({
    season: Season.PowerPlay,
    columns: [
        {
            name: "autoNav1",
            ty: "enum",
            enum: AutoNav2022,
            fromApi: (api: AllianceScores2022TradFtcApi) =>
                autoNav2022FromApi(api.robot1Auto, api.initSignalSleeve1),
        },
        {
            name: "autoNav2",
            ty: "enum",
            enum: AutoNav2022,
            fromApi: (api) => autoNav2022FromApi(api.robot2Auto, api.initSignalSleeve2),
        },
        {
            name: "autoTerminalCones",
            ty: "int8",
            fromApi: (api) => api.autoTerminal,
        },
        {
            name: "autoTerminalCones",
            ty: "int8",
            fromApi: (api) => api.autoTerminal,
        },
        {
            name: "autoGroundCones",
            ty: "int8",
            fromApi: (api) => api.autoJunctionCones[0],
        },
        {
            name: "autoLowCones",
            ty: "int8",
            fromApi: (api) => api.autoJunctionCones[1],
        },
        {
            name: "autoMediumCones",
            ty: "int8",
            fromApi: (api) => api.autoJunctionCones[2],
        },
        {
            name: "autoHighCones",
            ty: "int8",
            fromApi: (api) => api.autoJunctionCones[3],
        },
        {
            name: "autoConeLayout",
            ty: "json",
            fromApi: (api) => coneLayoutFromApi(api.autoJunctions, api.alliance),
        },
        {
            name: "dcNearTerminalCones",
            ty: "int8",
            fromApi: (api) => api.dcTerminalNear,
        },
        {
            name: "dcFarTerminalCones",
            ty: "int8",
            fromApi: (api) => api.dcTerminalFar,
        },
        {
            name: "dcTerminalCones",
            ty: "int8",
            fromSelf: (self) => self.dcNearTerminalCones + self.dcFarTerminalCones,
        },
        {
            name: "dcGroundCones",
            ty: "int8",
            fromApi: (api) => api.dcJunctionCones[0],
        },
        {
            name: "dcLowCones",
            ty: "int8",
            fromApi: (api) => api.dcJunctionCones[1],
        },
        {
            name: "dcMediumCones",
            ty: "int8",
            fromApi: (api) => api.dcJunctionCones[2],
        },
        {
            name: "dcHighCones",
            ty: "int8",
            fromApi: (api) => api.dcJunctionCones[3],
        },
        {
            name: "dcConeLayout",
            ty: "json",
            fromApi: (api) => coneLayoutFromApi(api.dcJunctions, api.alliance),
        },
        {
            name: "egNav1",
            ty: "bool",
            fromApi: (api) => api.egNavigated1,
        },
        {
            name: "egNav2",
            ty: "bool",
            fromApi: (api) => api.egNavigated2,
        },
        {
            name: "coneOwnedJunctions",
            ty: "int8",
            fromApi: (api) => api.ownedJunctions - api.beacons,
        },
        {
            name: "beaconOwnedJunctions",
            ty: "int8",
            fromApi: (api) => api.beacons,
        },
        {
            name: "circuit",
            ty: "bool",
            fromApi: (api) => api.circuit,
        },
        {
            name: "minorsCommitted",
            ty: "int8",
            fromApi: (api) => api.minorPenalties,
        },
        {
            name: "majorsCommitted",
            ty: "int8",
            fromApi: (api) => api.majorPenalties,
        },
        {
            name: "penaltyPointsCommitted",
            ty: "smallint",
            fromSelf: (self) => self.minorsCommitted * 10 + self.majorsCommitted * 30,
        },

        {
            name: "minorsByOpp",
            ty: "int8",
            fromApi: (_, oth) => oth.minorPenalties,
        },
        {
            name: "majorsByOpp",
            ty: "int8",
            fromApi: (_, oth) => oth.majorPenalties,
        },
        {
            name: "penaltyPointsByOpp",
            ty: "smallint",
            fromSelf: (self) => self.minorsByOpp * 10 + self.majorsByOpp * 30,
        },
        {
            name: "autoNavPoints",
            ty: "smallint",
            fromSelf: (self) => autoNav2022Points(self.autoNav1) + autoNav2022Points(self.autoNav2),
        },
        {
            name: "autoConePoints",
            ty: "smallint",
            fromSelf: (self) =>
                self.autoTerminalCones * 1 +
                self.autoGroundCones * 2 +
                self.autoLowCones * 3 +
                self.autoMediumCones * 4 +
                self.autoHighCones * 5,
        },
        {
            name: "egNavPoints",
            ty: "smallint",
            fromSelf: (self) => self.egNav1 * 2 + self.egNav2 * 2,
        },
        {
            name: "ownershipPoints",
            ty: "smallint",
            fromSelf: (self) => self.coneOwnedJunctions * 3 + self.beaconOwnedJunctions * 10,
        },
        {
            name: "circuitPoints",
            ty: "smallint",
            fromSelf: (self) => self.circuit * 20,
        },
        {
            name: "autoPoints",
            ty: "smallint",
            fromSelf: (self) => self.autoNavPoints + self.autoConePoints,
        },
        {
            name: "dcPoints",
            ty: "smallint",
            fromSelf: (self) =>
                self.dcTerminalCones * 1 +
                self.dcGroundCones * 2 +
                self.dcLowCones * 3 +
                self.dcMediumCones * 4 +
                self.dcHighCones * 5,
        },
        {
            name: "egPoints",
            ty: "smallint",
            fromSelf: (self) => self.egNavPoints + self.ownershipPoints + self.circuitPoints,
        },
        {
            name: "totalPointsNp",
            ty: "smallint",
            fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints,
        },
        {
            name: "totalPoints",
            ty: "smallint",
            fromSelf: (self) => self.totalPointsNp + self.penaltyPointsByOpp,
        },
    ],
});
