import {
    AllianceScores2025TradFtcApi,
    ApiArtifactType,
} from "../../../ftc-api-types/match-scores/MatchScores2025Trad";
import { Season } from "../../Season";
import { Station } from "../../Station";
import { Descriptor, DescriptorColumn } from "../descriptor";
import { AnyDTy, BoolDTy, EnumDTy, Int16DTy } from "../types";
import { GraphQLList } from "graphql/type";

type Api = AllianceScores2025TradFtcApi;

function leavePoints(didLeave: boolean): number {
    return didLeave ? 3 : 0;
}

function formatLeave(points: number): string {
    return points ? "Left Staging Area" : "Stayed";
}

type BaseReturn = Api["robot1Teleop"];

function basePoints(returnState: BaseReturn): number {
    switch (returnState) {
        case "PARTIAL":
            return 5;
        case "FULL":
            return 10;
        default:
            return 0;
    }
}

function formatBase(points: number): string {
    switch (points) {
        case 0:
            return "Not Returned";
        case 5:
            return "Partially Returned";
        case 10:
            return "Fully Returned";
        default:
            return "";
    }
}

function baseBonus(r1: BaseReturn, r2: BaseReturn): number {
    return r1 == "FULL" && r2 == "FULL" ? 10 : 0;
}

export const ArtifactType = {
    None: "None",
    Purple: "Purple",
    Green: "Green",
} as const;
export type ArtifactType = (typeof ArtifactType)[keyof typeof ArtifactType];
const ArtifactTypeDTy = EnumDTy(ArtifactType, "ArtifactType", "artifact_type_enum");

function artifactTypeFromApi(artifactType: ApiArtifactType): ArtifactType {
    switch (artifactType) {
        case "NONE":
            return ArtifactType.None;
        case "PURPLE":
            return ArtifactType.Purple;
        case "GREEN":
            return ArtifactType.Green;
    }
}

function classifierStateFromApi(api: ApiArtifactType[]): ArtifactType[] {
    let classifier: ArtifactType[] = [];
    for (const artifact of api) {
        classifier.push(artifactTypeFromApi(artifact));
    }
    return classifier;
}

let classifierStateGQL = new GraphQLList(ArtifactTypeDTy.gql);
const ClassiferStateDTy = AnyDTy(classifierStateGQL);

