import {
    GraphQLEnumType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
} from "graphql";
import {
    AllianceScores2022TradFtcApi,
    ApiConeType,
} from "../../../ftc-api-types/match-scores/MatchScores2022Trad";
import { Alliance } from "../../Alliance";
import { Season } from "../../Season";
import { type SeasonDescriptor, inferMSTD } from "../descriptor_types";
import { makeGQLEnum } from "../../../utils/makeGQLEnum";

export const AutoNav2022 = {
    None: "None",
    Terminal: "Terminal",
    Signal: "Signal",
    TeamSignal: "TeamSignal",
} as const;
export type AutoNav2022 = (typeof AutoNav2022)[keyof typeof AutoNav2022];
const autoNav2022GQL = makeGQLEnum(AutoNav2022, "AutoNav2022");

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
const coneTypeGQL = makeGQLEnum(ConeType, "ConeType");

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

let coneLayoutGQL = new GraphQLObjectType({
    name: "ConeLayout",
    fields: {
        redNearTerminal: { type: new GraphQLNonNull(GraphQLInt) },
        redFarTerminal: { type: new GraphQLNonNull(GraphQLInt) },
        blueNearTerminal: { type: new GraphQLNonNull(GraphQLInt) },
        blueFarTerminal: { type: new GraphQLNonNull(GraphQLInt) },
        junctions: {
            type: new GraphQLNonNull(
                new GraphQLList(
                    new GraphQLNonNull(
                        new GraphQLList(
                            new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(coneTypeGQL)))
                        )
                    )
                )
            ),
        },
    },
});

export const SeasonDescriptor2022: SeasonDescriptor = {
    season: Season.PowerPlay,
    hasRemote: false,
};

