import { DisplayWhen, makeStat, makeStatMaybe, type Stat } from "../Stat";
import { StatColor } from "../stat-color";
import { StatDisplayType } from "../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../StatSet";
import {
    Tep2021FieldName,
    Tep2021Group,
    type FullStatsGroup2021TradFragment,
} from "$lib/graphql/generated/graphql-operations";
import type { FullStatsGroup2021RemoteFragment } from "../../../graphql/generated/graphql-operations";

export type FullTep2021Traditional = {
    team: {
        number: number;
        name: string;
    };
    stats: {
        __typename?: "TeamEventStats2021Traditional";
        rank: number;
        rp: number;
        tb1: number;
        tb2: number;
        wins: number;
        losses: number;
        ties: number;
        dqs: number;
        qualMatchesPlayed: number;
        total: FullStatsGroup2021TradFragment;
        average: FullStatsGroup2021TradFragment;
        opr: FullStatsGroup2021TradFragment;
        min: FullStatsGroup2021TradFragment;
        max: FullStatsGroup2021TradFragment;
        standardDev: FullStatsGroup2021TradFragment;
    };
};

export type FullTep2021Remote = {
    team: {
        number: number;
        name: string;
    };
    stats: {
        __typename?: "TeamEventStats2021Traditional";
        rank: number;
        rp: number;
        tb1: number;
        tb2: number;
        qualMatchesPlayed: number;
        total: FullStatsGroup2021RemoteFragment;
        average: FullStatsGroup2021RemoteFragment;
        opr: FullStatsGroup2021RemoteFragment;
        min: FullStatsGroup2021RemoteFragment;
        max: FullStatsGroup2021RemoteFragment;
        standardDev: FullStatsGroup2021RemoteFragment;
    };
};

export type FullTep2021Shared = FullTep2021Traditional | FullTep2021Remote;

export const TEAM_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team",
    columnName: "Team",
    identifierName: "Team",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.team,
    apiField: { fieldName: Tep2021FieldName.TeamNumber },
};

export const RP_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.RED,
    displayType: StatDisplayType.INTEGER,
    listName: "Ranking Points (RP)",
    columnName: "RP",
    identifierName: "Ranking Points (RP)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.rp,
    apiField: { fieldName: Tep2021FieldName.Rp },
};

export const EVENT_RANK_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.RANK,
    listName: "Ranking",
    columnName: "Rank",
    identifierName: "Event Ranking",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.rank,
    apiField: { fieldName: Tep2021FieldName.Rank },
};

export const TBP_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.LIGHT_BLUE,
    displayType: StatDisplayType.INTEGER,
    listName: "Tie Breaker Points (TBP)",
    columnName: "TBP",
    identifierName: "Tie Breaker Points (TBP)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.tb1,
    apiField: { fieldName: Tep2021FieldName.Tb1 },
};

export const TBP2_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.BLUE,
    displayType: StatDisplayType.INTEGER,
    listName: "Tie Breaker Points 2 (TBP2)",
    columnName: "TBP2",
    identifierName: "Tie Breaker Points 2 (TBP2)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.tb2,
    apiField: { fieldName: Tep2021FieldName.Tb2 },
};

export const PLAYED_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Matches Played",
    columnName: "Played",
    identifierName: "Qual Matches Played",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.qualMatchesPlayed,
    apiField: { fieldName: Tep2021FieldName.QualMatchesPlayed },
};

type Group = FullTep2021Shared["stats"]["total"];

export const TOTAL_STAT: Stat<Group> = makeStat(
    "totalPoints",
    "Total Points",
    "",
    "Total Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.TotalPoints
);
export const TOTAL_NP_STAT: Stat<Group> = makeStat(
    "totalPointsNp",
    "Total Points No Penalties",
    "np",
    "Total Points No Penalties",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.TotalPointsNp
);

// ------------------------------------------------------------------------------------------------------------------------

export const AUTO_STAT: Stat<Group> = makeStat(
    "autoPoints",
    "Auto Points",
    "Auto",
    "Auto Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoPoints
);

