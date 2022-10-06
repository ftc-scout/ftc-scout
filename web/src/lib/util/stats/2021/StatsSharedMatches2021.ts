import {
    Match2021FieldName,
    MatchGroup,
    Station,
    type MatchScores2021Remote,
    type MatchScores2021TraditionalAlliance,
} from "../../../graphql/generated/graphql-operations";
import { DisplayWhen, makeStat, makeStatMaybe, type Stat } from "../Stat";
import { StatColor } from "../stat-color";
import { StatDisplayType } from "../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../StatSet";

export type FullScores2021Shared = MatchScores2021TraditionalAlliance | MatchScores2021Remote;

const TOTAL_POINTS_STAT: Stat<FullScores2021Shared> = makeStat(
    "totalPoints",
    "Total Points",
    "Total",
    "Total Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.TotalPoints,
    null
);

const TOTAL_POINTS_NP_STAT: Stat<FullScores2021Shared> = makeStat(
    "totalPointsNp",
    "Total Points No Penalties",
    "Total NP",
    "Total Points No Penalties",
    DisplayWhen.ALWAYS,
    Match2021FieldName.TotalPointsNp,
    null
);

// ------------------------------------------------------------------------------------------------------------------------

const AUTO_POINTS_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoPoints",
    "Auto Points",
    "Auto",
    "Auto Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoPoints
);

const AUTO_FREIGHT_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoFreightPoints",
    "Auto Freight Points",
    "Auto Freight",
    "Auto Freight Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoFreightPoints
);

const AUTO_FREIGHT1_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoFreight1",
    "Level 1 Freight",
    "Auto Freight 1",
    "Auto Freight Level 1",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoFreightPointsLevel_1
);

const AUTO_FREIGHT2_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoFreight2",
    "Level 2 Freight",
    "Auto Freight 2",
    "Auto Freight Level 2",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoFreightPointsLevel_2
);

const AUTO_FREIGHT3_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoFreight3",
    "Level 3 Freight",
    "Auto Freight 3",
    "Auto Freight Level 3",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoFreightPointsLevel_3
);

const AUTO_FREIGHT_STORAGE_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoStorageFreight",
    "Storage Freight",
    "Auto Storage",
    "Auto Freight Storage",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoFreightPointsLevel_3
);

const AUTO_CAROUSEL_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoCarouselPoints",
    "Auto Carousel Points",
    "Auto Carousel",
    "Auto Carousel Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoCarouselPoints
);

const AUTO_NAV_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoNavigationPoints
);

const AUTO_BONUS_STAT: Stat<FullScores2021Shared> = makeStat(
    "autoBonusPoints",
    "Auto Bonus Points",
    "Bonus",
    "Auto Bonus Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AutoBonusPoints
);

// ------------------------------------------------------------------------------------------------------------------------

const DC_POINTS_STAT: Stat<FullScores2021Shared> = makeStat(
    "driverControlledPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.DriverControlledPoints
);

const DC_ALLIANCE_STAT: Stat<FullScores2021Shared> = makeStat(
    "driverControlledAllianceHubPoints",
    "Alliance Hub Points",
    "Hub",
    "Driver Controlled Alliance Hub Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.DriverControlledAllianceHubPoints
);

//TODO
const DC_ALLIANCE1_STAT: Stat<FullScores2021Shared> = makeStat(
    "driverControlledFreight1",
    "Level 1 Freight",
    "Hub 1",
    "Driver Controlled Alliance Hub Level 1 Freight",
    DisplayWhen.ALWAYS,
    Match2021FieldName.DriverControlledAllianceHubPointsLevel_1
);

//TODO
const DC_ALLIANCE2_STAT: Stat<FullScores2021Shared> = makeStat(
    "driverControlledFreight2",
    "Level 2 Freight",
    "Hub 2",
    "Driver Controlled Alliance Hub Level 2 Freight",
    DisplayWhen.ALWAYS,
    Match2021FieldName.DriverControlledAllianceHubPointsLevel_2
);

//TODO
const DC_ALLIANCE3_STAT: Stat<FullScores2021Shared> = makeStat(
    "driverControlledFreight3",
    "Level 3 Freight",
    "Hub 3",
    "Driver Controlled Alliance Hub Level 3 Freight",
    DisplayWhen.ALWAYS,
    Match2021FieldName.DriverControlledAllianceHubPointsLevel_3
);

