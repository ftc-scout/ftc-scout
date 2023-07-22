import { GraphQLObjectType } from "graphql";
import {
    AllianceScores2022TradFtcApi,
    ApiConeType,
} from "../../../ftc-api-types/match-scores/MatchScores2022Trad";
import { Alliance } from "../../Alliance";
import { Season } from "../../Season";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { AnyDTy, BoolDTy, EnumDTy, IntDTy, IntTy, listTy, nn } from "../types";
import { Station } from "../../Station";

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

function coneLayoutFromDb(red: any, blue: any, auto: boolean): ConeLayout {
    return {
        redNearTerminal: auto ? red.autoTerminalCones : red.dcNearTerminalCones,
        redFarTerminal: auto ? 0 : red.dcFarTerminalCones,
        blueNearTerminal: auto ? blue.autoTerminalCones : blue.dcNearTerminalCones,
        blueFarTerminal: auto ? 0 : blue.dcFarTerminalCones,
        junctions: auto ? red.autoConeLayout : red.dcConeLayout,
    };
}

type API = AllianceScores2022TradFtcApi;

export const Descriptor2022 = new Descriptor({
    season: Season.PowerPlay,
    hasRemote: false,
    pensSubtract: false,
    rankings: {
        rp: "Record",
        tb: "AutoEndgameAvg",
    },
})
    .addColumn(
        new DescriptorColumn({ name: "autoNav1" })
            .addMatchScore({
                apiName: "autoNav2022_1",
                remoteApiName: "autoNav2022",
                create: {
                    fromApi: (api: API) =>
                        autoNav2022FromApi(api.robot1Auto, api.initSignalSleeve1),
                },
                dataTy: AutoNav2022DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2" })
            .addMatchScore({
                apiName: "autoNav2022_2",
                create: {
                    fromApi: (api: API) =>
                        autoNav2022FromApi(api.robot2Auto, api.initSignalSleeve2),
                },
                dataTy: AutoNav2022DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTerminalCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.autoTerminal },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoGroundCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.autoJunctionCones[0] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLowCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.autoJunctionCones[1] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoMediumCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.autoJunctionCones[2] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoHighCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.autoJunctionCones[3] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoConeLayout" })
            .addMatchScore({
                outer: true,
                create: {
                    fromApi: (api: API) => junctionsFromApi(api.autoJunctions, api.alliance),
                },
                dataTy: ConeLayoutDTy,
                apiMap: (r, b) => coneLayoutFromDb(r, b, true),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcNearTerminalCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.dcTerminalNear },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFarTerminalCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.dcTerminalFar },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTerminalCones" })
            .addMatchScore({
                create: { fromSelf: (self) => self.dcNearTerminalCones + self.dcFarTerminalCones },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcGroundCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.dcJunctionCones[0] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcLowCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.dcJunctionCones[1] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcMediumCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.dcJunctionCones[2] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcHighCones" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.dcJunctionCones[3] },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcConeLayout" })
            .addMatchScore({
                outer: true,
                create: { fromApi: (api: API) => junctionsFromApi(api.dcJunctions, api.alliance) },
                dataTy: ConeLayoutDTy,
                apiMap: (r, b) => coneLayoutFromDb(r, b, false),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egNav1" })
            .addMatchScore({
                remoteApiName: "egNav",
                create: { fromApi: (api: API) => api.egNavigated1 },
                dataTy: BoolDTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egNav2" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.egNavigated2 },
                dataTy: BoolDTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "coneOwnedJunctions" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.ownedJunctions - api.beacons },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "beaconOwnedJunctions" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.beacons },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "circuit" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.circuit },
                dataTy: BoolDTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommitted" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.minorPenalties },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommitted" })
            .addMatchScore({
                create: { fromApi: (api: API) => api.majorPenalties },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOpp" })
            .addMatchScore({
                create: { fromApi: (_, api: API) => api.minorPenalties },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsByOpp" })
            .addMatchScore({
                create: { fromApi: (_, api: API) => api.majorPenalties },
                dataTy: IntDTy(8),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPoints" })
            .addMatchScore({
                create: {
                    fromSelf: (self) =>
                        autoNav2022Points(self.autoNav1) + autoNav2022Points(self.autoNav2),
                },
                dataTy: IntDTy(16),
            })
            .addTep({})
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.One
                        ? autoNav2022Points(ms.autoNav2022_1)
                        : autoNav2022Points(ms.autoNav2022_2),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoConePoints" })
            .addMatchScore({
                create: {
                    fromSelf: (self) =>
                        self.autoTerminalCones * 1 +
                        self.autoGroundCones * 2 +
                        self.autoLowCones * 3 +
                        self.autoMediumCones * 4 +
                        self.autoHighCones * 5,
                },
                dataTy: IntDTy(16),
            })
            .addTep({})
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTerminalPoints" })
            .addTep({ make: (ms) => ms.autoTerminalCones * 1 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoGroundPoints" })
            .addTep({ make: (ms) => ms.autoGroundCones * 2 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLowPoints" })
            .addTep({ make: (ms) => ms.autoLowCones * 3 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoMediumPoints" })
            .addTep({ make: (ms) => ms.autoMediumCones * 4 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoHighPoints" })
            .addTep({ make: (ms) => ms.autoHighCones * 5 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egNavPoints" })
            .addMatchScore({
                create: { fromSelf: (self) => self.egNav1 * 2 + self.egNav2 * 2 },
                dataTy: IntDTy(8),
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "egNavPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) => (station == Station.One ? ms.egNav1 : ms.egNav2) * 2,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "ownershipPoints" })
            .addMatchScore({
                create: {
                    fromSelf: (self) =>
                        self.coneOwnedJunctions * 3 + self.beaconOwnedJunctions * 10,
                },
                dataTy: IntDTy(8),
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "coneOwnershipPoints" })
            .addTep({ make: (ms) => ms.coneOwnedJunctions * 3 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "beaconOwnershipPoints" })
            .addTep({ make: (ms) => ms.coneOwnedJunctions * 10 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "circuitPoints" })
            .addMatchScore({
                create: { fromSelf: (self) => self.circuit * 20 },
                dataTy: IntDTy(8),
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommittedPoints" })
            .addTep({ make: (ms) => ms.majorsCommitted * 30 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommittedPoints" })
            .addTep({ make: (ms) => ms.minorsCommitted * 10 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                create: {
                    fromSelf: (self) => self.majorsCommitted * 30 + self.minorsCommitted * 10,
                },
                dataTy: IntDTy(16),
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsByOppPoints" })
            .addTep({ make: (ms) => ms.majorsByOpp * 30 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOppPoints" })
            .addTep({ make: (ms) => ms.minorsCommitted * 10 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsByOpp" })
            .addMatchScore({
                create: {
                    fromSelf: (self) => self.majorsByOpp * 30 + self.minorsByOpp * 10,
                },
                dataTy: IntDTy(16),
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                create: { fromSelf: (self) => self.autoNavPoints + self.autoConePoints },
                dataTy: IntDTy(16),
            })
            .addTep({})
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                create: {
                    fromSelf: (self) =>
                        self.dcTerminalCones * 1 +
                        self.dcGroundCones * 2 +
                        self.dcLowCones * 3 +
                        self.dcMediumCones * 4 +
                        self.dcHighCones * 5,
                },
                dataTy: IntDTy(16),
            })
            .addTep({})
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTerminalPoints" })
            .addTep({ make: (ms) => ms.dcTerminalCones * 1 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcGroundPoints" })
            .addTep({ make: (ms) => ms.dcGroundCones * 2 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcLowPoints" })
            .addTep({ make: (ms) => ms.dcLowCones * 3 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcMediumPoints" })
            .addTep({ make: (ms) => ms.dcMediumCones * 4 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcHighPoints" })
            .addTep({ make: (ms) => ms.dcHighCones * 5 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egPoints" })
            .addMatchScore({
                create: {
                    fromSelf: (self) =>
                        self.egNavPoints + self.ownershipPoints + self.circuitPoints,
                },
                dataTy: IntDTy(16),
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPointsNp" })
            .addMatchScore({
                create: { fromSelf: (self) => self.autoNavPoints + self.dcPoints + self.egPoints },
                dataTy: IntDTy(16),
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPoints" })
            .addMatchScore({
                create: { fromSelf: (self) => self.totalPointsNp + self.penaltyPointsByOpp },
                dataTy: IntDTy(16),
            })
            .addTep()
    )
    .finish();