export const AUTO_FREIGHT_STAT: Stat<Group> = makeStat(
    "autoFreightPoints",
    "Auto Freight Points",
    "Auto Freight",
    "Auto Freight Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoFreightPoints
);
export const AUTO_FREIGHT1_STAT: Stat<Group> = makeStat(
    "autoFreightPointsLevel1",
    "Level 1",
    "Auto Freight 1",
    "Auto Freight Points Level 1",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoFreightPointsLevel_1
);
export const AUTO_FREIGHT2_STAT: Stat<Group> = makeStat(
    "autoFreightPointsLevel2",
    "Level 2",
    "Auto Freight 2",
    "Auto Freight Points Level 2",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoFreightPointsLevel_2
);
export const AUTO_FREIGHT3_STAT: Stat<Group> = makeStat(
    "autoFreightPointsLevel3",
    "Level 3",
    "Auto Freight 3",
    "Auto Freight Points Level 3",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoFreightPointsLevel_3
);
export const AUTO_FREIGHT_STORAGE_STAT: Stat<Group> = makeStat(
    "autoFreightPointsStorage",
    "Storage",
    "Auto Storage",
    "Auto Freight Points Storage",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoFreightPointsStorage
);

export const AUTO_CAROUSEL_STAT: Stat<Group> = makeStat(
    "autoCarouselPoints",
    "Auto Carousel Points",
    "Auto Carousel",
    "Auto Carousel Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoCarouselPoints
);

export const AUTO_NAV_STAT: Stat<Group> = makeStat(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoNavigationPoints
);

export const AUTO_BONUS_STAT: Stat<Group> = makeStat(
    "autoBonusPoints",
    "Auto Bonus Points",
    "Bonus",
    "Auto Bonus Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoBonusPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const DC_STAT: Stat<Group> = makeStat(
    "driverControlledPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.DriverControlledPoints
);

export const DC_ALLIANCE_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPoints",
    "Alliance Hub Points",
    "Hub",
    "Driver Controlled Alliance Hub Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.DriverControlledAllianceHubPoints
);
export const DC_ALLIANCE1_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPointsLevel1",
    "Level 1",
    "Hub 1",
    "Driver Controlled Alliance Hub Level 1 Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.DriverControlledAllianceHubPointsLevel_1
);
export const DC_ALLIANCE2_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPointsLevel2",
    "Level 2",
    "Hub 2",
    "Driver Controlled Alliance Hub Level 2 Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.DriverControlledAllianceHubPointsLevel_2
);
export const DC_ALLIANCE3_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPointsLevel3",
    "Level 3",
    "Hub 3",
    "Driver Controlled Alliance Hub Level 3 Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.DriverControlledAllianceHubPointsLevel_3
);

export const DC_STORAGE_STAT: Stat<Group> = makeStat(
    "driverControlledStoragePoints",
    "Storage Points",
    "Storage",
    "Driver Controlled Storage Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.DriverControlledStoragePoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_STAT: Stat<Group> = makeStat(
    "endgamePoints",
    "Endgame Points",
    "Endgame",
    "Endgame Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.EndgamePoints
);

export const ENDGAME_DELIVERY_STAT: Stat<Group> = makeStat(
    "endgameDeliveryPoints",
    "Delivery Points",
    "Delivery",
    "Endgame Delivery Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.EndgameDeliveryPoints
);

export const ENDGAME_CAPPING_STAT: Stat<Group> = makeStat(
    "cappingPoints",
    "Capping Points",
    "Capping",
    "Endgame Capping Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.CappingPoints
);

export const ENDGAME_PARKING_STAT: Stat<Group> = makeStat(
    "endgameParkingPoints",
    "Parking Points",
    "Endgame Park",
    "Endgame Parking Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.EndgameParkingPoints
);

export const ENDGAME_BALANCED_STAT: Stat<Group> = makeStat(
    "allianceBalancedPoints",
    "Hub Balanced Points",
    "Hub Balanced",
    "Endgame Alliance Hub Balanced Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AllianceBalancedPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<Group> = makeStat(
    "penaltyPoints",
    "Penalty Points",
    "Penalties",
    "Penalty Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.PenaltyPoints
);

export const PENALTIES_MAJOR_STAT: Stat<Group> = makeStat(
    "majorPenaltyPoints",
    "Major Penalty Points",
    "Majors",
    "Major Penalty Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.MajorPenaltyPoints
);

