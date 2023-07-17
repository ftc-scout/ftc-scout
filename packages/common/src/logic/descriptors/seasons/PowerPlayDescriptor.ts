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
    rankings: {
        rp: "Record",
        tb: "AutoEndgameAvg",
    },
    columns: [
        {
            name: "autoNav1",
            type: AutoNav2022DTy,
            msDb: {
                fromTradApi: (api) => autoNav2022FromApi(api.robot1Auto, api.initSignalSleeve1),
            },
            msApi: {},
        },
        {
            name: "autoNav2",
            type: AutoNav2022DTy,
            msDb: {
                fromTradApi: (api) => autoNav2022FromApi(api.robot2Auto, api.initSignalSleeve2),
            },
            msApi: {},
        },
        {
            name: "autoTerminalCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api: AllianceScores2022TradFtcApi) => api.autoTerminal },
            msApi: {},
        },
        {
            name: "autoTerminalCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.autoTerminal },
            msApi: {},
        },
        {
            name: "autoGroundCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.autoJunctionCones[0] },
            msApi: {},
        },
        {
            name: "autoLowCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.autoJunctionCones[1] },
            msApi: {},
        },
        {
            name: "autoMediumCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.autoJunctionCones[2] },
            msApi: {},
        },
        {
            name: "autoHighCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.autoJunctionCones[3] },
            msApi: {},
        },
        {
            name: "autoConeLayout",
            type: ConeLayoutDTy,
            msDb: { fromTradApi: (api) => junctionsFromApi(api.autoJunctions, api.alliance) },
            msApi: { outer: true, map: (r, b) => coneLayoutFromDb(r, b, true) },
        },
        {
            name: "dcNearTerminalCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.dcTerminalNear },
            msApi: {},
        },
        {
            name: "dcFarTerminalCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.dcTerminalFar },
            msApi: {},
        },
        {
            name: "dcTerminalCones",
            type: IntDTy(8),
            msDb: { fromSelf: (self) => self.dcNearTerminalCones + self.dcFarTerminalCones },
            msApi: {},
        },
        {
            name: "dcGroundCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.dcJunctionCones[0] },
            msApi: {},
        },
        {
            name: "dcLowCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.dcJunctionCones[1] },
            msApi: {},
        },
        {
            name: "dcMediumCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.dcJunctionCones[2] },
            msApi: {},
        },
        {
            name: "dcHighCones",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.dcJunctionCones[3] },
            msApi: {},
        },
        {
            name: "dcConeLayout",
            type: ConeLayoutDTy,
            msDb: { fromTradApi: (api) => junctionsFromApi(api.dcJunctions, api.alliance) },
            msApi: { outer: true, map: (r, b) => coneLayoutFromDb(r, b, false) },
        },
        {
            name: "egNav1",
            type: BoolDTy,
            msDb: { fromTradApi: (api) => api.egNavigated1 },
            msApi: {},
        },
        {
            name: "egNav2",
            type: BoolDTy,
            msDb: { fromTradApi: (api) => api.egNavigated2 },
            msApi: {},
        },
        {
            name: "coneOwnedJunctions",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.ownedJunctions - api.beacons },
            msApi: {},
        },
        {
            name: "beaconOwnedJunctions",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.beacons },
            msApi: {},
        },
        {
            name: "circuit",
            type: BoolDTy,
            msDb: { fromTradApi: (api) => api.circuit },
            msApi: {},
        },
        {
            name: "minorsCommitted",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.minorPenalties },
            msApi: {},
        },
        {
            name: "majorsCommitted",
            type: IntDTy(8),
            msDb: { fromTradApi: (api) => api.majorPenalties },
            msApi: {},
        },
        {
            name: "penaltyPointsCommitted",
            type: IntDTy(16),
            msDb: { fromSelf: (self) => self.minorsCommitted * 10 + self.majorsCommitted * 30 },
            msApi: {},
            tepDb: {},
        },

        {
            name: "minorsByOpp",
            type: IntDTy(8),
            msDb: { fromTradApi: (_, oth) => oth.minorPenalties },
            msApi: {},
        },
        {
            name: "majorsByOpp",
            type: IntDTy(8),
            msDb: { fromTradApi: (_, oth) => oth.majorPenalties },
            msApi: {},
        },
        {
            name: "penaltyPointsByOpp",
            type: IntDTy(16),
            msDb: { fromSelf: (self) => self.minorsByOpp * 10 + self.majorsByOpp * 30 },
            msApi: {},
            tepDb: {},
        },
        {
            name: "autoNavPoints",
            type: IntDTy(16),
            msDb: {
                fromSelf: (self) =>
                    autoNav2022Points(self.autoNav1) + autoNav2022Points(self.autoNav2),
            },
            msApi: {},
            tepDb: {
                individual: {
                    first: (self) => autoNav2022Points(self.autoNav1),
                    second: (self) => autoNav2022Points(self.autoNav2),
                },
            },
        },
        {
            name: "autoConePoints",
            type: IntDTy(16),
            msDb: {
                fromSelf: (self) =>
                    self.autoTerminalCones * 1 +
                    self.autoGroundCones * 2 +
                    self.autoLowCones * 3 +
                    self.autoMediumCones * 4 +
                    self.autoHighCones * 5,
            },
            msApi: {},
            tepDb: {},
        },
        {
            name: "autoTerminalPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.autoTerminalCones },
        },
        {
            name: "autoGroundPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.autoGroundCones * 2 },
        },
        {
            name: "autoLowPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.autoLowCones * 3 },
        },
        {
            name: "autoMediumPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.autoMediumCones * 4 },
        },
        {
            name: "autoHighPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.autoTerminalCones * 5 },
        },
        {
            name: "egNavPoints",
            type: IntDTy(16),
            msDb: { fromSelf: (self) => self.egNav1 * 2 + self.egNav2 * 2 },
            msApi: {},
            tepDb: {
                individual: {
                    first: (self) => self.egNav1 * 2,
                    second: (self) => self.egNav2 * 2,
                },
            },
        },
        {
            name: "ownershipPoints",
            type: IntDTy(16),
            msDb: {
                fromSelf: (self) => self.coneOwnedJunctions * 3 + self.beaconOwnedJunctions * 10,
            },
            msApi: {},
            tepDb: {},
        },
        {
            name: "coneOwnershipPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.coneOwnedJunctions * 3 },
        },
        {
            name: "beaconOwnershipPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.beaconOwnedJunctions * 10 },
        },
        {
            name: "circuitPoints",
            type: IntDTy(16),
            msDb: { fromSelf: (self) => self.circuit * 20 },
            msApi: {},
            tepDb: {},
        },
        {
            name: "autoPoints",
            type: IntDTy(16),
            msDb: { fromSelf: (self) => self.autoNavPoints + self.autoConePoints },
            msApi: {},
            tepDb: {},
        },
        {
            name: "dcPoints",
            type: IntDTy(16),
            msDb: {
                fromSelf: (self) =>
                    self.dcTerminalCones * 1 +
                    self.dcGroundCones * 2 +
                    self.dcLowCones * 3 +
                    self.dcMediumCones * 4 +
                    self.dcHighCones * 5,
            },
            msApi: {},
            tepDb: {},
        },
        {
            name: "dcTerminalPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.dcTerminalCones },
        },
        {
            name: "dcGroundPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.dcGroundCones * 2 },
        },
        {
            name: "dcLowPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.dcLowCones * 3 },
        },
        {
            name: "dcMediumPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.dcMediumCones * 4 },
        },
        {
            name: "dcHighPoints",
            type: FloatDTy,
            tepDb: { fromSelf: (self) => self.dcTerminalCones * 5 },
        },
        {
            name: "egPoints",
            type: IntDTy(16),
            msDb: {
                fromSelf: (self) => self.egNavPoints + self.ownershipPoints + self.circuitPoints,
            },
            msApi: {},
            tepDb: {},
        },
        {
            name: "totalPointsNp",
            type: IntDTy(16),
            msDb: { fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints },
            msApi: {},
            tepDb: {},
        },
        {
            name: "totalPoints",
            type: IntDTy(16),
            msDb: { fromSelf: (self) => self.totalPointsNp + self.penaltyPointsByOpp },
            msApi: {},
            tepDb: {},
        },
    ],
});
