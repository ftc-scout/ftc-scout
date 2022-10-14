import { DisplayWhen, makeStat, type Stat } from "../Stat";
import { StatColor } from "../stat-color";
import { StatDisplayType } from "../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../StatSet";
import {
    Tep2020FieldName,
    Tep2020Group,
    type FullStatsGroup2020Fragment,
} from "$lib/graphql/generated/graphql-operations";

export type FullTep2020Traditional = {
    team: {
        number: number;
        name: string;
    };
    stats: {
        __typename?: "TeamEventStats2020Traditional";
        rank: number;
        rp: number;
        tb1: number;
        tb2: number;
        wins: number;
        losses: number;
        ties: number;
        dqs: number;
        qualMatchesPlayed: number;
        total: FullStatsGroup2020Fragment;
        average: FullStatsGroup2020Fragment;
        opr: FullStatsGroup2020Fragment;
        min: FullStatsGroup2020Fragment;
        max: FullStatsGroup2020Fragment;
        standardDev: FullStatsGroup2020Fragment;
    };
};

export type FullTep2020Remote = {
    team: {
        number: number;
        name: string;
    };
    stats: {
        __typename?: "TeamEventStats2020Remote";
        rank: number;
        rp: number;
        tb1: number;
        tb2: number;
        qualMatchesPlayed: number;
        total: FullStatsGroup2020Fragment;
        average: FullStatsGroup2020Fragment;
        opr: FullStatsGroup2020Fragment;
        min: FullStatsGroup2020Fragment;
        max: FullStatsGroup2020Fragment;
        standardDev: FullStatsGroup2020Fragment;
    };
};

export type FullTep2020Shared = FullTep2020Traditional | FullTep2020Remote;

export const TEAM_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team",
    columnName: "Team",
    identifierName: "Team",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.team,
    apiField: { fieldName: Tep2020FieldName.TeamNumber },
};

export const RP_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.RED,
    displayType: StatDisplayType.INTEGER,
    listName: "Ranking Points (RP)",
    columnName: "RP",
    identifierName: "Ranking Points (RP)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.rp,
    apiField: { fieldName: Tep2020FieldName.Rp },
};

export const EVENT_RANK_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.RANK,
    listName: "Ranking",
    columnName: "Rank",
    identifierName: "Event Ranking",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.rank,
    apiField: { fieldName: Tep2020FieldName.Rank },
};

export const TBP_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.LIGHT_BLUE,
    displayType: StatDisplayType.INTEGER,
    listName: "Tie Breaker Points (TBP)",
    columnName: "TBP",
    identifierName: "Tie Breaker Points (TBP)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.tb1,
    apiField: { fieldName: Tep2020FieldName.Tb1 },
};

export const TBP2_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.BLUE,
    displayType: StatDisplayType.INTEGER,
    listName: "Tie Breaker Points 2 (TBP2)",
    columnName: "TBP2",
    identifierName: "Tie Breaker Points 2 (TBP2)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.tb2,
    apiField: { fieldName: Tep2020FieldName.Tb2 },
};

export const PLAYED_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Matches Played",
    columnName: "Played",
    identifierName: "Qual Matches Played",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.qualMatchesPlayed,
    apiField: { fieldName: Tep2020FieldName.QualMatchesPlayed },
};

type Group = FullTep2020Shared["stats"]["total"];

export const TOTAL_STAT: Stat<Group> = makeStat(
    "totalPoints",
    "Total Points",
    "",
    "Total Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.TotalPoints
);
export const TOTAL_NP_STAT: Stat<Group> = makeStat(
    "totalPointsNp",
    "Total Points No Penalties",
    "np",
    "Total Points No Penalties",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.TotalPointsNp
);

// ------------------------------------------------------------------------------------------------------------------------

export const AUTO_STAT: Stat<Group> = makeStat(
    "autoPoints",
    "Auto Points",
    "Auto",
    "Auto Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoPoints
);

export const AUTO_NAV_STAT: Stat<Group> = makeStat(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoNavigationPoints
);

export const AUTO_NAV_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "autoNavigationPointsIndividual",
    "Individual",
    "Auto Nav Individual",
    "Auto Navigation Points Individual",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoNavigationPointsIndividual
);

export const AUTO_TOWER_STAT: Stat<Group> = makeStat(
    "autoGoalPoints",
    "Auto Tower Points",
    "Auto Tower",
    "Auto Tower Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoGoalPoints
);

export const AUTO_TOWER_LOW_STAT: Stat<Group> = makeStat(
    "autoGoalPointsLow",
    "Low",
    "Auto Tower Low",
    "Auto Tower Low Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoGoalPointsLow
);
export const AUTO_TOWER_MID_STAT: Stat<Group> = makeStat(
    "autoGoalPointsMid",
    "Mid",
    "Auto Tower Mid",
    "Auto Tower Mid Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoGoalPointsMid
);
export const AUTO_TOWER_HIGH_STAT: Stat<Group> = makeStat(
    "autoGoalPointsHigh",
    "High",
    "Auto Tower High",
    "Auto Tower High Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoGoalPointsHigh
);

export const AUTO_WOBBLE_STAT: Stat<Group> = makeStat(
    "autoWobblePoints",
    "Auto Wobble Points",
    "Auto Wobble",
    "Auto Wobble Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoWobblePoints
);

