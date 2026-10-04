import {
    AllianceScores2026TradFtcApi,
    ApiBiobuzzScoringElement,
} from "../../../ftc-api-types/match-scores/MatchScores2026Trad";
import { Season } from "../../Season";
import { Station } from "../../Station";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { AnyDTy, BoolDTy, EnumDTy, Int16DTy } from "../types";
import { GraphQLList } from "graphql/type";
import { nOf } from "../../../utils/format/n-of";

type Api = AllianceScores2026TradFtcApi;

function leavePoints(didLeave: boolean): number {
    return didLeave ? 3 : 0;
}

function formatLeave(points: number): string {
    return points ? "Left Wall" : "Touching Wall";
}

function parkPoints(didPark: boolean): number {
    return didPark ? 5 : 0;
}

function formatPark(points: number): string {
    return points ? "Parked" : "Not Parked";
}

export const NectarType = {
    RedNectar: "RedNectar",
    BlueNectar: "BlueNectar",
    Pollen: "Pollen",
} as const;
export type NectarType = (typeof NectarType)[keyof typeof NectarType];
const NectarTypeDTy = EnumDTy(NectarType, "NectarType", "nectar_type_enum");

function nectarTypeFromApi(el: ApiBiobuzzScoringElement): NectarType {
    switch (el) {
        case "RED_NECTAR":
            return NectarType.RedNectar;
        case "BLUE_NECTAR":
            return NectarType.BlueNectar;
        case "POLLEN":
            return NectarType.Pollen;
    }
}

function flowerStateFromApi(api: ApiBiobuzzScoringElement[]): NectarType[] {
    return api.map(nectarTypeFromApi);
}

let flowerStateGQL = new GraphQLList(NectarTypeDTy.gql);
const FlowerStateDTy = AnyDTy(flowerStateGQL);

