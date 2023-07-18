import { GraphQLObjectType } from "graphql";
import {
    AllianceScores2022TradFtcApi,
    ApiConeType,
} from "../../../ftc-api-types/match-scores/MatchScores2022Trad";
import { Alliance } from "../../Alliance";
import { Season } from "../../Season";
import { AnyObject, inferDescriptor } from "../descriptor";
import { AnyDTy, BoolDTy, EnumDTy, FloatDTy, IntDTy, IntTy, listTy, nn } from "../types";

export const AutoNav2022 = {
    None: "None",
    Terminal: "Terminal",
    Signal: "Signal",
    TeamSignal: "TeamSignal",
} as const;
export type AutoNav2022 = (typeof AutoNav2022)[keyof typeof AutoNav2022];
const AutoNav2022DTy = EnumDTy(AutoNav2022, "AutoNav2022");

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
const ConeTypeDTy = EnumDTy(ConeType, "ConeType");

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

function junctionsFromApi(api: ApiConeType[][][], myAlliance: Alliance): ConeType[][][] {
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

type ConeLayout = {
    redNearTerminal: number;
    redFarTerminal: number;
    blueNearTerminal: number;
    blueFarTerminal: number;
    junctions: ConeType[][][];
};

let coneLayoutGQL = new GraphQLObjectType({
    name: "ConeLayout",
    fields: {
        redNearTerminal: IntTy,
        redFarTerminal: IntTy,
        blueNearTerminal: IntTy,
        blueFarTerminal: IntTy,
        junctions: listTy(listTy(listTy({ type: nn(ConeTypeDTy.gql) }))),
    },
});
const ConeLayoutDTy = AnyDTy(coneLayoutGQL);

function coneLayoutFromDb(red: AnyObject, blue: AnyObject, auto: boolean): ConeLayout {
    return {
        redNearTerminal: auto ? red.autoTerminalCones : red.dcNearTerminalCones,
        redFarTerminal: auto ? 0 : red.dcFarTerminalCones,
        blueNearTerminal: auto ? blue.autoTerminalCones : blue.dcNearTerminalCones,
        blueFarTerminal: auto ? 0 : blue.dcFarTerminalCones,
        junctions: auto ? red.autoConeLayout : red.dcConeLayout,
    };
}

export const Descriptor2022 = inferDescriptor({
    season: Season.PowerPlay,
    hasRemote: false,
    penaltiesSubtract: false,
    rankings: {
        rp: "Record",
        tb: "AutoEndgameAvg",
    },
    columns: [
        {
            name: "autoNav1",
            type: AutoNav2022DTy,
            ms: {
                fromTradApi: (api) => autoNav2022FromApi(api.robot1Auto, api.initSignalSleeve1),
            },
        },
        {
            name: "autoNav2",
            type: AutoNav2022DTy,
            ms: {
                fromTradApi: (api) => autoNav2022FromApi(api.robot2Auto, api.initSignalSleeve2),
            },
        },
        {
            name: "autoTerminalCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api: AllianceScores2022TradFtcApi) => api.autoTerminal },
        },
        {
            name: "autoTerminalCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoTerminal },
        },
        {
            name: "autoGroundCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoJunctionCones[0] },
        },
        {
            name: "autoLowCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoJunctionCones[1] },
        },
        {
            name: "autoMediumCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoJunctionCones[2] },
        },
        {
            name: "autoHighCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoJunctionCones[3] },
        },
        {
            name: "autoConeLayout",
            type: ConeLayoutDTy,
            ms: {
                fromTradApi: (api) => junctionsFromApi(api.autoJunctions, api.alliance),
                outer: true,
                mapForApi: (r, b) => coneLayoutFromDb(r, b, true),
            },
        },
        {
            name: "dcNearTerminalCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcTerminalNear },
        },
        {
            name: "dcFarTerminalCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcTerminalFar },
        },
        {
            name: "dcTerminalCones",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.dcNearTerminalCones + self.dcFarTerminalCones },
        },
        {
            name: "dcGroundCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcJunctionCones[0] },
        },
        {
            name: "dcLowCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcJunctionCones[1] },
        },
        {
            name: "dcMediumCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcJunctionCones[2] },
        },
        {
            name: "dcHighCones",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcJunctionCones[3] },
        },
        {
            name: "dcConeLayout",
            type: ConeLayoutDTy,
            ms: {
                fromTradApi: (api) => junctionsFromApi(api.dcJunctions, api.alliance),
                outer: true,
                mapForApi: (r, b) => coneLayoutFromDb(r, b, false),
            },
        },
        {
            name: "egNav1",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.egNavigated1 },
        },
        {
            name: "egNav2",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.egNavigated2 },
        },
        {
            name: "coneOwnedJunctions",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.ownedJunctions - api.beacons },
        },
        {
            name: "beaconOwnedJunctions",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.beacons },
        },
        {
            name: "circuit",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.circuit },
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
            name: "penaltyPointsCommitted",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.minorsCommitted * 10 + self.majorsCommitted * 30 },
            tep: {},
        },

        {
            name: "minorsByOpp",
            type: IntDTy(8),
            ms: { fromTradApi: (_, oth) => oth.minorPenalties },
        },
        {
            name: "majorsByOpp",
            type: IntDTy(8),
            ms: { fromTradApi: (_, oth) => oth.majorPenalties },
        },
        {
            name: "penaltyPointsByOpp",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.minorsByOpp * 10 + self.majorsByOpp * 30 },
            tep: {},
        },
        {
            name: "autoNavPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    autoNav2022Points(self.autoNav1) + autoNav2022Points(self.autoNav2),
            },
            tep: {
                individual: {
                    first: (self) => autoNav2022Points(self.autoNav1),
                    second: (self) => autoNav2022Points(self.autoNav2),
                },
            },
        },
        {
            name: "autoConePoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.autoTerminalCones * 1 +
                    self.autoGroundCones * 2 +
                    self.autoLowCones * 3 +
                    self.autoMediumCones * 4 +
                    self.autoHighCones * 5,
            },
            tep: {},
        },
        {
            name: "autoTerminalPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.autoTerminalCones },
        },
        {
            name: "autoGroundPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.autoGroundCones * 2 },
        },
        {
            name: "autoLowPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.autoLowCones * 3 },
        },
        {
            name: "autoMediumPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.autoMediumCones * 4 },
        },
        {
            name: "autoHighPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.autoTerminalCones * 5 },
        },
        {
            name: "egNavPoints",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.egNav1 * 2 + self.egNav2 * 2 },
            tep: {
                individual: {
                    first: (self) => self.egNav1 * 2,
                    second: (self) => self.egNav2 * 2,
                },
            },
        },
        {
            name: "ownershipPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) => self.coneOwnedJunctions * 3 + self.beaconOwnedJunctions * 10,
            },
            tep: {},
        },
        {
            name: "coneOwnershipPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.coneOwnedJunctions * 3 },
        },
        {
            name: "beaconOwnershipPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.beaconOwnedJunctions * 10 },
        },
        {
            name: "circuitPoints",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.circuit * 20 },
            tep: {},
        },
        {
            name: "autoPoints",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.autoNavPoints + self.autoConePoints },
            tep: {},
        },
        {
            name: "dcPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.dcTerminalCones * 1 +
                    self.dcGroundCones * 2 +
                    self.dcLowCones * 3 +
                    self.dcMediumCones * 4 +
                    self.dcHighCones * 5,
            },
            tep: {},
        },
        {
            name: "dcTerminalPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.dcTerminalCones },
        },
        {
            name: "dcGroundPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.dcGroundCones * 2 },
        },
        {
            name: "dcLowPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.dcLowCones * 3 },
        },
        {
            name: "dcMediumPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.dcMediumCones * 4 },
        },
        {
            name: "dcHighPoints",
            type: FloatDTy,
            tep: { fromSelf: (self) => self.dcTerminalCones * 5 },
        },
        {
            name: "egPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) => self.egNavPoints + self.ownershipPoints + self.circuitPoints,
            },
            tep: {},
        },
        {
            name: "totalPointsNp",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints },
            tep: {},
        },
        {
            name: "totalPoints",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.totalPointsNp + self.penaltyPointsByOpp },
            tep: {},
        },
    ],
});
