import { Scores2020RemoteFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2020Remote";
import { AllianceScores2020TradFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2020Trad";
import { nOf } from "../../../utils/format/n-of";
import { Season } from "../../Season";
import { Station } from "../../Station";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { BoolDTy, EnumDTy, Int16DTy } from "../types";

export const WobbleEndPosition2020 = {
    None: "None",
    StartLine: "StartLine",
    DropZone: "DropZone",
} as const;
export type WobbleEndPosition2020 =
    (typeof WobbleEndPosition2020)[keyof typeof WobbleEndPosition2020];
const WobbleEndPosition2020DTy = EnumDTy(
    WobbleEndPosition2020,
    "WobbleEndPosition2020",
    "wobble_end_pos_2020_enum"
);

function wobbleEndPosFromApi(api: number): WobbleEndPosition2020 {
    switch (api) {
        case 0:
            return WobbleEndPosition2020.None;
        case 1:
            return WobbleEndPosition2020.StartLine;
        default:
            return WobbleEndPosition2020.DropZone;
    }
}

export function wobbleEndPosPoints(pos: WobbleEndPosition2020): number {
    switch (pos) {
        case "None":
            return 0;
        case "StartLine":
            return 5;
        case "DropZone":
            return 20;
    }
}

function formatWobbleEndPos(pos: WobbleEndPosition2020): string {
    switch (pos) {
        case "None":
            return "";
        case "StartLine":
            return "Start Line";
        case "DropZone":
            return "Drop Zone";
    }
}

type Api = AllianceScores2020TradFtcApi | Scores2020RemoteFtcApi;

export const Descriptor2020 = new Descriptor({
    season: Season.UltimateGoal,
    seasonName: "Ultimate Goal",
    hasRemote: true,
    hasEndgame: true,
    pensSubtract: true,
    rankings: {
        rp: "TotalPoints",
        tb: "AutoEndgameTot",
    },
    firstDate: new Date("2020-10-18"),
    lastDate: new Date("2021-09-11"),
    kickoff: new Date("2020-09-12"),
})
    .addColumn(
        new DescriptorColumn({ name: "autoWobble1" })
            .addMatchScore({ fromApi: (api: Api) => api.wobbleDelivered1, dataTy: BoolDTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoWobble2" })
            .addMatchScore({ fromApi: (api: Api) => api.wobbleDelivered2, dataTy: BoolDTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav1" })
            .addMatchScore({
                apiName: "autoNav2020_1",
                remoteApiName: "autoNav2020",
                fromApi: (api: Api) => api.navigated1,
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "Auto Nav 1",
                fullName: "Robot 1 Auto Navigation Points",
                getValue: (ms) => ms.autoNav2020_1 * 5,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2", tradOnly: true })
            .addMatchScore({
                apiName: "autoNav2020_2",
                fromApi: (api: Api) => api.navigated2,
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Auto Nav 2",
                fullName: "Robot 2 Auto Navigation Points",
                getValue: (ms) => ms.autoNav2020_2 * 5,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPowershots" })
            .addMatchScore({
                fromApi: (api: Api) =>
                    +api.autoPowerShotLeft + +api.autoPowerShotCenter + +api.autoPowerShotRight,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerLow" })
            .addMatchScore({ fromApi: (api: Api) => api.autoTowerLow, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerMid" })
            .addMatchScore({ fromApi: (api: Api) => api.autoTowerMid, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerHigh" })
            .addMatchScore({ fromApi: (api: Api) => api.autoTowerHigh, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerLow" })
            .addMatchScore({ fromApi: (api: Api) => api.dcTowerLow, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerMid" })
            .addMatchScore({ fromApi: (api: Api) => api.dcTowerMid, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerHigh" })
            .addMatchScore({ fromApi: (api: Api) => api.dcTowerHigh, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "wobbleEndPos1" })
            .addMatchScore({
                fromApi: (api: Api) => wobbleEndPosFromApi(api.wobbleEnd1),
                dataTy: WobbleEndPosition2020DTy,
            })
            .addScoreModal({
                displayName: "Wobble 1",
                columnPrefix: "Wobble 1",
                fullName: "Wobble Goal 1 Points",
                getValue: (ms) => wobbleEndPosPoints(ms.wobbleEndPos1),
                getTitle: (ms) => formatWobbleEndPos(ms.wobbleEndPos1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "wobbleEndPos2" })
            .addMatchScore({
                fromApi: (api: Api) => wobbleEndPosFromApi(api.wobbleEnd2),
                dataTy: WobbleEndPosition2020DTy,
            })
            .addScoreModal({
                displayName: "Wobble 2",
                columnPrefix: "Wobble 2",
                fullName: "Wobble Goal 2 Points",
                getValue: (ms) => wobbleEndPosPoints(ms.wobbleEndPos2),
                getTitle: (ms) => formatWobbleEndPos(ms.wobbleEndPos2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egWobbleRings" })
            .addMatchScore({
                fromApi: (api: Api) => api.wobbleRings1 + api.wobbleRings2,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egPowershots" })
            .addMatchScore({
                fromApi: (api: Api) =>
                    +api.endPowerShotLeft + +api.endPowerShotCenter + +api.endPowerShotRight,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.minorPenalties, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.majorPenalties, dataTy: Int16DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    "autoNav2020" in self
                        ? self.autoNav2020 * 5
                        : self.autoNav2020_1 * 5 + self.autoNav2020_2 * 5,
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
                    station == Station.Solo
                        ? ms.autoNav2020 * 5
                        : station == Station.One
                        ? ms.autoNav2020_1 * 5
                        : ms.autoNav2020_2 * 5,
                columnPrefix: "Auto Nav Individual",
                dialogName: "Individual",
                fullName: "Auto Navigation Points Individual",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoTowerLow * 3 + self.autoTowerMid * 6 + self.autoTowerHigh * 12,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Tower Points",
                columnPrefix: "Tower",
                fullName: "Auto Tower Points",
            })
            .addTep({ columnPrefix: "Auto Tower", fullName: "Auto Tower Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerLowPoints" })
            .addScoreModal({
                displayName: "Low",
                columnPrefix: "Auto Tower Low",
                fullName: "Auto Tower Low Points",
                sql: (ms) => `(${ms}.autoTowerLow * 3)`,
                getValue: (ms) => ms.autoTowerLow * 3,
                getTitle: (ms) => nOf(ms.autoTowerLow, "Ring"),
            })
            .addTep({
                make: (ms) => ms.autoTowerLow * 3,
                columnPrefix: "Auto Tower Low",
                fullName: "Auto Tower Low Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerMidPoints" })
            .addScoreModal({
                displayName: "Mid",
                columnPrefix: "Auto Tower Mid",
                fullName: "Auto Tower Mid Points",
                sql: (ms) => `(${ms}.autoTowerMid * 6)`,
                getValue: (ms) => ms.autoTowerMid * 6,
                getTitle: (ms) => nOf(ms.autoTowerMid, "Ring"),
            })
            .addTep({
                make: (ms) => ms.autoTowerMid * 6,
                columnPrefix: "Auto Tower Mid",
                fullName: "Auto Tower Mid Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerHighPoints" })
            .addScoreModal({
                displayName: "High",
                columnPrefix: "Auto Tower High",
                fullName: "Auto Tower Low Points",
                sql: (ms) => `(${ms}.autoTowerHigh * 12)`,
                getValue: (ms) => ms.autoTowerHigh * 12,
                getTitle: (ms) => nOf(ms.autoTowerHigh, "Ring"),
            })
            .addTep({
                make: (ms) => ms.autoTowerHigh * 12,
                columnPrefix: "Auto Tower High",
                fullName: "Auto Tower Low Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoWobblePoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoWobble1 * 15 + self.autoWobble2 * 15,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Wobble Goal Points",
                columnPrefix: "Auto Wobble",
                fullName: "Auto Wobble Goal Points",
                getTitle: (ms) => nOf(+ms.autoWobble1 + +ms.autoWobble2, "Wobble Goal"),
            })
            .addTep({ columnPrefix: "Auto Wobble", fullName: "Auto Wobble Goal Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPowershotPoints" })
            .addMatchScore({ fromSelf: (self) => self.autoPowershots * 15, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Powershot Points",
                columnPrefix: "Auto Powershot",
                fullName: "Auto Powershot Points",
                getTitle: (ms) => nOf(ms.autoPowershots, "Powershot"),
            })
            .addTep({ columnPrefix: "Auto Powershot", fullName: "Auto Powershot Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egWobblePoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    wobbleEndPosPoints(self.wobbleEndPos1) + wobbleEndPosPoints(self.wobbleEndPos2),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Wobble Goal Points",
                columnPrefix: "Endgame Wobble",
                fullName: "Endgame Wobble Goal Points",
            })
            .addTep({ columnPrefix: "Endgame Wobble", fullName: "Endgame Wobble Goal Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egPowershotPoints" })
            .addMatchScore({ fromSelf: (self) => self.egPowershots * 15, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Powershot Points",
                columnPrefix: "Endgame Powershot",
                fullName: "Endgame Powershot Points",
                getTitle: (ms) => nOf(ms.egPowershots, "Powershot"),
            })
            .addTep({ columnPrefix: "Endgame Powershot", fullName: "Endgame Powershot Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egWobbleRingPoints" })
            .addMatchScore({ fromSelf: (self) => self.egWobbleRings * 5, dataTy: Int16DTy })
            .addScoreModal({
                displayName: "Wobble Ring Points",
                columnPrefix: "Wobble Rings",
                fullName: "Endgame Wobble Ring Points",
                getTitle: (ms) => nOf(ms.egWobbleRings, "Ring"),
            })
            .addTep({
                columnPrefix: "Endgame Wobble Rings",
                fullName: "Endgame Wobble Ring Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommittedPoints" })
            .addScoreModal({
                displayName: "Majors Points",
                columnPrefix: "Majors",
                fullName: "Major Penalty Points",
                sql: (ms) => `(${ms}.majorsCommitted * -30)`,
                getValue: (ms) => ms.majorsCommitted * -30,
                getTitle: (ms) => nOf(ms.majorsCommitted, "Major Committed", "Majors Committed"),
            })
            .addTep({
                make: (ms) => ms.majorsCommitted * -30,
                columnPrefix: "Majors",
                dialogName: "Majors",
                fullName: "Major Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommittedPoints" })
            .addScoreModal({
                displayName: "Minors Points",
                columnPrefix: "Minors",
                fullName: "Minor Penalty Points",
                sql: (ms) => `(${ms}.minorsCommitted * -10)`,
                getValue: (ms) => ms.minorsCommitted * -10,
                getTitle: (ms) => nOf(ms.minorsCommitted, "Minor Committed", "Minors Committed"),
            })
            .addTep({
                make: (ms) => ms.minorsCommitted * -10,
                columnPrefix: "Minors",
                dialogName: "Minors",
                fullName: "Minor Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoNavPoints +
                    self.autoTowerPoints +
                    self.autoWobblePoints +
                    self.autoPowershotPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({ displayName: "Auto", columnPrefix: "Auto", fullName: "Auto Points" })
            .addTep({ columnPrefix: "Auto", dialogName: "Auto Points", fullName: "Auto Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.dcTowerLow * 2 + self.dcTowerMid * 4 + self.dcTowerHigh * 6,
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
        new DescriptorColumn({ name: "dcTowerLowPoints" })
            .addScoreModal({
                displayName: "Low",
                columnPrefix: "DC Tower Low",
                fullName: "Teleop Tower Low Points",
                sql: (ms) => `(${ms}.dcTowerLow * 2)`,
                getValue: (ms) => ms.dcTowerLow * 2,
                getTitle: (ms) => nOf(ms.dcTowerLow, "Ring"),
            })
            .addTep({
                make: (ms) => ms.dcTowerLow * 2,
                columnPrefix: "DC Tower Low",
                fullName: "Teleop Tower Low Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerMidPoints" })
            .addScoreModal({
                displayName: "Mid",
                columnPrefix: "DC Tower Mid",
                fullName: "Teleop Tower Mid Points",
                sql: (ms) => `(${ms}.dcTowerMid * 4)`,
                getValue: (ms) => ms.dcTowerMid * 4,
                getTitle: (ms) => nOf(ms.dcTowerMid, "Ring"),
            })
            .addTep({
                make: (ms) => ms.dcTowerMid * 4,
                columnPrefix: "DC Tower Mid",
                fullName: "Teleop Tower Mid Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerHighPoints" })
            .addScoreModal({
                displayName: "High",
                columnPrefix: "DC Tower High",
                fullName: "Teleop Tower High Points",
                sql: (ms) => `(${ms}.dcTowerHigh * 6)`,
                getValue: (ms) => ms.dcTowerHigh * 6,
                getTitle: (ms) => nOf(ms.dcTowerHigh, "Ring"),
            })
            .addTep({
                make: (ms) => ms.dcTowerHigh * 6,
                columnPrefix: "DC Tower High",
                fullName: "Teleop Tower High Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.egPowershotPoints + self.egWobblePoints + self.egWobbleRingPoints,
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
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                fromSelf: (self) => self.majorsCommitted * -30 + self.minorsCommitted * -10,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Penalties",
                columnPrefix: "Penalties",
                fullName: "Penalty Points",
            })
            .addTep({
                columnPrefix: "Penalties",
                dialogName: "Penalty Points",
                fullName: "Penalty Points",
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
                fromSelf: (self) => Math.max(0, self.totalPointsNp),
                dataTy: Int16DTy,
            })
            .addTep({ columnPrefix: "", dialogName: "Total Points", fullName: "Total Points" })
    )

    .addTree(
        [
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
                        val: "autoTowerPoints",
                        children: [
                            { val: "autoTowerLowPoints", children: [] },
                            { val: "autoTowerMidPoints", children: [] },
                            { val: "autoTowerHighPoints", children: [] },
                        ],
                    },
                    { val: "autoWobblePoints", children: [] },
                    { val: "autoPowershotPoints", children: [] },
                ],
            },
            {
                val: "dcPoints",
                children: [
                    { val: "dcTowerLowPoints", children: [] },
                    { val: "dcTowerMidPoints", children: [] },
                    { val: "dcTowerHighPoints", children: [] },
                ],
            },
            {
                val: "egPoints",
                children: [
                    { val: "egPowershotPoints", children: [] },
                    {
                        val: "egWobblePoints",
                        children: [
                            { val: "wobbleEndPos1", children: [] },
                            { val: "wobbleEndPos2", children: [] },
                        ],
                    },
                    { val: "egWobbleRingPoints", children: [] },
                ],
            },
            {
                val: "penaltyPointsCommitted",
                children: [
                    { val: "majorsCommittedPoints", children: [] },
                    { val: "minorsCommittedPoints", children: [] },
                ],
            },
        ],
        [
            { val: "totalPoints", children: [] },
            { val: "totalPointsNp", children: [] },
            {
                val: "autoPoints",
                children: [
                    { val: "autoNavPoints", children: [] },
                    {
                        val: "autoTowerPoints",
                        children: [
                            { val: "autoTowerLowPoints", children: [] },
                            { val: "autoTowerMidPoints", children: [] },
                            { val: "autoTowerHighPoints", children: [] },
                        ],
                    },
                    { val: "autoWobblePoints", children: [] },
                    { val: "autoPowershotPoints", children: [] },
                ],
            },
            {
                val: "dcPoints",
                children: [
                    { val: "dcTowerLowPoints", children: [] },
                    { val: "dcTowerMidPoints", children: [] },
                    { val: "dcTowerHighPoints", children: [] },
                ],
            },
            {
                val: "egPoints",
                children: [
                    { val: "egPowershotPoints", children: [] },
                    {
                        val: "egWobblePoints",
                        children: [
                            { val: "wobbleEndPos1", children: [] },
                            { val: "wobbleEndPos2", children: [] },
                        ],
                    },
                    { val: "egWobbleRingPoints", children: [] },
                ],
            },
            {
                val: "penaltyPointsCommitted",
                children: [
                    { val: "majorsCommittedPoints", children: [] },
                    { val: "minorsCommittedPoints", children: [] },
                ],
            },
        ]
    )
    .finish();
