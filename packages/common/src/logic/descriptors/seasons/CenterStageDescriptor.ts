// import { GraphQLObjectType } from "graphql";
import { AllianceScores2023TradFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2023Trad";
// import { Alliance } from "../../Alliance";
import { Season } from "../../Season";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { BoolDTy, EnumDTy, Int16DTy } from "../types";
import { Station } from "../../Station";
import { nOf } from "../../../utils/format/n-of";

export const EgNav2023 = {
    None: "None",
    Backstage: "Backstage",
    Rigging: "Rigging",
} as const;
export type EgNav2023 = (typeof EgNav2023)[keyof typeof EgNav2023];
const EgNav2023DTy = EnumDTy(EgNav2023, "EgNav2023", "endgame_nav_2023_enum");

function egNav2023FromApi(place: "NONE" | "BACKSTAGE" | "RIGGING"): EgNav2023 {
    if (place == "NONE") {
        return EgNav2023.None;
    } else if (place == "BACKSTAGE") {
        return EgNav2023.Backstage;
    } else {
        return EgNav2023.Rigging;
    }
}

function egNav2023Points(egNav: EgNav2023): number {
    switch (egNav) {
        case "None":
            return 0;
        case "Backstage":
            return 5;
        case "Rigging":
            return 20;
    }
}

function formatEgNav2023(egNav: EgNav2023): string {
    switch (egNav) {
        case "None":
            return "No Park";
        case "Backstage":
            return "Parked Backstage";
        case "Rigging":
            return "Suspended on Rigging";
    }
}

type Api = AllianceScores2023TradFtcApi;

export const Descriptor2023 = new Descriptor({
    season: Season.CenterStage,
    seasonName: "Centerstage",
    hasRemote: false,
    pensSubtract: false,
    rankings: {
        rp: "Record",
        tb: "AutoEndgameAvg",
    },
    firstDate: new Date("2023-09-10"),
    lastDate: new Date("2023-09-05"),
})
    .addColumn(
        new DescriptorColumn({ name: "egNav1" })
            .addMatchScore({
                apiName: "egNav2023_1",
                fromApi: (api: Api) => egNav2023FromApi(api.egRobot1),
                dataTy: EgNav2023DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                getValue: (ms) => egNav2023Points(ms.egNav2023_1),
                getTitle: (ms) => formatEgNav2023(ms.egNav2023_1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egNav2" })
            .addMatchScore({
                apiName: "egNav2023_2",
                fromApi: (api: Api) => egNav2023FromApi(api.egRobot2),
                dataTy: EgNav2023DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                getValue: (ms) => egNav2023Points(ms.egNav2023_2),
                getTitle: (ms) => formatEgNav2023(ms.egNav2023_2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBackdrop" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoBackdrop,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBackstage" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoBackstage,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcStudio" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcStudio,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBackdrop" })
            .addMatchScore({
                fromApi: (api: Api) => api.dcBackdrop,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav1" })
            .addMatchScore({
                fromApi: (api: Api) => api.robot1Auto,
                dataTy: BoolDTy,
            })
            .addScoreModal({ displayName: "Robot 1", getValue: (ms) => ms.autoNav1 * 5 })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2" })
            .addMatchScore({
                fromApi: (api: Api) => api.robot2Auto,
                dataTy: BoolDTy,
            })
            .addScoreModal({ displayName: "Robot 2", getValue: (ms) => ms.autoNav2 * 5 })
    )
    .addColumn(
        new DescriptorColumn({ name: "maxSetLine" })
            .addMatchScore({
                fromApi: (api: Api) => api.maxSetLine,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "mosaics" })
            .addMatchScore({
                fromApi: (api: Api) => api.mosaics,
                dataTy: Int16DTy,
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
        new DescriptorColumn({ name: "egNavPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    "egNav2023" in self
                        ? egNav2023Points(self.egNav2023)
                        : egNav2023Points(self.egNav2023_1) + egNav2023Points(self.egNav2023_2),
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
                    station == Station.One
                        ? egNav2023Points(ms.egNav2023_1)
                        : station == Station.Solo
                        ? egNav2023Points(ms.egNav2023)
                        : egNav2023Points(ms.egNav2023_2),
                columnPrefix: "Endgame Nav Individual",
                dialogName: "Individual",
                fullName: "Endgame Navigation Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPixelPoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoBackdrop * 5 + self.autoBackstage * 3,

                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Pixel Points" })
            .addTep({
                columnPrefix: "Auto Pixel",
                dialogName: "Pixel Points",
                fullName: "Auto Pixel Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBackstagePoints" })
            .addScoreModal({
                displayName: "Backstage",
                getValue: (ms) => ms.autoBackstage * 3,
                getTitle: (ms) => nOf(ms.autoBackstage, "Pixel"),
            })
            .addTep({
                make: (ms) => ms.autoBackstage * 3,
                columnPrefix: "Auto Backstage",
                fullName: "Auto Backstage Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoBackdropPoints" })
            .addScoreModal({
                displayName: "Backdrop",
                getValue: (ms) => ms.autoBackdrop * 5,
                getTitle: (ms) => nOf(ms.autoBackdrop, "Pixel"),
            })
            .addTep({
                make: (ms) => ms.autoBackdrop * 5,
                columnPrefix: "Auto Backdrop",
                fullName: "Auto Backdrop Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoNav1 * 5 + self.autoNav2 * 5,
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
                    (station == Station.One
                        ? ms.autoNav1
                        : station == Station.Solo
                        ? ms.autoNav
                        : ms.autoNav2) * 5,
                columnPrefix: "Auto Nav Individual",
                dialogName: "Individual",
                fullName: "Auto Navigation Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "setLinePoints" })
            .addMatchScore({
                fromSelf: (self) => self.maxSetLine * 10,

                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Setline Points" })
            .addTep({ columnPrefix: "Setline", fullName: "Setline Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "mosaicPoints" })
            .addMatchScore({
                fromSelf: (self) => self.mosaics * 10,

                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Mosaic Points" })
            .addTep({ columnPrefix: "Mosaic", fullName: "Mosaic Points" })
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
                fromSelf: (self) => self.autoNavPoints + self.autoPixelPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Auto" })
            .addTep({ columnPrefix: "Auto", dialogName: "Auto Points", fullName: "Auto Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.dcBackdrop * 3 +
                    self.dcStudio * 1 +
                    self.mosaicPoints +
                    self.setLinePoints,
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
        new DescriptorColumn({ name: "dcBackdropPoints" })
            .addScoreModal({
                displayName: "Backdrop",
                getValue: (ms) => ms.dcBackdrop * 3,
                getTitle: (ms) => nOf(ms.dcBackdrop, "Pixel"),
            })
            .addTep({
                make: (ms) => ms.dcBackdrop * 3,
                columnPrefix: "DC Backdrop",
                fullName: "Teleop Backdrop Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcStudioPoints" })
            .addScoreModal({
                displayName: "Backstage",
                getValue: (ms) => ms.dcStudio * 1,
                getTitle: (ms) => nOf(ms.dcStudio, "Pixel"),
            })
            .addTep({
                make: (ms) => ms.dcStudio * 1,
                columnPrefix: "DC Backstage",
                fullName: "Teleop Backstage Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egPoints" })
            .addMatchScore({
                fromSelf: (self) => self.egNavPoints,

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
                    val: "autoPixelPoints",
                    children: [
                        { val: "autoBackdropPoints", children: [] },
                        { val: "autoBackstagePoints", children: [] },
                    ],
                },
            ],
        },
        {
            val: "dcPoints",
            children: [
                { val: "dcBackdropPoints", children: [] },
                { val: "dcStudioPoints", children: [] },
                { val: "mosaicPoints", children: [] },
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
                { val: "setLinePoints", children: [] },
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
