import { Scores2020RemoteFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2020Remote";
import { AllianceScores2020TradFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2020Trad";
import { Season } from "../../Season";
import { Station } from "../../Station";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { BoolDTy, EnumDTy, Int16DTy, Int8DTy } from "../types";

export const WobbleEndPosition2020 = {
    None: "None",
    StartLine: "StartLine",
    DropZone: "DropZone",
} as const;
export type WobbleEndPosition2020 =
    (typeof WobbleEndPosition2020)[keyof typeof WobbleEndPosition2020];
const WobbleEndPosition2020DTy = EnumDTy(WobbleEndPosition2020, "WobbleEndPosition2020");

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

type Api = AllianceScores2020TradFtcApi | Scores2020RemoteFtcApi;

export const Descriptor2020 = new Descriptor({
    season: Season.UltimateGoal,
    hasRemote: true,
    pensSubtract: true,
    rankings: {
        rp: "TotalPoints",
        tb: "AutoEndgameTot",
    },
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
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2", tradOnly: true })
            .addMatchScore({
                apiName: "autoNav2020_2",
                fromApi: (api: Api) => api.navigated2,
                dataTy: BoolDTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPowershots" })
            .addMatchScore({
                fromApi: (api: Api) =>
                    +api.autoPowerShotLeft + +api.autoPowerShotCenter + +api.autoPowerShotRight,
                dataTy: Int8DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerLow" })
            .addMatchScore({ fromApi: (api: Api) => api.autoTowerLow, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerMid" })
            .addMatchScore({ fromApi: (api: Api) => api.autoTowerMid, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerHigh" })
            .addMatchScore({ fromApi: (api: Api) => api.autoTowerHigh, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerLow" })
            .addMatchScore({ fromApi: (api: Api) => api.dcTowerLow, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerMid" })
            .addMatchScore({ fromApi: (api: Api) => api.dcTowerMid, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerHigh" })
            .addMatchScore({ fromApi: (api: Api) => api.dcTowerHigh, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "wobbleEndPos1" })
            .addMatchScore({
                fromApi: (api: Api) => wobbleEndPosFromApi(api.wobbleEnd1),
                dataTy: WobbleEndPosition2020DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "wobbleEndPos2" })
            .addMatchScore({
                fromApi: (api: Api) => wobbleEndPosFromApi(api.wobbleEnd2),
                dataTy: WobbleEndPosition2020DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egWobbleRings" })
            .addMatchScore({
                fromApi: (api: Api) => api.wobbleRings1 + api.wobbleRings2,
                dataTy: Int8DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egPowershots" })
            .addMatchScore({
                fromApi: (api: Api) =>
                    +api.endPowerShotLeft + +api.endPowerShotCenter + +api.endPowerShotRight,
                dataTy: Int8DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.minorPenalties, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.majorPenalties, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    "autoNav2020" in self
                        ? self.autoNav2020 * 5
                        : self.autoNav2020_1 * 5 + self.autoNav2020_2 * 5,
                dataTy: Int8DTy,
            })
            .addTep()
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
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoTowerLow * 3 + self.autoTowerMid * 6 + self.autoTowerHigh * 12,
                dataTy: Int8DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerLowPoints" })
            .addTep({ make: (ms) => ms.autoTowerLow * 3 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerMidPoints" })
            .addTep({ make: (ms) => ms.autoTowerMid * 6 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoTowerHighPoints" })
            .addTep({ make: (ms) => ms.autoTowerHigh * 12 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoWobblePoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoWobble1 * 15 + self.autoWobble2 * 15,
                dataTy: Int8DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPowershotPoints" })
            .addMatchScore({ fromSelf: (self) => self.autoPowershots * 15, dataTy: Int8DTy })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "egWobblePoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    wobbleEndPosPoints(self.wobbleEndPos1) + wobbleEndPosPoints(self.wobbleEndPos2),
                dataTy: Int8DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "egPowershotPoints" })
            .addMatchScore({ fromSelf: (self) => self.egPowershots * 15, dataTy: Int8DTy })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "egWobbleRingPoints" })
            .addMatchScore({ fromSelf: (self) => self.egWobbleRings * 5, dataTy: Int8DTy })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommittedPoints" })
            .addTep({ make: (ms) => ms.majorsCommitted * -30 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommittedPoints" })
            .addTep({ make: (ms) => ms.minorsCommitted * -10 })
            .finish()
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
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.dcTowerLow * 2 + self.dcTowerMid * 4 + self.dcTowerHigh * 6,
                dataTy: Int16DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerLowPoints" })
            .addTep({ make: (ms) => ms.dcTowerLow * 2 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerMidPoints" })
            .addTep({ make: (ms) => ms.dcTowerMid * 4 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcTowerHighPoints" })
            .addTep({ make: (ms) => ms.dcTowerHigh * 6 })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.egPowershotPoints + self.egWobblePoints + self.egWobbleRingPoints,
                dataTy: Int16DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                fromSelf: (self) => self.majorsCommitted * -30 + self.minorsCommitted * -10,
                dataTy: Int16DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPointsNp" })
            .addMatchScore({
                fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints,
                dataTy: Int16DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "totalPoints" })
            .addMatchScore({
                fromSelf: (self) => Math.max(0, self.totalPointsNp),
                dataTy: Int16DTy,
            })
            .addTep()
    )
    .finish();
