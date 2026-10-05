import { AwardType } from "../Award";

export interface AdvancementPointsConfig {
    season: number;

    calculateQualPoints: (rank: number, teamCount: number) => number;

    calculateAllianceSelectionPoints: (position: number) => number;

    getPlayoffPoints: (placement: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8) => number;

    getDivisionPlayoffPoints: (placement: 2 | 3 | 4 | 5 | 6 | 7 | 8) => number;

    getAwardPoints: (awardType: AwardType, placement: 1 | 2 | 3) => number;

    tieBreakKeys?: AdvancementTiebreakKey[];

    maxQualEvents: number;
}

export enum AdvancementTiebreakKey {
    TotalAdvancementPoints = "totalPoints",
    JudgedAwardPoints = "awardPoints",
    PlayoffAdvancementPoints = "playoffPoints",
    AllianceSelectionPoints = "allianceSelectionPoints",
    QualificationPhasePoints = "qualPoints",
    AverageMatchPointsNp = "averageNPMatchPoints",
    AverageAutoPoints = "averageAutoPoints",
    MaxMatchPointsNp = "highestNPMatchPoints",
    SecondMatchPointsNp = "secondHighestNPMatchPoints",
}