export const MatchScoreTD2022 = inferMSTD({
    ...SeasonDescriptor2022,
    gqlTys: [autoNav2022GQL, coneTypeGQL, coneLayoutGQL],
    columns: [
        {
            dbName: "autoNav1",
            dbTy: "enum",
            enum: AutoNav2022,
            apiTy: autoNav2022GQL,
            fromApi: (api) => autoNav2022FromApi(api.robot1Auto, api.initSignalSleeve1),
        },
        {
            dbName: "autoNav2",
            dbTy: "enum",
            enum: AutoNav2022,
            apiTy: autoNav2022GQL,
            fromApi: (api) => autoNav2022FromApi(api.robot2Auto, api.initSignalSleeve2),
        },
        {
            dbName: "autoTerminalCones",
            dbTy: "int8",
            fromApi: (api: AllianceScores2022TradFtcApi) => api.autoTerminal,
        },
        {
            dbName: "autoTerminalCones",
            dbTy: "int8",
            fromApi: (api) => api.autoTerminal,
        },
        {
            dbName: "autoGroundCones",
            dbTy: "int8",
            fromApi: (api) => api.autoJunctionCones[0],
        },
        {
            dbName: "autoLowCones",
            dbTy: "int8",
            fromApi: (api) => api.autoJunctionCones[1],
        },
        {
            dbName: "autoMediumCones",
            dbTy: "int8",
            fromApi: (api) => api.autoJunctionCones[2],
        },
        {
            dbName: "autoHighCones",
            dbTy: "int8",
            fromApi: (api) => api.autoJunctionCones[3],
        },
        {
            dbName: "autoConeLayout",
            dbTy: "json",
            apiTy: coneLayoutGQL,
            fromApi: (api) => coneLayoutFromApi(api.autoJunctions, api.alliance),
        },
        {
            dbName: "dcNearTerminalCones",
            dbTy: "int8",
            fromApi: (api) => api.dcTerminalNear,
        },
        {
            dbName: "dcFarTerminalCones",
            dbTy: "int8",
            fromApi: (api) => api.dcTerminalFar,
        },
        {
            dbName: "dcTerminalCones",
            dbTy: "int8",
            fromSelf: (self) => self.dcNearTerminalCones + self.dcFarTerminalCones,
        },
        {
            dbName: "dcGroundCones",
            dbTy: "int8",
            fromApi: (api) => api.dcJunctionCones[0],
        },
        {
            dbName: "dcLowCones",
            dbTy: "int8",
            fromApi: (api) => api.dcJunctionCones[1],
        },
        {
            dbName: "dcMediumCones",
            dbTy: "int8",
            fromApi: (api) => api.dcJunctionCones[2],
        },
        {
            dbName: "dcHighCones",
            dbTy: "int8",
            fromApi: (api) => api.dcJunctionCones[3],
        },
        {
            dbName: "dcConeLayout",
            dbTy: "json",
            apiTy: coneLayoutGQL,
            fromApi: (api) => coneLayoutFromApi(api.dcJunctions, api.alliance),
        },
        {
            dbName: "egNav1",
            dbTy: "bool",
            fromApi: (api) => api.egNavigated1,
        },
        {
            dbName: "egNav2",
            dbTy: "bool",
            fromApi: (api) => api.egNavigated2,
        },
        {
            dbName: "coneOwnedJunctions",
            dbTy: "int8",
            fromApi: (api) => api.ownedJunctions - api.beacons,
        },
        {
            dbName: "beaconOwnedJunctions",
            dbTy: "int8",
            fromApi: (api) => api.beacons,
        },
        {
            dbName: "circuit",
            dbTy: "bool",
            fromApi: (api) => api.circuit,
        },
        {
            dbName: "minorsCommitted",
            dbTy: "int8",
            fromApi: (api) => api.minorPenalties,
        },
        {
            dbName: "majorsCommitted",
            dbTy: "int8",
            fromApi: (api) => api.majorPenalties,
        },
        {
            dbName: "penaltyPointsCommitted",
            dbTy: "smallint",
            fromSelf: (self) => self.minorsCommitted * 10 + self.majorsCommitted * 30,
        },

        {
            dbName: "minorsByOpp",
            dbTy: "int8",
            fromApi: (_, oth) => oth.minorPenalties,
        },
        {
            dbName: "majorsByOpp",
            dbTy: "int8",
            fromApi: (_, oth) => oth.majorPenalties,
        },
        {
            dbName: "penaltyPointsByOpp",
            dbTy: "smallint",
            fromSelf: (self) => self.minorsByOpp * 10 + self.majorsByOpp * 30,
        },
        {
            dbName: "autoNavPoints",
            dbTy: "smallint",
            fromSelf: (self) => autoNav2022Points(self.autoNav1) + autoNav2022Points(self.autoNav2),
        },
        {
            dbName: "autoConePoints",
            dbTy: "smallint",
            fromSelf: (self) =>
                self.autoTerminalCones * 1 +
                self.autoGroundCones * 2 +
                self.autoLowCones * 3 +
                self.autoMediumCones * 4 +
                self.autoHighCones * 5,
        },
        {
            dbName: "egNavPoints",
            dbTy: "smallint",
            fromSelf: (self) => self.egNav1 * 2 + self.egNav2 * 2,
        },
        {
            dbName: "ownershipPoints",
            dbTy: "smallint",
            fromSelf: (self) => self.coneOwnedJunctions * 3 + self.beaconOwnedJunctions * 10,
        },
        {
            dbName: "circuitPoints",
            dbTy: "smallint",
            fromSelf: (self) => self.circuit * 20,
        },
        {
            dbName: "autoPoints",
            dbTy: "smallint",
            fromSelf: (self) => self.autoNavPoints + self.autoConePoints,
        },
        {
            dbName: "dcPoints",
            dbTy: "smallint",
            fromSelf: (self) =>
                self.dcTerminalCones * 1 +
                self.dcGroundCones * 2 +
                self.dcLowCones * 3 +
                self.dcMediumCones * 4 +
                self.dcHighCones * 5,
        },
        {
            dbName: "egPoints",
            dbTy: "smallint",
            fromSelf: (self) => self.egNavPoints + self.ownershipPoints + self.circuitPoints,
        },
        {
            dbName: "totalPointsNp",
            dbTy: "smallint",
            fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints,
        },
        {
            dbName: "totalPoints",
            dbTy: "smallint",
            fromSelf: (self) => self.totalPointsNp + self.penaltyPointsByOpp,
        },
    ],
});