//TODO
export const DC_STORAGE_STAT: Stat<FullScores2021Shared> = makeStat(
    "driverControlledStoragePoints",
    "Storage Freight",
    "Storage",
    "Driver Controlled Storage Freight",
    DisplayWhen.ALWAYS,
    Match2021FieldName.DriverControlledStoragePoints
);

const DC_SHARED_STAT: Stat<FullScores2021Shared> = makeStatMaybe(
    "driverControlledSharedHubPoints",
    "Shared Hub Points",
    "Shared",
    "Driver Controlled Shared Hub Points",
    DisplayWhen.TRAD,
    Match2021FieldName.DriverControlledSharedHubPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_POINTS_STAT: Stat<FullScores2021Shared> = makeStat(
    "endgamePoints",
    "Endgame Points",
    "Endgame",
    "Endgame Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.EndgamePoints
);

export const ENDGAME_DELIVERY_STAT: Stat<FullScores2021Shared> = makeStat(
    "endgameDeliveryPoints",
    "Delivery Points",
    "Delivery",
    "Endgame Delivery Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.EndgameDeliveryPoints
);

export const ENDGAME_CAPPING_STAT: Stat<FullScores2021Shared> = makeStat(
    "cappingPoints",
    "Capping Points",
    "Capping",
    "Endgame Capping Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.CappingPoints
);

export const ENDGAME_PARKING_STAT: Stat<FullScores2021Shared> = makeStat(
    "endgameParkingPoints",
    "Parking Points",
    "Endgame Park",
    "Endgame Parking Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.EndgameParkingPoints
);

export const ENDGAME_BALANCED_STAT: Stat<FullScores2021Shared> = makeStat(
    "allianceBalancedPoints",
    "Hub Balanced Points",
    "Hub Balanced",
    "Endgame Alliance Hub Balanced Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.AllianceBalancedPoints
);

const ENDGAME_TIPPED_STAT: Stat<FullScores2021Shared> = makeStatMaybe(
    "sharedUnbalancedPoints",
    "Shared Tipped Points",
    "Shared Tipped ",
    "Endgame Shared Hub Tipped Points",
    DisplayWhen.TRAD,
    Match2021FieldName.SharedUnbalancedPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<FullScores2021Shared> = makeStat(
    "penaltyPoints",
    "Penalty Points",
    "Penalties",
    "Penalty Points",
    DisplayWhen.ALWAYS,
    Match2021FieldName.PenaltyPoints
);

// TODO
export const PENALTIES_MAJOR_STAT: Stat<FullScores2021Shared> = makeStat(
    "majorPenalties",
    "Major Penalties",
    "Majors",
    "Major Penalties",
    DisplayWhen.ALWAYS,
    Match2021FieldName.MajorPenaltyPoints
);

// TODO
export const PENALTIES_MINOR_STAT: Stat<FullScores2021Shared> = makeStat(
    "minorPenalties",
    "Minor Penalties",
    "Minors",
    "Minor Penalties",
    DisplayWhen.ALWAYS,
    Match2021FieldName.MinorPenaltyPoints
);

// ------------------------------------------------------------------------------------------------------------------------

type TeamsT =
    | {
          teams: {
              station: Station;
              team: {
                  number: number;
                  name: string;
              };
          }[];
      }
    | {
          team: {
              team: {
                  number: number;
                  name: string;
              };
          };
      };

function extractTeam(data: TeamsT, num: 1 | 2 | 3): { number: number; name: string } | null {
    if ("team" in data) {
        if (num == 1) return data.team.team;
        return null;
    } else {
        switch (num) {
            case 1:
                return data.teams.find((t) => t.station == Station.Blue_1 || t.station == Station.Red_1)?.team ?? null;
            case 2:
                return data.teams.find((t) => t.station == Station.Blue_2 || t.station == Station.Red_2)?.team ?? null;
            case 3:
                return data.teams.find((t) => t.station == Station.Blue_3 || t.station == Station.Red_3)?.team ?? null;
        }
    }
}

export const TEAM_1: Stat<TeamsT> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 1",
    columnName: "Team 1",
    identifierName: "Team 1",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 1),
    apiField: { fieldName: Match2021FieldName.Team1Number },
};