export const Descriptor2026 = new Descriptor({
    season: Season.BioBuzz,
    seasonName: "BioBuzz",
    hasRemote: false,
    hasEndgame: false,
    pensSubtract: false,
    rankings: {
        rp: "BioBuzzRP",
        tb: "AvgNpTips",
    },
    rankingPoints: [
        { id: "swarmRp", name: "Swarm Ranking Point" },
        { id: "pollinator1Rp", name: "Pollinator 1 Ranking Point" },
        { id: "pollinator2Rp", name: "Pollinator 2 Ranking Point" },
    ],
    firstDate: new Date("2026-09-12"),
    lastDate: new Date("2027-09-10"),
    kickoff: new Date("2026-09-12"),
})
    .addColumn(
        new DescriptorColumn({ name: "autoLeave1" })
            .addMatchScore({
                fromApi: (api: Api) => leavePoints(api.autoRobot1Leave),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "Auto Leave 1",
                fullName: "Robot 1 Auto Leave Points",
                getTitle: (ms) => formatLeave(ms.autoLeave1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLeave2" })
            .addMatchScore({
                fromApi: (api: Api) => leavePoints(api.autoRobot2Leave),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Auto Leave 2",
                fullName: "Robot 2 Auto Leave Points",
                getTitle: (ms) => formatLeave(ms.autoLeave2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLeavePointsIndividual" }).addTep({
            isIndividual: true,
            make: (ms, station) =>
                station == Station.One ? ms.autoLeave1 : station == Station.Two ? ms.autoLeave2 : 0,
            columnPrefix: "Auto Leave Individual",
            dialogName: "Individual",
            fullName: "Auto Leave Points Individual",
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLeavePoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoLeave1 + self.autoLeave2,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Leave Points",
                columnPrefix: "Auto Leave",
                fullName: "Auto Leave Points",
            })
            .addTep({
                columnPrefix: "Auto Leave",
                fullName: "Auto Leave Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoParkPoints1" })
            .addMatchScore({
                fromApi: (api: Api) => parkPoints(api.autoRobot1Park),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "Auto Park 1",
                fullName: "Robot 1 Auto Park Points",
                getTitle: (ms) => formatPark(ms.autoParkPoints1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoParkPoints2" })
            .addMatchScore({
                fromApi: (api: Api) => parkPoints(api.autoRobot2Park),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "Auto Park 2",
                fullName: "Robot 2 Auto Park Points",
                getTitle: (ms) => formatPark(ms.autoParkPoints2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoParkPointsIndividual" }).addTep({
            isIndividual: true,
            make: (ms, station) =>
                station == Station.One
                    ? ms.autoParkPoints1
                    : station == Station.Two
                    ? ms.autoParkPoints2
                    : 0,
            columnPrefix: "Auto Park Individual",
            dialogName: "Individual",
            fullName: "Auto Park Points Individual",
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoParkPoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoParkPoints1 + self.autoParkPoints2,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Park Points",
                columnPrefix: "Auto Park",
                fullName: "Auto Park Points",
            })
            .addTep({
                columnPrefix: "Auto Park",
                fullName: "Auto Park Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoHiveTips" }).addMatchScore({
            fromApi: (api: Api) => api.autoHiveTips,
            dataTy: Int16DTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoHivePoints" })
            .addMatchScore({
                fromSelf: (self) => self.autoHiveTips * 20,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Hive",
                columnPrefix: "Auto Hive",
                fullName: "Auto Hive Points",
            })
            .addTep({
                columnPrefix: "Auto Hive",
                fullName: "Auto Hive Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcHiveTips" }).addMatchScore({
            fromApi: (api: Api) => api.teleopHiveTips,
            dataTy: Int16DTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcHivePollenNectar" }).addMatchScore({
            fromApi: (api: Api) => api.teleopHivePollenNectar,
            dataTy: Int16DTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcHivePoints" })
            .addMatchScore({
                fromSelf: (self) => self.dcHiveTips * 20 + self.dcHivePollenNectar * 2,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Hive",
                columnPrefix: "DC Hive",
                fullName: "DC Hive Points",
            })
            .addTep({
                columnPrefix: "DC Hive",
                fullName: "DC Hive Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "redAllianceFlowerState" }).addMatchScore({
            fromApi: (api: Api) => flowerStateFromApi(api.redAllianceFlower),
            dataTy: FlowerStateDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "blueAllianceFlowerState" }).addMatchScore({
            fromApi: (api: Api) => flowerStateFromApi(api.blueAllianceFlower),
            dataTy: FlowerStateDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "scoringFlowerState" }).addMatchScore({
            fromApi: (api: Api) => flowerStateFromApi(api.scoringFlower),
            dataTy: FlowerStateDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "audienceFlowerState" }).addMatchScore({
            fromApi: (api: Api) => flowerStateFromApi(api.audienceFlower),
            dataTy: FlowerStateDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcFlowerPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.teleopFlowerPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Flower",
                columnPrefix: "DC Flower",
                fullName: "DC Flower Points",
            })
            .addTep({
                columnPrefix: "DC Flower",
                fullName: "DC Flower Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcGardenPollenNectar" }).addMatchScore({
            fromApi: (api: Api) => api.teleopGardenPollenNectar,
            dataTy: Int16DTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcGardenPoints" })
            .addMatchScore({
                fromSelf: (self) => self.dcGardenPollenNectar,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Garden",
                columnPrefix: "DC Garden",
                fullName: "DC Garden Points",
            })
            .addTep({
                columnPrefix: "DC Garden",
                fullName: "DC Garden Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcParkPoints1" })
            .addMatchScore({
                fromApi: (api: Api) => parkPoints(api.teleopRobot1Park),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "DC Park 1",
                fullName: "Robot 1 DC Park Points",
                getTitle: (ms) => formatPark(ms.dcParkPoints1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcParkPoints2" })
            .addMatchScore({
                fromApi: (api: Api) => parkPoints(api.teleopRobot2Park),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "DC Park 2",
                fullName: "Robot 2 DC Park Points",
                getTitle: (ms) => formatPark(ms.dcParkPoints2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcParkPointsIndividual" }).addTep({
            isIndividual: true,
            make: (ms, station) =>
                station == Station.One
                    ? ms.dcParkPoints1
                    : station == Station.Two
                    ? ms.dcParkPoints2
                    : 0,
            columnPrefix: "DC Park Individual",
            dialogName: "Individual",
            fullName: "DC Park Points Individual",
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcParkPoints" })
            .addMatchScore({
                fromSelf: (self) => self.dcParkPoints1 + self.dcParkPoints2,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Park Points",
                columnPrefix: "DC Park",
                fullName: "DC Park Points",
            })
            .addTep({
                columnPrefix: "DC Park",
                fullName: "DC Park Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "tips" })
            .addMatchScore({
                fromSelf: (self) => self.autoHiveTips + self.dcHiveTips,
                dataTy: Int16DTy,
            })
            // (tb2 = avg tips)
            .addTep({
                columnPrefix: "Tips",
                fullName: "Hive Tips",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "swarmRp", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => api.swarmRP,
                dataTy: BoolDTy,
            })
            .addTep({
                columnPrefix: "Swarm RP",
                fullName: "Swarm Ranking Points",
                make: (ms) => (ms.swarmRp ? 1 : 0),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "pollinator1Rp", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => api.pollinator1RP,
                dataTy: BoolDTy,
            })
            .addTep({
                columnPrefix: "Pollinator 1 RP",
                fullName: "Pollinator 1 Ranking Points",
                make: (ms) => (ms.pollinator1Rp ? 1 : 0),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "pollinator2Rp", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => api.pollinator2RP,
                dataTy: BoolDTy,
            })
            .addTep({
                columnPrefix: "Pollinator 2 RP",
                fullName: "Pollinator 2 Ranking Points",
                make: (ms) => (ms.pollinator2Rp ? 1 : 0),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.autoLeavePoints + self.autoParkPoints + self.autoHivePoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Auto Points",
                columnPrefix: "Auto",
                fullName: "Auto Points",
            })
            .addTep({
                columnPrefix: "Auto",
                fullName: "Auto Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPoints" })
            .addMatchScore({
                fromSelf: (self) =>
                    self.dcHivePoints +
                    self.dcFlowerPoints +
                    self.dcGardenPoints +
                    self.dcParkPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "DC Points",
                columnPrefix: "DC",
                fullName: "Driver-Controlled Points",
            })
            .addTep({
                columnPrefix: "DC",
                dialogName: "DC Points",
                fullName: "Driver-Controlled Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommitted" })
            .addMatchScore({
                fromApi: (api: Api) => api.minorFouls,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommitted" })
            .addMatchScore({
                fromApi: (api: Api) => api.majorFouls,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOpp" })
            .addMatchScore({
                fromApi: (_, api: Api) => api.minorFouls,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsByOpp" })
            .addMatchScore({
                fromApi: (_, api: Api) => api.majorFouls,
                dataTy: Int16DTy,
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsCommittedPoints" })
            .addScoreModal({
                displayName: "Majors Points",
                columnPrefix: "Majors",
                fullName: "Major Penalty Points Committed",
                sql: (ms) => `(${ms}.majorsCommitted * 20)`,
                getValue: (ms) => ms.majorsCommitted * 20,
                getTitle: (ms) => nOf(ms.majorsCommitted, "Major Committed", "Majors Committed"),
            })
            .addTep({
                make: (ms) => ms.majorsCommitted * 20,
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
                sql: (ms) => `(${ms}.minorsCommitted * 5)`,
                getValue: (ms) => ms.minorsCommitted * 5,
                getTitle: (ms) => nOf(ms.minorsCommitted, "Minor Committed", "Minors Committed"),
            })
            .addTep({
                make: (ms) => ms.minorsCommitted * 5,
                columnPrefix: "Minors Committed",
                dialogName: "Minors",
                fullName: "Minor Penalty Points Committed",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                fromSelf: (self) => self.majorsCommitted * 20 + self.minorsCommitted * 5,
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
                make: (ms) => ms.majorsByOpp * 20,
                columnPrefix: "Opp Majors Committed",
                dialogName: "Majors",
                fullName: "Major Penalty Points by Opponent",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOppPoints" })
            .addTep({
                make: (ms) => ms.minorsByOpp * 5,
                columnPrefix: "Opp Minors Committed",
                dialogName: "Minors",
                fullName: "Minor Penalty Points by Opponent",
            })
            .finish()
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsByOpp" })
            .addMatchScore({
                fromSelf: (self) => self.majorsByOpp * 20 + self.minorsByOpp * 5,
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
        new DescriptorColumn({ name: "totalPointsNp" })
            .addMatchScore({
                fromSelf: (self) => self.autoPoints + self.dcPoints,
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
            .addTep({
                columnPrefix: "",
                dialogName: "Total Points",
                fullName: "Total Points",
            })
    )
    .addTree([
        { val: "totalPoints", children: [] },
        { val: "totalPointsNp", children: [] },
        {
            val: "autoPoints",
            children: [
                {
                    val: "autoLeavePoints",
                    children: [
                        { val: "autoLeave1", children: [] },
                        { val: "autoLeave2", children: [] },
                        { val: "autoLeavePointsIndividual", for: "tep", children: [] },
                    ],
                },
                {
                    val: "autoParkPoints",
                    children: [
                        { val: "autoParkPoints1", children: [] },
                        { val: "autoParkPoints2", children: [] },
                        { val: "autoParkPointsIndividual", for: "tep", children: [] },
                    ],
                },
                { val: "autoHivePoints", children: [] },
            ],
        },
        {
            val: "dcPoints",
            children: [
                { val: "dcHivePoints", children: [] },
                { val: "dcFlowerPoints", children: [] },
                { val: "dcGardenPoints", children: [] },
                {
                    val: "dcParkPoints",
                    children: [
                        { val: "dcParkPoints1", children: [] },
                        { val: "dcParkPoints2", children: [] },
                        { val: "dcParkPointsIndividual", for: "tep", children: [] },
                    ],
                },
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
    .addMatchInsightCols(
        ["autoHivePoints", "dcHivePoints", "dcFlowerPoints", "dcGardenPoints"],
        ["autoHivePoints", "dcHivePoints", "dcFlowerPoints", "dcGardenPoints"]
    )
    .finish();
