import { GraphQLObjectType } from "graphql";
import {
    AllianceScores2022TradFtcApi,
    ApiConeType,
} from "../../../ftc-api-types/match-scores/MatchScores2022Trad";
import { Alliance } from "../../Alliance";
import { Season } from "../../Season";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { AnyDTy, BoolDTy, EnumDTy, Int16DTy, IntTy, listTy, nn } from "../types";
import { Station } from "../../Station";
import { nOf } from "../../../utils/format/n-of";

export const AutoNav2022 = {
    None: "None",
    Terminal: "Terminal",
    Signal: "Signal",
    TeamSignal: "TeamSignal",
} as const;
export type AutoNav2022 = (typeof AutoNav2022)[keyof typeof AutoNav2022];
const AutoNav2022DTy = EnumDTy(AutoNav2022, "AutoNav2022", "auto_nav_2022_enum");

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

function formatAutoNav2022(autoNav: AutoNav2022): string {
    switch (autoNav) {
        case "None":
            return "No Park";
        case "Terminal":
            return "Parked in Terminal";
        case "Signal":
            return "Parked in Signal Zone";
        case "TeamSignal":
            return "Parked in Signal Zone with Custom Sleeve";
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
const ConeTypeDTy = EnumDTy(ConeType, "ConeType", "cone_type_enum");

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

type Api = AllianceScores2022TradFtcApi;

export const Descriptor2022 = new Descriptor({
    season: Season.PowerPlay,
    seasonName: "Power Play",
    hasRemote: false,
    pensSubtract: false,
    rankings: {
        rp: "Record",
        tb: "AutoEndgameAvg",
    },
    firstDate: new Date("2022-09-10"),
    lastDate: new Date("2023-09-05"),
})
    .addColumn(
        new DescriptorColumn({ name: "autoNav1" })
            .addMatchScore({
                apiName: "autoNav2022_1",
                remoteApiName: "autoNav2022",
                fromApi: (api: Api) => autoNav2022FromApi(api.robot1Auto, api.initSignalSleeve1),
                dataTy: AutoNav2022DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "Auto Nav 1",
                fullName: "Robot 1 Auto Navigation Points",
                getValue: (ms) => autoNav2022Points(ms.autoNav2022_1),
                getTitle: (ms) => formatAutoNav2022(ms.autoNav2022_1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2" })
            .addMatchScore({
                apiName: "autoNav2022_2",
                fromApi: (api: Api) => autoNav2022FromApi(api.robot2Auto, api.initSignalSleeve2),
                dataTy: AutoNav2022DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Auto Nav 2",
                fullName: "Robot 2 Auto Navigation Points",
                getValue: (ms) => autoNav2022Points(ms.autoNav2022_2),
                getTitle: (ms) => formatAutoNav2022(ms.autoNav2022_2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTerminalCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoTerminal,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoGroundCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoJunctionCones[0],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLowCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoJunctionCones[1],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoMediumCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoJunctionCones[2],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoHighCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoJunctionCones[3],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoConeLayout" })
            .addMatchScore({
                outer: true,
                fromApi: (api: Api) => junctionsFromApi(api.autoJunctions, api.alliance),
                dataTy: ConeLayoutDTy,
                apiMap: (r, b) => coneLayoutFromDb(r, b, true),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcNearTerminalCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcTerminalNear,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFarTerminalCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcTerminalFar,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTerminalCones" })
            .addMatchScore({
                fromSelf: (self) => self.dcNearTerminalCones + self.dcFarTerminalCones,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcGroundCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcJunctionCones[0],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcLowCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcJunctionCones[1],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcMediumCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcJunctionCones[2],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcHighCones" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcJunctionCones[3],
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcConeLayout" })
            .addMatchScore({
                outer: true,
                fromApi: (api: Api) => junctionsFromApi(api.dcJunctions, api.alliance),
                dataTy: ConeLayoutDTy,
                apiMap: (r, b) => coneLayoutFromDb(r, b, false),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egNav1" })
            .addMatchScore({
                remoteApiName: "egNav",
                fromApi: (api: Api) => api.egNavigated1,
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "Endgame Nav 1",
                fullName: "Robot 1 Endgame Navigation Points",
                getValue: (ms) => ms.egNav1 * 2,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egNav2" })
            .addMatchScore({
                fromApi: (api: Api) => api.egNavigated2,
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Endgame Nav 2",
                fullName: "Robot 2 Endgame Navigation Points",
                getValue: (ms) => ms.egNav2 * 2,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "coneOwnedJunctions" })
            .addMatchScore({
                fromApi: (api: Api) => api.ownedJunctions - api.beacons,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "beaconOwnedJunctions" })
            .addMatchScore({
                fromApi: (api: Api) => api.beacons,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "circuit" })
            .addMatchScore({
                fromApi: (api: Api) => api.circuit,
                dataTy: BoolDTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommitted" })
            .addMatchScore({
                fromApi: (api: Api) => api.minorPenalties,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommitted" })
            .addMatchScore({
                fromApi: (api: Api) => api.majorPenalties,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOpp" })
            .addMatchScore({
                fromApi: (_, api: Api) => api.minorPenalties,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsByOpp" })
            .addMatchScore({
                fromApi: (_, api: Api) => api.majorPenalties,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    "autoNav2022" in self
                        ? autoNav2022Points(self.autoNav2022)
                        : autoNav2022Points(self.autoNav2022_1) +
                          autoNav2022Points(self.autoNav2022_2),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Navigation Points",
                columnPrefix: "Auto Nav",
                fullName: "Auto Navigation Points",
            })
            .addTep({ columnPrefix: "Auto Nav", fullName: "Auto Navigation Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.One
                        ? autoNav2022Points(ms.autoNav2022_1)
                        : station == Station.Solo
                        ? autoNav2022Points(ms.autoNav2022)
                        : autoNav2022Points(ms.autoNav2022_2),
                columnPrefix: "Auto Nav Individual",
                dialogName: "Individual",
                fullName: "Auto Navigation Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoConePoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoTerminalCones * 1 +
                    self.autoGroundCones * 2 +
                    self.autoLowCones * 3 +
                    self.autoMediumCones * 4 +
                    self.autoHighCones * 5,

                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Cone Points",
                columnPrefix: "Auto Cone",
                fullName: "Auto Cone Points",
            })
            .addTep({
                columnPrefix: "Auto Cone",
                dialogName: "Cone Points",
                fullName: "Auto Cone Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTerminalPoints" })
            .addScoreModal({
                displayName: "Terminal",
                columnPrefix: "Auto Terminal",
                fullName: "Auto Terminal Points",
                getValue: (ms) => ms.autoTerminalCones * 1,
                getTitle: (ms) => nOf(ms.autoTerminalCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.autoTerminalCones * 1,
                columnPrefix: "Auto Terminal",
                fullName: "Auto Terminal Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoGroundPoints" })
            .addScoreModal({
                displayName: "Ground",
                columnPrefix: "Auto Ground",
                fullName: "Auto Ground Junction Points",
                getValue: (ms) => ms.autoGroundCones * 2,
                getTitle: (ms) => nOf(ms.autoGroundCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.autoGroundCones * 2,
                columnPrefix: "Auto Ground",
                fullName: "Auto Ground Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLowPoints" })
            .addScoreModal({
                displayName: "Low",
                columnPrefix: "Auto Low",
                fullName: "Auto Low Junction Points",
                getValue: (ms) => ms.autoLowCones * 3,
                getTitle: (ms) => nOf(ms.autoLowCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.autoLowCones * 3,
                columnPrefix: "Auto Low",
                fullName: "Auto Low Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoMediumPoints" })
            .addScoreModal({
                displayName: "Medium",
                columnPrefix: "Auto Medium",
                fullName: "Auto Medium Junction Points",
                getValue: (ms) => ms.autoMediumCones * 4,
                getTitle: (ms) => nOf(ms.autoMediumCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.autoMediumCones * 4,
                columnPrefix: "Auto Medium",
                fullName: "Auto Medium Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoHighPoints" })
            .addScoreModal({
                displayName: "High",
                columnPrefix: "Auto High",
                fullName: "Auto High Junction Points",
                getValue: (ms) => ms.autoHighCones * 5,
                getTitle: (ms) => nOf(ms.autoHighCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.autoHighCones * 5,
                columnPrefix: "Auto High",
                fullName: "Auto High Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egNavPoints" })
            .addMatchScore({
                fromSelf: (self) => self.egNav1 * 2 + self.egNav2 * 2,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Navigation Points",
                columnPrefix: "Endgame Nav",
                fullName: "Endgame Navigation Points",
            })
            .addTep({ columnPrefix: "Endgame Nav", fullName: "Endgame Navigation Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egNavPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    (station == Station.One
                        ? ms.egNav1
                        : station == Station.Solo
                        ? ms.egNav
                        : ms.egNav2) * 2,
                columnPrefix: "Endgame Nav Individual",
                dialogName: "Individual",
                fullName: "Endgame Navigation Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "ownershipPoints" })
            .addMatchScore({
                fromSelf: (self) => self.coneOwnedJunctions * 3 + self.beaconOwnedJunctions * 10,

                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Ownership Points",
                columnPrefix: "Ownership",
                fullName: "Ownership Points",
            })
            .addTep({ columnPrefix: "Ownership", fullName: "Ownership Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "coneOwnershipPoints" })
            .addScoreModal({
                displayName: "Regular",
                columnPrefix: "Cone Ownership",
                fullName: "Cone Ownership Points",
                getValue: (ms) => ms.coneOwnedJunctions * 3,
                getTitle: (ms) => nOf(ms.coneOwnedJunctions, "Junction"),
            })
            .addTep({
                make: (ms) => ms.coneOwnedJunctions * 3,
                columnPrefix: "Regular Ownership",
                fullName: "Cone Ownership Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "beaconOwnershipPoints" })
            .addScoreModal({
                displayName: "Beacon",
                columnPrefix: "Beacon Ownership",
                fullName: "Beacon Ownership Points",
                getValue: (ms) => ms.beaconOwnedJunctions * 10,
                getTitle: (ms) => nOf(ms.beaconOwnedJunctions, "Beacon"),
            })
            .addTep({
                make: (ms) => ms.beaconOwnedJunctions * 10,
                columnPrefix: "Beacon Ownership",
                fullName: "Beacon Ownership Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "circuitPoints" })
            .addMatchScore({
                fromSelf: (self) => self.circuit * 20,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Circuit Points",
                columnPrefix: "Circuit",
                fullName: "Circuit Points",
            })
            .addTep({ columnPrefix: "Circuit", fullName: "Circuit Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommittedPoints" })
            .addScoreModal({
                displayName: "Majors Points",
                columnPrefix: "Majors",
                fullName: "Major Penalty Points Committed",
                getValue: (ms) => ms.majorsCommitted * 30,
                getTitle: (ms) => nOf(ms.majorsCommitted, "Major Committed", "Majors Committed"),
            })
            .addTep({
                make: (ms) => ms.majorsCommitted * 30,
                columnPrefix: "Majors Committed",
                dialogName: "Majors",
                fullName: "Major Penalty Points Committed",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommittedPoints" })
            .addScoreModal({
                displayName: "Minors Points",
                columnPrefix: "Minors",
                fullName: "Minor Penalty Points Committed",
                getValue: (ms) => ms.minorsCommitted * 10,
                getTitle: (ms) => nOf(ms.minorsCommitted, "Minor Committed", "Minors Committed"),
            })
            .addTep({
                make: (ms) => ms.minorsCommitted * 10,
                columnPrefix: "Minors Committed",
                dialogName: "Minors",
                fullName: "Minor Penalty Points Committed",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                fromSelf: (self) => self.majorsCommitted * 30 + self.minorsCommitted * 10,

                dataTy: Int16DTy,
            })
            .addTep({
                columnPrefix: "Penalties Committed",
                dialogName: "Penalty Points",
                fullName: "Penalty Points Committed",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsByOppPoints" })
            .addTep({
                make: (ms) => ms.majorsByOpp * 30,
                columnPrefix: "Opp Majors Committed",
                dialogName: "Majors",
                fullName: "Major Penalty Points by Opponent",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOppPoints" })
            .addTep({
                make: (ms) => ms.minorsByOpp * 10,
                columnPrefix: "Opp Minors Committed",
                dialogName: "Minors",
                fullName: "Minor Penalty Points by Opponent",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsByOpp" })
            .addMatchScore({
                fromSelf: (self) => self.majorsByOpp * 30 + self.minorsByOpp * 10,

                dataTy: Int16DTy,
            })
            .addTep({
                columnPrefix: "Opp Penalties Committed",
                dialogName: "Opp Penalty Points",
                fullName: "Penalty Points by Opponent",
            })
            .addScoreModal({
                displayName: "Penalties",
                columnPrefix: "Penalties",
                fullName: "Penalty Points By Opponent",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoNavPoints + self.autoConePoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Auto", columnPrefix: "Auto", fullName: "Auto Points" })
            .addTep({ columnPrefix: "Auto", dialogName: "Auto Points", fullName: "Auto Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.dcTerminalCones * 1 +
                    self.dcGroundCones * 2 +
                    self.dcLowCones * 3 +
                    self.dcMediumCones * 4 +
                    self.dcHighCones * 5,

                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Driver-Controlled",
                columnPrefix: "Teleop",
                fullName: "Teleop Points",
            })
            .addTep({
                columnPrefix: "Teleop",
                dialogName: "Teleop Points",
                fullName: "Teleop Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTerminalPoints" })
            .addScoreModal({
                displayName: "Terminal",
                columnPrefix: "DC Terminal",
                fullName: "Teleop Terminal Points",
                getValue: (ms) => ms.dcTerminalCones * 1,
                getTitle: (ms) => nOf(ms.dcTerminalCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.dcTerminalCones * 1,
                columnPrefix: "DC Terminal",
                fullName: "Teleop Terminal Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcGroundPoints" })
            .addScoreModal({
                displayName: "Ground",
                columnPrefix: "DC Ground",
                fullName: "Teleop Ground Junction Points",
                getValue: (ms) => ms.dcGroundCones * 2,
                getTitle: (ms) => nOf(ms.dcGroundCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.dcGroundCones * 2,
                columnPrefix: "DC Ground",
                fullName: "Teleop Ground Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcLowPoints" })
            .addScoreModal({
                displayName: "Low",
                columnPrefix: "DC Low",
                fullName: "Teleop Low Junction Points",
                getValue: (ms) => ms.dcLowCones * 3,
                getTitle: (ms) => nOf(ms.dcLowCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.dcLowCones * 3,
                columnPrefix: "DC Low",
                fullName: "Teleop Low Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcMediumPoints" })
            .addScoreModal({
                displayName: "Medium",
                columnPrefix: "DC Medium",
                fullName: "Teleop Medium Junction Points",
                getValue: (ms) => ms.dcMediumCones * 4,
                getTitle: (ms) => nOf(ms.dcMediumCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.dcMediumCones * 4,
                columnPrefix: "DC Medium",
                fullName: "Teleop Medium Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcHighPoints" })
            .addScoreModal({
                displayName: "High",
                columnPrefix: "DC High",
                fullName: "Teleop High Junction Points",
                getValue: (ms) => ms.dcHighCones * 5,
                getTitle: (ms) => nOf(ms.dcHighCones, "Cone"),
            })
            .addTep({
                make: (ms) => ms.dcHighCones * 5,
                columnPrefix: "DC High",
                fullName: "Teleop High Junction Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egPoints" })
            .addMatchScore({
                fromSelf: (self) => self.egNavPoints + self.ownershipPoints + self.circuitPoints,

                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Endgame",
                columnPrefix: "Endgame",
                fullName: "Endgame Points",
            })
            .addTep({
                columnPrefix: "Endgame",
                dialogName: "Endgame Points",
                fullName: "Endgame Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPointsNp" })
            .addMatchScore({
                fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints,
                dataTy: Int16DTy,
            })
            .addTep({
                columnPrefix: "np",
                dialogName: "Total Points NP",
                fullName: "Total Points No Penalties",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPoints" })
            .addMatchScore({
                fromSelf: (self) => self.totalPointsNp + self.penaltyPointsByOpp,
                dataTy: Int16DTy,
            })
            .addTep({ columnPrefix: "", dialogName: "Total Points", fullName: "Total Points" })
    )

    .addTree([
        { val: "totalPoints", children: [] },
        { val: "totalPointsNp", children: [] },
        {
            val: "autoPoints",
            children: [
                {
                    val: "autoNavPoints",
                    children: [
                        { val: "autoNav1", children: [] },
                        { val: "autoNav2", children: [] },
                        { val: "autoNavPointsIndividual", children: [] },
                    ],
                },
                {
                    val: "autoConePoints",
                    children: [
                        { val: "autoTerminalPoints", children: [] },
                        { val: "autoGroundPoints", children: [] },
                        { val: "autoLowPoints", children: [] },
                        { val: "autoMediumPoints", children: [] },
                        { val: "autoHighPoints", children: [] },
                    ],
                },
            ],
        },
        {
            val: "dcPoints",
            children: [
                { val: "dcTerminalPoints", children: [] },
                { val: "dcGroundPoints", children: [] },
                { val: "dcLowPoints", children: [] },
                { val: "dcMediumPoints", children: [] },
                { val: "dcHighPoints", children: [] },
            ],
        },
        {
            val: "egPoints",
            children: [
                {
                    val: "egNavPoints",
                    children: [
                        { val: "egNav1", children: [] },
                        { val: "egNav2", children: [] },
                        { val: "egNavPointsIndividual", children: [] },
                    ],
                },
                {
                    val: "ownershipPoints",
                    children: [
                        { val: "coneOwnershipPoints", children: [] },
                        { val: "beaconOwnershipPoints", children: [] },
                    ],
                },
                { val: "circuitPoints", children: [] },
            ],
        },
        {
            val: "penaltyPointsCommitted",
            children: [
                { val: "majorsCommittedPoints", children: [] },
                { val: "minorsCommittedPoints", children: [] },
            ],
        },
        {
            val: "penaltyPointsByOpp",
            children: [
                { val: "majorsCommittedPoints", for: "sm", children: [] },
                { val: "minorsCommittedPoints", for: "sm", children: [] },
                { val: "majorsByOppPoints", for: "tep", children: [] },
                { val: "minorsByOppPoints", for: "tep", children: [] },
            ],
        },
    ])
    .addMatchInsightCols(["autoConePoints", "circuitPoints"], ["autoConePoints", "circuitPoints"])
    .finish();