export const TEAM_2: Stat<TeamsT> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 2",
    columnName: "Team 2",
    identifierName: "Team 2",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 2),
    apiField: { fieldName: Match2021FieldName.Team2Number },
};

export const TEAM_3: Stat<TeamsT> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team 3",
    columnName: "Team 3",
    identifierName: "Team 3",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => extractTeam(s.data, 3),
    apiField: { fieldName: Match2021FieldName.Team3Number },
};

export let STAT_SET_MATCHES_2021_SHARED: StatSet<FullScores2021Shared, FullScores2021Shared> = [
    {
        name: "Match Scores",
        type: "group",
        set: {
            groups: [
                {
                    longName: "This",
                    shortName: "THIS",
                    description: "Points scored by the alliance the row is about.",
                    color: StatColor.RED,
                    get: (s) =>
                        groupGetter((t) => ({ ...t, data: t.data }), s, StatColor.RED, "", "", "", MatchGroup.This),
                },
            ],

            groupStats: [
                {
                    stat: TOTAL_POINTS_STAT,
                    nestedStats: [],
                },
                {
                    stat: TOTAL_POINTS_NP_STAT,
                    nestedStats: [],
                },
                {
                    stat: AUTO_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: AUTO_FREIGHT_STAT,
                            nestedStats: [
                                {
                                    stat: AUTO_FREIGHT1_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_FREIGHT2_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_FREIGHT3_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_FREIGHT_STORAGE_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: AUTO_CAROUSEL_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_NAV_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_BONUS_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: DC_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: DC_ALLIANCE_STAT,
                            nestedStats: [
                                {
                                    stat: DC_ALLIANCE1_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: DC_ALLIANCE2_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: DC_ALLIANCE3_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: DC_STORAGE_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_SHARED_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: ENDGAME_POINTS_STAT,
                    nestedStats: [
                        {
                            stat: ENDGAME_DELIVERY_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_CAPPING_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_BALANCED_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_TIPPED_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_PARKING_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: PENALTIES_STAT,
                    nestedStats: [
                        {
                            stat: PENALTIES_MAJOR_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: PENALTIES_MINOR_STAT,
                            nestedStats: [],
                        },
                    ],
                },
            ],
        },
    },
    {
        name: "Match Info",
        type: "group",
        set: {
            groups: [
                {
                    longName: "This",
                    shortName: "THIS",
                    description: "Teams on the alliance the row is about.",
                    color: StatColor.RED,
                    get: (s) =>
                        groupGetter((t) => ({ ...t, data: t.data }), s, StatColor.WHITE, "", "", "", MatchGroup.This),
                },
            ],

            groupStats: [
                {
                    stat: TEAM_1,
                    nestedStats: [],
                },
                {
                    stat: TEAM_2,
                    nestedStats: [],
                },
                {
                    stat: TEAM_3,
                    nestedStats: [],
                },
            ],
        },
    },
];

const SCORES = STAT_SET_MATCHES_2021_SHARED.find((s) => s.name == "Match Scores")!.set as StatSetGroup<
    FullScores2021Shared,
    FullScores2021Shared
>;
const THIS = SCORES.groups.find((g) => g.shortName == "THIS")!;

export const THIS_TOTAL_POINTS_STAT = THIS.get(TOTAL_POINTS_STAT);
export const THIS_AUTO_POINTS_STAT = THIS.get(AUTO_POINTS_STAT);
export const THIS_DC_POINTS_STAT = THIS.get(DC_POINTS_STAT);
export const THIS_ENDGAME_POINTS_STAT = THIS.get(ENDGAME_POINTS_STAT);
export const THIS_AUTO_FREIGHT_STAT = THIS.get(AUTO_FREIGHT_STAT);
export const THIS_DC_ALLIANCE_3_STAT = THIS.get(DC_ALLIANCE3_STAT);
export const THIS_DC_SHARED_STAT = THIS.get(DC_SHARED_STAT);
export const THIS_END_SHARED_STAT = THIS.get(ENDGAME_TIPPED_STAT);
export const THIS_END_DELIVERED_STAT = THIS.get(ENDGAME_DELIVERY_STAT);
export const THIS_END_CAPPED_STAT = THIS.get(ENDGAME_CAPPING_STAT);
