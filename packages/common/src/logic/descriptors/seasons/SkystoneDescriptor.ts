import { AllianceScores2019TradFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2019Trad";
import { Season } from "../../Season";
import { inferDescriptor } from "../descriptor";
import { BoolDTy, IntDTy } from "../types";

export const Descriptor2019 = inferDescriptor({
    season: Season.Skystone,
    hasRemote: false,
    penaltiesSubtract: false,
    rankings: {
        rp: "Record",
        tb: "LosingScore",
    },
    columns: [
        {
            name: "autoNav2019_1",
            type: BoolDTy,
            ms: { fromTradApi: (api: AllianceScores2019TradFtcApi) => api.robot1Navigated },
        },
        {
            name: "autoNav2019_2",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.robot2Navigated },
        },
        {
            name: "repositioned",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.foundationRepositioned },
        },
        {
            name: "autoDelivered",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoDelivered },
        },
        {
            name: "autoSkystonesDeliveredFirst",
            type: IntDTy(8),
            ms: {
                fromTradApi: (api) =>
                    api.autoStones
                        ? +(api.autoStones[0] == "SKYSTONE") + +(api.autoStones[1] == "SKYSTONE")
                        : 0,
            },
        },
        {
            name: "autoReturned",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoReturned },
        },
        {
            name: "autoFirstReturnedSkystone",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.firstReturnedIsSkystone },
        },
        {
            name: "autoPlaced",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.autoPlaced },
        },
        {
            name: "dcDelivered",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.driverControlledDelivered },
        },
        {
            name: "dcReturned",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.driverControlledReturned },
        },

        {
            name: "dcPlaced",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.driverControlledPlaced },
        },
        {
            name: "skyscraperHeight",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.tallestSkyscraper },
        },
        {
            name: "capLevel1",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.robot1CapstoneLevel },
        },
        {
            name: "capLevel2",
            type: IntDTy(8),
            ms: { fromTradApi: (api) => api.robot2CapstoneLevel },
        },
        {
            name: "egFoundationMoved",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.foundationMoved },
        },
        {
            name: "egParked1",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.robot1Parked },
        },
        {
            name: "egParked2",
            type: BoolDTy,
            ms: { fromTradApi: (api) => api.robot2Parked },
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
            ms: { fromSelf: (self) => self.minorsCommitted * 5 + self.majorsCommitted * 20 },
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
            ms: { fromSelf: (self) => self.minorsByOpp * 5 + self.majorsByOpp * 20 },
            tep: {},
        },
        {
            name: "autoNavPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.autoNav2019_1 * 5 + self.autoNav2019_2 * 5 },
            tep: {
                individual: {
                    first: (self) => self.autoNav2019_1 * 5,
                    second: (self) => self.autoNav2019_2 * 5,
                },
            },
        },
        {
            name: "autoRepositioningPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.repositioned * 10 },
            tep: {},
        },
        {
            name: "autoDeliveryPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) =>
                    self.autoDelivered * 2 +
                    self.autoSkystonesDeliveredFirst * 8 -
                    self.autoReturned * 2 -
                    self.autoFirstReturnedSkystone * 8,
            },
            tep: {},
        },
        {
            name: "autoPlacementPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.autoPlaced * 4 },
            tep: {},
        },
        {
            name: "dcDeliveryPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.dcDelivered - self.dcReturned },
            tep: {},
        },
        {
            name: "dcPlacementPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.dcPlaced },
            tep: {},
        },
        {
            name: "skyscraperBonusPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.skyscraperHeight * 2 },
            tep: {},
        },
        {
            name: "cappingPoints",
            type: IntDTy(8),
            ms: {
                fromSelf: (self) =>
                    (self.capLevel1 == -1 ? 0 : self.capLevel1 + 5) +
                    (self.capLevel2 == -1 ? 0 : self.capLevel2 + 5),
            },
            tep: {
                individual: {
                    first: (self) => (self.capLevel1 == -1 ? 0 : self.capLevel1 + 5),
                    second: (self) => (self.capLevel2 == -1 ? 0 : self.capLevel2 + 5),
                },
            },
        },
        {
            name: "egParkPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.egParked1 * 5 + self.egParked2 * 5 },
            tep: {
                individual: {
                    first: (self) => self.egParked1 * 5,
                    second: (self) => self.egParked2 * 5,
                },
            },
        },
        {
            name: "egFoundationMovedPoints",
            type: IntDTy(8),
            ms: { fromSelf: (self) => self.egFoundationMoved * 15 },
            tep: {},
        },
        {
            name: "autoPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.autoNavPoints +
                    self.autoRepositioningPoints +
                    self.autoDeliveryPoints +
                    self.autoPlacementPoints,
            },
            tep: {},
        },
        {
            name: "dcPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.dcDeliveryPoints + self.dcPlacementPoints + self.skyscraperBonusPoints,
            },
            tep: {},
        },
        {
            name: "egPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.cappingPoints + self.egParkPoints + self.egFoundationMovedPoints,
            },
            tep: {},
        },
        {
            name: "totalPoints",
            type: IntDTy(16),
            ms: {
                fromSelf: (self) =>
                    self.autoPoints + self.dcPoints + self.egPoints + self.penaltyPointsByOpp,
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
});