export const Descriptor2025 = new Descriptor({
    season: Season.Decode,
    seasonName: "Decode",
    hasRemote: false,
    hasEndgame: false,
    pensSubtract: false,
    rankings: {
        rp: "DecodeRP",
        tb: "AvgNpBase",
    },
    firstDate: new Date("2025-09-06"),
    lastDate: new Date("2026-09-01"),
    kickoff: new Date("2025-09-06"),
})
    .addColumn(
        new DescriptorColumn({ name: "autoLeavePoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoLeavePoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Leave Points",
                columnPrefix: "Auto Leave",
                fullName: "Auto Leave Points",
            })
            .addTep({
                columnPrefix: "Auto Leave",
                dialogName: "Leave Points",
                fullName: "Auto Leave Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoLeave1" })
            .addMatchScore({
                fromApi: (api: Api) => leavePoints(api.robot1Auto),
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
                fromApi: (api: Api) => leavePoints(api.robot2Auto),
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
        new DescriptorColumn({ name: "autoArtifactPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoArtifactPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Artifacts",
                columnPrefix: "Auto Artifact",
                fullName: "Auto Artifact Points",
            })
            .addTep({
                columnPrefix: "Auto Artifact",
                fullName: "Auto Artifact Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoArtifactClassifiedPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoClassifiedArtifacts * 3,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Classified",
                columnPrefix: "Auto Artifact Classified",
                fullName: "Auto Classified Artifact Points",
            })
            .addTep({
                columnPrefix: "Auto Artifact Classified",
                fullName: "Auto Classified Artifact Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoArtifactOverflowPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoOverflowArtifacts * 1,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Overflow",
                columnPrefix: "Auto Artifact Overflow",
                fullName: "Auto Overflow Artifact Points",
            })
            .addTep({
                columnPrefix: "Auto Artifact Overflow",
                fullName: "Auto Overflow Artifact Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPatternPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoPatternPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Pattern",
                columnPrefix: "Auto Pattern",
                fullName: "Auto Pattern Points",
            })
            .addTep({
                columnPrefix: "Auto Pattern",
                fullName: "Auto Pattern Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoClassifierState" }).addMatchScore({
            fromApi: (api: Api) => classifierStateFromApi(api.autoClassifierState),
            dataTy: ClassiferStateDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBasePoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.teleopBasePoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Base Points",
                columnPrefix: "DC Base",
                fullName: "DC Base Points",
            })
            .addTep({
                columnPrefix: "DC Base",
                fullName: "DC Base Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBase1" })
            .addMatchScore({
                fromApi: (api: Api) => basePoints(api.robot1Teleop),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 1",
                columnPrefix: "DC Base 1",
                fullName: "Robot 1 Base Points",
                getTitle: (ms) => formatBase(ms.dcBase1),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBase2" })
            .addMatchScore({
                fromApi: (api: Api) => basePoints(api.robot2Teleop),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Robot 2",
                columnPrefix: "DC Base 2",
                fullName: "Robot 2 Base Points",
                getTitle: (ms) => formatBase(ms.dcBase2),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBaseBonus" })
            .addMatchScore({
                fromApi: (api: Api) => baseBonus(api.robot1Teleop, api.robot2Teleop),
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Bonus",
                columnPrefix: "DC Base Bonus",
                fullName: "DC Base Bonus Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcBasePointsIndividual" }).addTep({
            isIndividual: true,
            make: (ms, station) =>
                station == Station.One ? ms.dcBase1 : station == Station.Two ? ms.dcBase2 : 0,
            columnPrefix: "DC Base Individual",
            dialogName: "Individual",
            fullName: "DC Base Points Individual",
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcArtifactPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.teleopArtifactPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Artifacts",
                columnPrefix: "DC Artifact",
                fullName: "DC Artifact Points",
            })
            .addTep({
                columnPrefix: "DC Artifact",
                fullName: "DC Artifact Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcArtifactClassifiedPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.teleopClassifiedArtifacts * 3,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Classified",
                columnPrefix: "DC Artifact Classified",
                fullName: "DC Classified Artifact Points",
            })
            .addTep({
                columnPrefix: "DC Artifact Classified",
                fullName: "DC Classified Artifact Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcArtifactOverflowPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.teleopOverflowArtifacts * 1,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Overflow",
                columnPrefix: "DC Artifact Overflow",
                fullName: "DC Overflow Artifact Points",
            })
            .addTep({
                columnPrefix: "DC Artifact Overflow",
                fullName: "DC Overflow Artifact Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcPatternPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.teleopPatternPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Pattern",
                columnPrefix: "DC Pattern",
                fullName: "DC Pattern Points",
            })
            .addTep({
                columnPrefix: "DC Pattern",
                fullName: "DC Pattern Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcDepotPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.teleopDepotPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Depot",
                columnPrefix: "DC Depot",
                fullName: "DC Depot Points",
            })
            .addTep({
                columnPrefix: "DC Depot",
                fullName: "DC Depot Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "dcClassifierState" }).addMatchScore({
            fromApi: (api: Api) => classifierStateFromApi(api.teleopClassifierState),
            dataTy: ClassiferStateDTy,
        })
    )
    .addColumn(
        new DescriptorColumn({ name: "movementRp", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => api.movementRP,
                dataTy: BoolDTy,
            })
            .addTep({
                columnPrefix: "Movement RP",
                fullName: "Movement Ranking Points",
                make: (ms) => (ms.movementRp ? 1 : 0),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "goalRp", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => api.goalRP,
                dataTy: BoolDTy,
            })
            .addTep({
                columnPrefix: "Goal RP",
                fullName: "Goal Ranking Points",
                make: (ms) => (ms.goalRp ? 1 : 0),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "patternRp", tradOnly: true })
            .addMatchScore({
                fromApi: (api: Api) => api.patternRP,
                dataTy: BoolDTy,
            })
            .addTep({
                columnPrefix: "Pattern RP",
                fullName: "Pattern Ranking Points",
                make: (ms) => (ms.patternRp ? 1 : 0),
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "autoPoints" })
            .addMatchScore({
                fromApi: (api: Api) => api.autoPoints,
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
                fromApi: (api: Api) => api.teleopPoints,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "DC Points",
                columnPrefix: "DC",
                fullName: "Driver-Controlled Points",
            })
            .addTep({
                columnPrefix: "Teleop",
                dialogName: "Teleop Points",
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
            .addMatchScore({
                fromSelf: (self) => self.majorsCommitted * 15,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Majors",
                columnPrefix: "Penalty Majors",
                fullName: "Major Penalty Points",
            })
            .addTep({
                columnPrefix: "Majors",
                dialogName: "Majors",
                fullName: "Major Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsCommittedPoints" })
            .addMatchScore({
                fromSelf: (self) => self.minorsCommitted * 5,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Minors",
                columnPrefix: "Penalty Minors",
                fullName: "Minor Penalty Points",
            })
            .addTep({
                columnPrefix: "Minors",
                dialogName: "Minors",
                fullName: "Minor Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "majorsByOppPoints" })
            .addMatchScore({
                fromSelf: (self) => self.majorsByOpp * 15,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Opp Majors",
                columnPrefix: "Opp Major Penalties",
                fullName: "Opponent Major Penalty Points",
            })
            .addTep({
                columnPrefix: "Opp Majors",
                dialogName: "Majors",
                fullName: "Opponent Major Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "minorsByOppPoints" })
            .addMatchScore({
                fromSelf: (self) => self.minorsByOpp * 5,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Opp Minors",
                columnPrefix: "Opp Minor Penalties",
                fullName: "Opponent Minor Penalty Points",
            })
            .addTep({
                columnPrefix: "Opp Minors",
                dialogName: "Minors",
                fullName: "Opponent Minor Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsCommitted" })
            .addMatchScore({
                fromSelf: (self) => self.majorsCommitted * 15 + self.minorsCommitted * 5,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Penalty Points",
                columnPrefix: "Penalty Points",
                fullName: "Penalty Points",
            })
            .addTep({
                columnPrefix: "Penalty Points",
                dialogName: "Penalty Points",
                fullName: "Penalty Points",
            })
    )
    .addColumn(
        new DescriptorColumn({ name: "penaltyPointsByOpp" })
            .addMatchScore({
                fromSelf: (self) => self.majorsByOpp * 15 + self.minorsByOpp * 5,
                dataTy: Int16DTy,
            })
            .addScoreModal({
                displayName: "Opp Penalties",
                columnPrefix: "Opp Penalty Points",
                fullName: "Penalty Points By Opponent",
            })
            .addTep({
                columnPrefix: "Opp Penalty Points",
                dialogName: "Opp Penalty Points",
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
                    val: "autoArtifactPoints",
                    children: [
                        { val: "autoArtifactClassifiedPoints", children: [] },
                        { val: "autoArtifactOverflowPoints", children: [] },
                    ],
                },
                { val: "autoPatternPoints", children: [] },
            ],
        },
        {
            val: "dcPoints",
            children: [
                {
                    val: "dcBasePoints",
                    children: [
                        { val: "dcBase1", children: [] },
                        { val: "dcBase2", children: [] },
                        { val: "dcBaseBonus", children: [] },
                        { val: "dcBasePointsIndividual", for: "tep", children: [] },
                    ],
                },
                {
                    val: "dcArtifactPoints",
                    children: [
                        { val: "dcArtifactClassifiedPoints", children: [] },
                        { val: "dcArtifactOverflowPoints", children: [] },
                    ],
                },
                { val: "dcPatternPoints", children: [] },
                { val: "dcDepotPoints", children: [] },
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
                { val: "majorsByOppPoints", children: [] },
                { val: "minorsByOppPoints", children: [] },
            ],
        },
    ])
    .addMatchInsightCols(
        [
            "autoArtifactPoints",
            "autoPatternPoints",
            "dcArtifactPoints",
            "dcPatternPoints",
            "dcBasePoints",
        ],
        [
            "autoArtifactPoints",
            "autoPatternPoints",
            "dcArtifactPoints",
            "dcPatternPoints",
            "dcBasePoints",
        ]
    )
    .finish();