export const PENALTIES_MINOR_STAT: Stat<Group> = makeStat(
    "minorPenaltyPoints",
    "Minor Penalty Points",
    "Minors",
    "Minor Penalty Points",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.MinorPenaltyPoints
);

export const ENDGAME_PARKING_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "endgameParkingPointsIndividual",
    "Individual",
    "Endgame Park Individual",
    "Endgame Parking Points Individual",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.EndgameParkingPointsIndividual
);

// ------------------------------------------------------------------------------------------------------------------------

// Individual stats
export const AUTO_NAV_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "autoNavigationPointsIndividual",
    "Individual",
    "Auto Nav Individual",
    "Auto Navigation Points Individual",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoNavigationPointsIndividual
);

export const AUTO_BONUS_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "autoBonusPointsIndividual",
    "Individual",
    "Bonus Individual",
    "Auto Bonus Points Individual",
    DisplayWhen.ALWAYS,
    Tep2021FieldName.AutoBonusPointsIndividual
);

// Trad Only --------------------------------------------------------------------------------------------------------------

export const WINS_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Wins",
    columnName: "Wins",
    identifierName: "Wins",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("wins" in s.data.stats ? s.data.stats.wins : null),
    apiField: { fieldName: Tep2021FieldName.Wins },
};

export const lOSSES_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Losses",
    columnName: "Losses",
    identifierName: "Losses",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("losses" in s.data.stats ? s.data.stats.losses : null),
    apiField: { fieldName: Tep2021FieldName.Losses },
};

export const TIES_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Ties",
    columnName: "Ties",
    identifierName: "Ties",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("ties" in s.data.stats ? s.data.stats.ties : null),
    apiField: { fieldName: Tep2021FieldName.Ties },
};

export const RECORD_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.RECORD,
    listName: "Record",
    columnName: "Record",
    identifierName: "Event Record",
    displayWhen: DisplayWhen.TRAD,
    read: (s) =>
        "wins" in s.data.stats
            ? { wins: s.data.stats.wins, losses: s.data.stats.losses, ties: s.data.stats.ties }
            : null,
    apiField: { fieldName: Tep2021FieldName.Wins },
};

export const DQ_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Disqualifications (DQs)",
    columnName: "DQs",
    identifierName: "Disqualifications (DQs)",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("dqs" in s.data.stats ? s.data.stats.dqs : null),
    apiField: { fieldName: Tep2021FieldName.Dq },
};

// ------------------------------------------------------------------------------------------------------------------------

const DC_SHARED_STAT: Stat<Group> = makeStatMaybe(
    "driverControlledSharedHubPoints",
    "Shared Hub Points",
    "Shared",
    "Driver Controlled Shared Hub Points",
    DisplayWhen.TRAD,
    Tep2021FieldName.DriverControlledSharedHubPoints
);

// ------------------------------------------------------------------------------------------------------------------------

const ENDGAME_TIPPED_STAT: Stat<Group> = makeStatMaybe(
    "sharedUnbalancedPoints",
    "Shared Tipped Points",
    "Shared Tipped ",
    "Endgame Shared Hub Tipped Points",
    DisplayWhen.TRAD,
    Tep2021FieldName.SharedUnbalancedPoints
);

