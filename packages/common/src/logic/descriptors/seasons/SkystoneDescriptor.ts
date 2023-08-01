import { AllianceScores2019TradFtcApi } from "packages/common/src/ftc-api-types/match-scores/MatchScores2019Trad";
import { Season } from "../../Season";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { BoolDTy, Int16DTy, Int8DTy } from "../types";
import { Station } from "../../Station";
import { nOf } from "../../../utils/format/n-of";

function cappingPoints(level: number): number {
    return level == -1 ? 0 : level * 5;
}

function formatCapLevel(level: number): string {
    return level == -1 ? "No Cap" : nOf(level, "Level");
}

type Api = AllianceScores2019TradFtcApi;

export const Descriptor2019 = new Descriptor({
    season: Season.Skystone,
    hasRemote: false,
    pensSubtract: false,
    rankings: {
        rp: "Record",
        tb: "LosingScore",
    },
})
    .addColumn(
        new DescriptorColumn({ name: "autoNav1" })
            .addMatchScore({
                apiName: "autoNav2019_1",
                fromApi: (api: Api) => api.robot1Navigated,
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                getValue: (ms) => ms.autoNav2019_1 * 5,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNav2" })
            .addMatchScore({
                apiName: "autoNav2019_2",
                fromApi: (api: Api) => api.robot2Navigated,
                dataTy: BoolDTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                getValue: (ms) => ms.autoNav2019_2 * 5,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "repositioned" })
            .addMatchScore({ fromApi: (api: Api) => api.foundationRepositioned, dataTy: BoolDTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoDelivered" })
            .addMatchScore({ fromApi: (api: Api) => api.autoDelivered, dataTy: Int8DTy })
            .addScoreModal({
                displayName: "Regular Stones",
                getValue: (ms) => (ms.autoDelivered - ms.autoSkystonesDeliveredFirst) * 2,
                getTitle: (ms) => nOf(ms.autoDelivered - ms.autoSkystonesDeliveredFirst, "Stone"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoSkystonesDeliveredFirst" })
            .addMatchScore({
                fromApi: (api: Api) =>
                    api.autoStones
                        ? +(api.autoStones[0] == "SKYSTONE") + +(api.autoStones[1] == "SKYSTONE")
                        : 0,
                dataTy: Int8DTy,
            })
            .addScoreModal({
                displayName: "Skystones",
                getValue: (ms) => ms.autoSkystonesDeliveredFirst * 10,
                getTitle: (ms) => nOf(ms.autoSkystonesDeliveredFirst, "Skystone"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoReturned" })
            .addMatchScore({ fromApi: (api: Api) => api.autoReturned, dataTy: Int8DTy })
            .addScoreModal({
                displayName: "Returned",
                getValue: (ms) => ms.autoReturned * -2 + ms.autoFirstReturnedSkystone * -8,
                getTitle: (ms) =>
                    ms.autoFirstReturnedSkystone
                        ? `${nOf(ms.autoReturned, "Stone")} and 1 Skystone`
                        : nOf(ms.autoReturned, "Stone"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoFirstReturnedSkystone" })
            .addMatchScore({ fromApi: (api: Api) => api.firstReturnedIsSkystone, dataTy: BoolDTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPlaced" })
            .addMatchScore({ fromApi: (api: Api) => api.autoPlaced, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "dcDelivered" })
            .addMatchScore({
                fromApi: (api: Api) => api.driverControlledDelivered,
                dataTy: Int8DTy,
            })
            .addScoreModal({
                displayName: "Delivered",
                getTitle: (ms) => nOf(ms.dcDelivered, "Stone"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcReturned" })
            .addMatchScore({ fromApi: (api: Api) => api.driverControlledReturned, dataTy: Int8DTy })
            .addScoreModal({
                displayName: "Returned",
                getValue: (ms) => -ms.dcReturned,
                getTitle: (ms) => nOf(ms.dcReturned, "Stone"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPlaced" })
            .addMatchScore({ fromApi: (api: Api) => api.driverControlledPlaced, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "skyscraperHeight" })
            .addMatchScore({ fromApi: (api: Api) => api.tallestSkyscraper, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "capLevel1" })
            .addMatchScore({ fromApi: (api: Api) => api.robot1CapstoneLevel, dataTy: Int8DTy })
            .addScoreModal({
                displayName: "Robot 1",
                getValue: (ms) => cappingPoints(ms.capLevel1),
                getTitle: (ms) => formatCapLevel(ms.capLevel1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "capLevel2" })
            .addMatchScore({ fromApi: (api: Api) => api.robot2CapstoneLevel, dataTy: Int8DTy })
            .addScoreModal({
                displayName: "Robot 2",
                getValue: (ms) => cappingPoints(ms.capLevel2),
                getTitle: (ms) => formatCapLevel(ms.capLevel2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egFoundationMoved" })
            .addMatchScore({ fromApi: (api: Api) => api.foundationMoved, dataTy: BoolDTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egParked1" })
            .addMatchScore({ fromApi: (api: Api) => api.robot1Parked, dataTy: BoolDTy })
            .addScoreModal({
                displayName: "Robot 1",
                getValue: (ms) => ms.egParked1 * 5,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "egParked2" })
            .addMatchScore({ fromApi: (api: Api) => api.robot2Parked, dataTy: BoolDTy })
            .addScoreModal({
                displayName: "Robot 2",
                getValue: (ms) => ms.egParked2 * 5,
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.minorPenalties, dataTy: Int8DTy })
            .addScoreModal({
                displayName: "Minors Points",
                getValue: (ms) => ms.minorsCommitted * 5,
                getTitle: (ms) => nOf(ms.minorsCommitted, "Minor Committed", "Minors Committed"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommitted" })
            .addMatchScore({ fromApi: (api: Api) => api.majorPenalties, dataTy: Int8DTy })
            .addScoreModal({
                displayName: "Majors Points",
                getValue: (ms) => ms.majorsCommitted * 20,
                getTitle: (ms) => nOf(ms.majorsCommitted, "Major Committed", "Majors Committed"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                fromSelf: (self) => self.minorsCommitted * 5 + self.majorsCommitted * 20,
                dataTy: Int16DTy,
            })
            .addTep()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOpp" })
            .addMatchScore({ fromApi: (_, oth) => oth.minorPenalties, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsByOpp" })
            .addMatchScore({ fromApi: (_, oth) => oth.majorPenalties, dataTy: Int8DTy })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsByOpp" })
            .addMatchScore({
                fromSelf: (self) => self.minorsByOpp * 5 + self.majorsByOpp * 20,
                dataTy: Int16DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Penalties" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoNav2019_1 * 5 + self.autoNav2019_2 * 5,
                dataTy: Int8DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Navigation Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoNavPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.One ? ms.autoNav2019_1 * 5 : ms.autoNav2019_2 * 5,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "autoRepositioningPoints" })
            .addMatchScore({ fromSelf: (self) => self.repositioned * 10, dataTy: Int8DTy })
            .addTep()
            .addScoreModal({ displayName: "Repositioning Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoDeliveryPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoDelivered * 2 +
                    self.autoSkystonesDeliveredFirst * 8 -
                    self.autoReturned * 2 -
                    self.autoFirstReturnedSkystone * 8,
                dataTy: Int8DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Delivery Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPlacementPoints" })
            .addMatchScore({ fromSelf: (self) => self.autoPlaced * 4, dataTy: Int8DTy })
            .addTep()
            .addScoreModal({
                displayName: "Placement Points",
                getTitle: (ms) => nOf(ms.autoPlaced, "Stone"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcDeliveryPoints" })
            .addMatchScore({
                fromSelf: (self) => self.dcDelivered - self.dcReturned,
                dataTy: Int8DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Delivery Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPlacementPoints" })
            .addMatchScore({ fromSelf: (self) => self.dcPlaced, dataTy: Int8DTy })
            .addTep()
            .addScoreModal({
                displayName: "Placement Points",
                getTitle: (ms) => nOf(ms.dcPlaced, "Stone"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "skyscraperBonusPoints" })
            .addMatchScore({ fromSelf: (self) => self.skyscraperHeight * 2, dataTy: Int8DTy })
            .addTep()
            .addScoreModal({
                displayName: "Skyscraper Points",
                getTitle: (ms) => nOf(ms.skyscraperHeight, "Level"),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "cappingPoints" })
            .addMatchScore({
                fromSelf: (self) => cappingPoints(self.capLevel1) + cappingPoints(self.capLevel2),
                dataTy: Int8DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Capping Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "cappingPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    cappingPoints(station == Station.One ? ms.capLevel1 : ms.capLevel2),
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egParkPoints" })
            .addMatchScore({
                fromSelf: (self) => self.egParked1 * 5 + self.egParked2 * 5,
                dataTy: Int8DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Parking Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egParkPointsIndividual" })
            .addTep({
                isIndividual: true,
                make: (ms, station) =>
                    station == Station.One ? ms.egParked1 * 5 : ms.egParked2 * 5,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "egFoundationMovedPoints" })
            .addMatchScore({ fromSelf: (self) => self.egFoundationMoved * 15, dataTy: Int8DTy })
            .addTep()
            .addScoreModal({ displayName: "Movement Points" })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoNavPoints +
                    self.autoRepositioningPoints +
                    self.autoDeliveryPoints +
                    self.autoPlacementPoints,
                dataTy: Int16DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Auto" })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.dcDeliveryPoints + self.dcPlacementPoints + self.skyscraperBonusPoints,
                dataTy: Int16DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Driver-Controlled" })
    )
    .addColumn(
        new DescriptorColumn({ name: "egPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.cappingPoints + self.egParkPoints + self.egFoundationMovedPoints,
                dataTy: Int16DTy,
            })
            .addTep()
            .addScoreModal({ displayName: "Endgame" })
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
                fromSelf: (self) => self.totalPointsNp + self.penaltyPointsByOpp,
                dataTy: Int16DTy,
            })
            .addTep()
    )

    .addScoreModalTree([
        {
            val: "autoPoints",
            children: [
                {
                    val: "autoDeliveryPoints",
                    children: [
                        { val: "autoSkystonesDeliveredFirst", children: [] },
                        { val: "autoDelivered", children: [] },
                        { val: "autoReturned", children: [] },
                    ],
                },
                { val: "autoPlacementPoints", children: [] },
                { val: "autoRepositioningPoints", children: [] },
                {
                    val: "autoNavPoints",
                    children: [
                        { val: "autoNav1", children: [] },
                        { val: "autoNav2", children: [] },
                    ],
                },
            ],
        },
        {
            val: "dcPoints",
            children: [
                {
                    val: "dcDeliveryPoints",
                    children: [
                        { val: "dcDelivered", children: [] },
                        { val: "dcReturned", children: [] },
                    ],
                },
                { val: "dcPlacementPoints", children: [] },
            ],
        },
        {
            val: "egPoints",
            children: [
                {
                    val: "cappingPoints",
                    children: [
                        { val: "capLevel1", children: [] },
                        { val: "capLevel2", children: [] },
                    ],
                },
                { val: "egFoundationMovedPoints", children: [] },
                {
                    val: "egParkPoints",
                    children: [
                        { val: "egParked1", children: [] },
                        { val: "egParked2", children: [] },
                    ],
                },
            ],
        },
        {
            val: "penaltyPointsByOpp",
            children: [
                { val: "majorsCommitted", children: [] },
                { val: "minorsCommitted", children: [] },
            ],
        },
    ])
    .finish();
