import { GraphQLObjectType } from "graphql";
import { AllianceScores2023TradFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2023Trad";
import { Alliance } from "../../Alliance";
import { Season } from "../../Season";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { AnyDTy, BoolDTy, EnumDTy, Int16DTy, IntTy, listTy, nn } from "../types";
import { Station } from "../../Station";
import { nOf } from "../../../utils/format/n-of";

export const AutoNav2023 = {
    None: "None",
    Backstage: "Backstage",
} as const;
export type AutoNav2023 = (typeof AutoNav2023)[keyof typeof AutoNav2023];
const AutoNav2023DTy = EnumDTy(AutoNav2023, "AutoNav2023", "auto_nav_2023_enum");

export const AutoProp2023 = {
    WhitePixel: "WhitePixel",
    TeamProp: "TeamProp",
} as const;
export type AutoProp2023 = (typeof AutoProp2023)[keyof typeof AutoProp2023];
const AutoProp2023DTy = EnumDTy(AutoProp2023, "AutoProp2023", "auto_prop_2023_enum");

export const EndgameNav2023 = {
    None: "None",
    Backstage: "Backstage",
    Rigging: "Rigging",
} as const;
export type EndgameNav2023 = (typeof EndgameNav2023)[keyof typeof EndgameNav2023];
const EndgameNav2023DTy = EnumDTy(EndgameNav2023, "EndgameNav2023", "endgame_nav_2023_enum");

function autoNav2023FromApi(place: "NONE" | "BACKSTAGE"): AutoNav2023 {
    if (place == "NONE") {
        return AutoNav2023.None;
    } else {
        return AutoNav2023.Backstage;
    }
}
function endgameNav2023FromApi(place: "NONE" | "BACKSTAGE" | "RIGGING"): EndgameNav2023 {
    if (place == "NONE") {
        return EndgameNav2023.None;
    } else if (place == "BACKSTAGE") {
        return EndgameNav2023.Backstage;
    } else {
        return EndgameNav2023.Rigging;
    }
}
function autoProp2023FromApi(propUsed: "WHITEPIXEL" | "TEAMPROP"): AutoProp2023 {
    if (propUsed == "WHITEPIXEL") {
        return AutoProp2023.WhitePixel;
    } else {
        return AutoProp2023.TeamProp;
    }
}
function endgameNav2023Points(endgameNav: EndgameNav2023): number {
    switch (endgameNav) {
        case "None":
            return 0;
        case "Backstage":
            return 5;
        case "Rigging":
            return 20;
    }
}

function autoNav2023Points(autoNav: AutoNav2023): number {
    switch (autoNav) {
        case "None":
            return 0;
        case "Backstage":
            return 5;
    }
}
function autoProp2023Points1(autoProp: AutoProp2023): number {
    switch (autoProp) {
        case "WhitePixel":
            return 0;
        case "TeamProp":
            return 1;
    }
}
function autoProp2023Points2(autoProp: AutoProp2023): number {
    switch (autoProp) {
        case "WhitePixel":
            return 0;
        case "TeamProp":
            return 1;
    }
}
function formatAutoNav2023(autoNav: AutoNav2023): string {
    switch (autoNav) {
        case "None":
            return "No Park";
        case "Backstage":
            return "Parked Backstage";
    }
}
function formatAutoProp2023(autoProp: AutoProp2023): string {
    switch (autoProp) {
        case "WhitePixel":
            return "White Pixel used";
        case "TeamProp":
            return "Team Prop used";
    }
}
function formatEndgameNav2023(endgameNav: EndgameNav2023): string {
    switch (endgameNav) {
        case "None":
            return "No Park";
        case "Backstage":
            return "Parked Backstage";
        case "Rigging":
            return "Parked with Rigging";
    }
}

export const PixelType = {
    WhitePixel: "WhitePixel",
    PurplePixel: "PurplePixel",
    GreenPixel: "GreenPixel",
    BluePixel: "BluePixel",
    // RedProp1: "RedProp1",
    // BlueProp1: "BlueProp1",
    // RedProp2: "RedProp2",
    // BlueProp2: "BlueProp2",
} as const;
export type PixelType = (typeof PixelType)[keyof typeof PixelType];
const PixelTypeDTy = EnumDTy(PixelType, "PixelType", "pixel_type_enum");

type Api = AllianceScores2023TradFtcApi;

export const Descriptor2023 = new Descriptor({
    season: Season.CenterStage,
    seasonName: "CenterStage",
    hasRemote: false,
    pensSubtract: false,
    rankings: {
        rp: "Record",
        tb: "AutoEndgameAvg",
    },
    firstDate: new Date("2023-09-30"),
    lastDate: new Date("2024-09-05"),
})
    .addColumn(
        new DescriptorColumn({ name: "autoNav1" })
            .addMatchScore({
                apiName: "autoNav2023_1",
                remoteApiName: "autoNav2023",
                fromApi: (api: Api) => autoNav2023FromApi(api.robot1Auto),
                dataTy: AutoNav2023DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                getValue: (ms) => autoNav2023Points(ms.autoNav2023_1),
                getTitle: (ms) => formatAutoNav2023(ms.autoNav2023_1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2" })
            .addMatchScore({
                apiName: "autoNav2023_2",
                fromApi: (api: Api) => autoNav2023FromApi(api.robot2Auto),
                dataTy: AutoNav2023DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                getValue: (ms) => autoNav2023Points(ms.autoNav2023_2),
                getTitle: (ms) => formatAutoNav2023(ms.autoNav2023_2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "Prop 1" }).addMatchScore({
            fromApi: (api: Api) => api.Prop1,
            dataTy: BoolDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "Prop 2" }).addMatchScore({
            fromApi: (api: Api) => api.Prop2,
            dataTy: BoolDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBackstagePixels" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoBackstage,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBackdropPixels" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoBackdrop,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoYellowPixel" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoYellowPixel,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPurplePixel" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoPurplePixel,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBackdropPixels" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcBackdrop,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBackstagePixels" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcBackstage,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "mosaics" })
            .addMatchScore({
                fromSelf: (api: Api) => api.mosaics,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "setLine" })
            .addMatchScore({
                fromApi: (api: Api) => api.setLine,
                dataTy: Int16DTy,
            })
            .finish()
    )

    .addColumn(
        new DescriptorColumn({ name: "egNav1" })
            .addMatchScore({
                fromApi: (api: Api) => api.egNavigated1,
                dataTy: BoolDTy,
            })
            .addScoreModal({ displayName: "Robot 1", getValue: (ms) => ms.egNav1 * 2 })
    )
    .addColumn(
        new DescriptorColumn({ name: "egNav2" })
            .addMatchScore({
                fromApi: (api: Api) => api.egNavigated2,
                dataTy: BoolDTy,
            })
            .addScoreModal({ displayName: "Robot 2", getValue: (ms) => ms.egNav2 * 2 })
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
                    "autoNav2023" in self
                        ? autoNav2023Points(self.autoNav2023)
                        : autoNav2023Points(self.autoNav2023_1) +
                          autoNav2023Points(self.autoNav2023_2),
                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Navigation Points" })
            .addTep({ columnPrefix: "Auto Nav", fullName: "Auto Navigation Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.One
                        ? autoNav2023Points(ms.autoNav2023_1)
                        : station == Station.Solo
                        ? autoNav2023Points(ms.autoNav2023)
                        : autoNav2023Points(ms.autoNav2023_2),
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
            .addScoreModal({ displayName: "Cone Points" })
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
            .addScoreModal({ displayName: "Navigation Points" })
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
            .addScoreModal({ displayName: "Ownership Points" })
            .addTep({ columnPrefix: "Ownership", fullName: "Ownership Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "coneOwnershipPoints" })
            .addScoreModal({
                displayName: "Regular",
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
            .addScoreModal({ displayName: "Circuit Points" })
            .addTep({ columnPrefix: "Circuit", fullName: "Circuit Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommittedPoints" })
            .addScoreModal({
                displayName: "Majors Points",
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
            .addScoreModal({ displayName: "Penalties" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoNavPoints + self.autoConePoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Auto" })
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
            .addScoreModal({ displayName: "Driver-Controlled" })
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
            .addScoreModal({ displayName: "Endgame" })
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
    .finish();