export let STAT_SET_TEAMS_2021_SHARED: StatSet<FullTep2021Traditional, Group> = [
    {
        name: "Team's Event Performance",
        type: "standalone",
        set: {
            standalone: [
                TEAM_STAT,
                EVENT_RANK_STAT,
                RP_STAT,
                TBP_STAT,
                TBP2_STAT,
                PLAYED_STAT,
                WINS_STAT,
                lOSSES_STAT,
                TIES_STAT,
                RECORD_STAT,
                DQ_STAT,
            ],
        },
    },
    {
        name: "Match Scores",
        type: "group",
        set: {
            groups: [
                {
                    longName: "Total",
                    shortName: "TOT",
                    description: "The sum of all points scored in the category.",
                    color: StatColor.RED,
                    get: (s) =>
                        groupGetter(
                            (t) => ({ ...t, data: t.data.stats.total }),
                            s,
                            StatColor.RED,
                            "TOT",
                            "Total",
                            "Total",
                            Tep2021Group.Total
                        ),
                },
                {
                    longName: "Average",
                    shortName: "AVG",
                    description: "The average number of points scored in the category.",
                    color: StatColor.PURPLE,
                    get: (s) =>
                        groupGetter(
                            (t) => ({ ...t, data: t.data.stats.average }),
                            s,
                            StatColor.PURPLE,
                            "AVG",
                            "Average",
                            "Average",
                            Tep2021Group.Avg,
                            StatDisplayType.DECIMAL
                        ),
                },
                {
                    longName: "OPR",
                    shortName: "OPR",
                    description: "Offensive Power Rating.",
                    color: StatColor.PURPLE,
                    get: (s) =>
                        groupGetter(
                            (t) => ({ ...t, data: t.data.stats.opr }),
                            s,
                            StatColor.PURPLE,
                            "OPR",
                            "OPR",
                            "OPR",
                            Tep2021Group.Opr,
                            StatDisplayType.DECIMAL
                        ),
                },
                {
                    longName: "Minimum",
                    shortName: "MIN",
                    description: "The lowest number of points scored in the category.",
                    color: StatColor.LIGHT_BLUE,
                    get: (s) =>
                        groupGetter(
                            (t) => ({ ...t, data: t.data.stats.min }),
                            s,
                            StatColor.LIGHT_BLUE,
                            "MIN",
                            "Minimum",
                            "Minimum",
                            Tep2021Group.Min
                        ),
                },
                {
                    longName: "Maximum",
                    shortName: "MAX",
                    description: "The highest number of points scored in the category.",
                    color: StatColor.BLUE,
                    get: (s) =>
                        groupGetter(
                            (t) => ({ ...t, data: t.data.stats.max }),
                            s,
                            StatColor.BLUE,
                            "MAX",
                            "Maximum",
                            "Maximum",
                            Tep2021Group.Max
                        ),
                },
                {
                    longName: "Std. Dev.",
                    shortName: "DEV",
                    description: "The standard deviation of scores in the category.",
                    color: StatColor.GREEN,
                    get: (s) =>
                        groupGetter(
                            (t) => ({ ...t, data: t.data.stats.standardDev }),
                            s,
                            StatColor.GREEN,
                            "DEV",
                            "Std. Dev.",
                            "Standard Deviation",
                            Tep2021Group.Dev,
                            StatDisplayType.DECIMAL
                        ),
                },
            ],
            groupStats: [
                {
                    stat: TOTAL_STAT,
                    nestedStats: [],
                },
                {
                    stat: TOTAL_NP_STAT,
                    nestedStats: [],
                },
                {
                    stat: AUTO_STAT,
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
                            nestedStats: [
                                {
                                    stat: AUTO_NAV_INDIVIDUAL_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: AUTO_BONUS_STAT,
                            nestedStats: [
                                {
                                    stat: AUTO_BONUS_INDIVIDUAL_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                    ],
                },
                {
                    stat: DC_STAT,
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
                            stat: DC_SHARED_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_STORAGE_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: ENDGAME_STAT,
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
                            nestedStats: [
                                {
                                    stat: ENDGAME_PARKING_INDIVIDUAL_STAT,
                                    nestedStats: [],
                                },
                            ],
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
];

const SCORES = STAT_SET_TEAMS_2021_SHARED.find((s) => s.name == "Match Scores")!.set as StatSetGroup<
    FullTep2021Traditional,
    Group
>;
const AVG = SCORES.groups.find((g) => g.shortName == "AVG")!;
const MAX = SCORES.groups.find((g) => g.shortName == "MAX")!;
const OPR = SCORES.groups.find((g) => g.shortName == "OPR")!;

export const AVERAGE_STAT = AVG.get(TOTAL_STAT);
export const MAX_STAT = MAX.get(TOTAL_STAT);
export const OPR_STAT = OPR.get(TOTAL_STAT);
export const NP_OPR_STAT = OPR.get(TOTAL_NP_STAT);
export const AUTO_OPR_STAT = OPR.get(AUTO_STAT);
export const TELEOP_OPR_STAT = OPR.get(DC_STAT);
export const ENDGAME_OPR_STAT = OPR.get(ENDGAME_STAT);
