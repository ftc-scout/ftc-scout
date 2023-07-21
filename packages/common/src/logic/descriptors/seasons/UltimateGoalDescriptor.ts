import { AllianceScores2020TradFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2020Trad";
import { Season } from "../../Season";
import { inferDescriptor } from "../descriptor";
import { BoolDTy, EnumDTy, IntDTy } from "../types";

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

export const Descriptor2020 = inferDescriptor({
    season: Season.UltimateGoal,
    hasRemote: true,
    penaltiesSubtract: true,
    rankings: {
        rp: "TotalPoints",
        tb: "AutoEndgameTot",
    },
    columns: [
        {
            name: "autoWobble1",
            type: BoolDTy,
            ms: { fromTradApi: (api: AllianceScores2020TradFtcApi) => api.wobbleDelivered1 },
        },
        {
            name: "autoWobble2",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.wobbleDelivered2 },
        },
        {
            name: "autoNav2020_1",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.navigated1 },
        },
        {
            name: "autoNav2020_2",
            type: BoolDTy,
            tradOnly: true,
            ms: { fromTradApi: (api) => api.navigated2 },
        },
        {
            name: "autoPowershots",
            type: IntDTy(8),
            ms: {
                fromTradApi: (api) =>
                    +api.autoPowerShotCenter + +api.autoPowerShotLeft + +api.autoPowerShotRight,
            },
        },
        {
            name: "autoTowerLow",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoTowerLow },
        },
        {
            name: "autoTowerMid",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoTowerMid },
        },
        {
            name: "autoTowerHigh",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoTowerHigh },
        },
        {
            name: "dcTowerLow",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcTowerLow },
        },
        {
            name: "dcTowerMid",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcTowerMid },
        },
        {
            name: "dcTowerHigh",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.dcTowerHigh },
        },
        {
            name: "wobbleEndPos1",
            type: WobbleEndPosition2020DTy,
            ms: { fromTradApi: (api) => wobbleEndPosFromApi(api.wobbleEnd1) },
        },
        {
            name: "wobbleEndPos2",
            type: WobbleEndPosition2020DTy,
            ms: { fromTradApi: (api) => wobbleEndPosFromApi(api.wobbleEnd2) },
        },
        {
            name: "egWobbleRings",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.wobbleRings1 + api.wobbleRings2 },
        },
        {
            name: "egPowershots",
            type: IntDTy(8),
            ms: {
                fromTradApi: (api) =>
                    +api.endPowerShotCenter + +api.endPowerShotLeft + +api.endPowerShotRight,
            },
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
            name: "autoNavPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => (self.autoNav2020_1 ? 5 : 0) + (self.autoNav2020_2 ? 5 : 0) },
            tep: {
                individual: {
                    first: (self) => (self.autoNav2020_1 ? 5 : 0),
                    second: (self) => (self.autoNav2020_2 ? 5 : 0),
                },
            },
        },
        {
            name: "autoTowerPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) =>
                    self.autoTowerLow * 3 + self.autoTowerMid * 6 + self.autoTowerHigh * 12,
            },
            tep: {},
        },
        {
            name: "autoTowerLowPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.autoTowerLow * 3 },
        },
        {
            name: "autoTowerMidPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.autoTowerMid * 6 },
        },
        {
            name: "autoTowerHighPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.autoTowerHigh * 12 },
        },
        {
            name: "autoWobblePoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.autoWobble1 * 15 + self.autoWobble2 * 15 },
            tep: {},
        },
        {
            name: "autoPowershotPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.autoPowershots * 15 },
            tep: {},
        },
        {
            name: "egWobblePoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) =>
                    wobbleEndPosPoints(self.wobbleEndPos1) + wobbleEndPosPoints(self.wobbleEndPos2),
            },
            tep: {},
        },
        {
            name: "egPowershotPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.egPowershots * 15 },
            tep: {},
        },
        {
            name: "egWobbleRingPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.egWobbleRings * 5 },
            tep: {},
        },
        {
            name: "majorPenaltyPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.majorsCommitted * -30 },
        },
        {
            name: "minorPenaltyPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.majorsCommitted * -10 },
        },
        {
            name: "autoPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.autoNavPoints +
                    self.autoTowerPoints +
                    self.autoWobblePoints +
                    self.autoPowershotPoints,
            },
            tep: {},
        },
        {
            name: "dcPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.dcTowerLow * 2 + self.dcTowerMid * 4 + self.dcTowerHigh * 6,
            },
            tep: {},
        },
        {
            name: "dcTowerLowPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.dcTowerLow * 3 },
        },
        {
            name: "dcTowerMidPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.dcTowerMid * 6 },
        },
        {
            name: "dcTowerHighPoints",
            type: IntDTy(8),
            tep: { fromSelf: (self) => self.dcTowerHigh * 12 },
        },
        {
            name: "egPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.egPowershotPoints + self.egWobblePoints + self.egWobbleRingPoints,
            },
            tep: {},
        },
        {
            name: "penaltyPoints",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.majorsCommitted * -30 + self.minorsCommitted * -10 },
            tep: {},
        },
        {
            name: "totalPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    Math.max(
                        0,
                        self.autoPoints + self.dcPoints + self.egPoints + self.penaltyPoints
                    ),
            },
            tep: {},
        },
        {
            name: "totalPointsNp",
            type: IntDTy(16),
            ms: { fromSelf: (self) => self.autoPoints + self.dcPoints + self.egPoints },
            tep: {},
        },
    ],
    scoreTree: [],
});