export const AUTO_POWERSHOT_STAT: Stat<Group> = makeStat(
    "autoPowershotPoints",
    "Auto Powershot Points",
    "Auto Powershot",
    "Auto Powershot Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.AutoPowershotPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const DC_STAT: Stat<Group> = makeStat(
    "driverControlledPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.DriverControlledPoints
);

export const DC_TOWER_LOW_STAT: Stat<Group> = makeStat(
    "driverControlledPointsLow",
    "Low",
    "DC Tower Low",
    "Driver Controlled Tower Low Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.DcGoalPointsLow
);
export const DC_TOWER_MID_STAT: Stat<Group> = makeStat(
    "driverControlledPointsMid",
    "Mid",
    "DC Tower Mid",
    "Driver Controlled Tower Mid Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.DcGoalPointsMid
);
export const DC_TOWER_HIGH_STAT: Stat<Group> = makeStat(
    "driverControlledPointsHigh",
    "High",
    "DC Tower High",
    "Driver Controlled Tower High Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.DcGoalPointsHigh
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_STAT: Stat<Group> = makeStat(
    "endgamePoints",
    "Endgame Points",
    "Endgame",
    "Endgame Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.EndgamePoints
);

export const ENDGAME_POWERSHOT_STAT: Stat<Group> = makeStat(
    "endgamePowershotPoints",
    "Endgame Powershot Points",
    "Endgame Powershot",
    "Endgame Powershot Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.EndgamePowershotPoints
);

export const ENDGAME_WOBBLE_STAT: Stat<Group> = makeStat(
    "endgameWobblePoints",
    "Endgame Wobble Points",
    "Endgame Wobble",
    "Endgame Wobble Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.EndgameWobblePoints
);

export const ENDGAME_WOBBLE_RINGS_STAT: Stat<Group> = makeStat(
    "endgameWobbleRingPoints",
    "Endgame Wobble Ring Points",
    "Endgame Wobble Rings",
    "Endgame Wobble Ring Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.EndgameWobbleRingPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<Group> = makeStat(
    "penaltyPoints",
    "Penalty Points",
    "Penalties",
    "Penalty Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.PenaltyPoints
);

export const PENALTIES_MAJOR_STAT: Stat<Group> = makeStat(
    "majorPenaltyPoints",
    "Major Penalty Points",
    "Majors",
    "Major Penalty Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.MajorPenaltyPoints
);

export const PENALTIES_MINOR_STAT: Stat<Group> = makeStat(
    "minorPenaltyPoints",
    "Minor Penalty Points",
    "Minors",
    "Minor Penalty Points",
    DisplayWhen.ALWAYS,
    Tep2020FieldName.MinorPenaltyPoints
);

// Trad Only --------------------------------------------------------------------------------------------------------------

export const WINS_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Wins",
    columnName: "Wins",
    identifierName: "Wins",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("wins" in s.data.stats ? s.data.stats.wins : null),
    apiField: { fieldName: Tep2020FieldName.Wins },
};

export const lOSSES_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Losses",
    columnName: "Losses",
    identifierName: "Losses",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("losses" in s.data.stats ? s.data.stats.losses : null),
    apiField: { fieldName: Tep2020FieldName.Losses },
};

export const TIES_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Ties",
    columnName: "Ties",
    identifierName: "Ties",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("ties" in s.data.stats ? s.data.stats.ties : null),
    apiField: { fieldName: Tep2020FieldName.Ties },
};

export const RECORD_STAT: Stat<FullTep2020Shared> = {
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
    apiField: { fieldName: Tep2020FieldName.Wins },
};

export const DQ_STAT: Stat<FullTep2020Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Disqualifications (DQs)",
    columnName: "DQs",
    identifierName: "Disqualifications (DQs)",
    displayWhen: DisplayWhen.TRAD,
    read: (s) => ("dqs" in s.data.stats ? s.data.stats.dqs : null),
    apiField: { fieldName: Tep2020FieldName.Dq },
};

// ------------------------------------------------------------------------------------------------------------------------

export let STAT_SET_TEAMS_2020_SHARED: StatSet<FullTep2020Traditional, Group> = [
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
                            Tep2020Group.Total
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
                            Tep2020Group.Avg,
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
                            Tep2020Group.Opr,
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
                            Tep2020Group.Min
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
                            Tep2020Group.Max
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
                            Tep2020Group.Dev,
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
                            stat: AUTO_NAV_STAT,
                            nestedStats: [
                                {
                                    stat: AUTO_NAV_INDIVIDUAL_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: AUTO_TOWER_STAT,
                            nestedStats: [
                                {
                                    stat: AUTO_TOWER_LOW_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_TOWER_MID_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_TOWER_HIGH_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: AUTO_WOBBLE_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_POWERSHOT_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: DC_STAT,
                    nestedStats: [
                        {
                            stat: DC_TOWER_LOW_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_TOWER_MID_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_TOWER_HIGH_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: ENDGAME_STAT,
                    nestedStats: [
                        {
                            stat: ENDGAME_WOBBLE_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_WOBBLE_RINGS_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: ENDGAME_POWERSHOT_STAT,
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
];

const SCORES = STAT_SET_TEAMS_2020_SHARED.find((s) => s.name == "Match Scores")!.set as StatSetGroup<
    FullTep2020Traditional,
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
