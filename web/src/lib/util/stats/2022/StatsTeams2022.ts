import {
    Tep2022FieldName,
    Tep2022Group,
    type FullStatsGroup2022Fragment,
} from "../../../graphql/generated/graphql-operations";
import { DisplayWhen, makeStat, type Stat } from "../Stat";
import { StatColor } from "../stat-color";
import { StatDisplayType } from "../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../StatSet";

export type FullTep2022 = {
    team: {
        number: number;
        name: string;
    };
    stats: {
        __typename?: "TeamEventStats2022";
        rank: number;
        rp2022: number;
        tb12022: number;
        tb22022: number;
        wins: number;
        losses: number;
        ties: number;
        dqs: number;
        qualMatchesPlayed: number;
        total: FullStatsGroup2022Fragment;
        average: FullStatsGroup2022Fragment;
        opr: FullStatsGroup2022Fragment;
        min: FullStatsGroup2022Fragment;
        max: FullStatsGroup2022Fragment;
        standardDev: FullStatsGroup2022Fragment;
    };
};

export const TEAM_STAT: Stat<FullTep2022> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team",
    columnName: "Team",
    identifierName: "Team",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.team,
    apiField: { fieldName: Tep2022FieldName.TeamNumber },
};

export const RP_STAT: Stat<FullTep2022> = {
    color: StatColor.RED,
    displayType: StatDisplayType.DECIMAL,
    listName: "Ranking Points (RP)",
    columnName: "RP",
    identifierName: "Ranking Points (RP)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.rp2022,
    apiField: { fieldName: Tep2022FieldName.Rp },
};

export const EVENT_RANK_STAT: Stat<FullTep2022> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.RANK,
    listName: "Ranking",
    columnName: "Rank",
    identifierName: "Event Ranking",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.rank,
    apiField: { fieldName: Tep2022FieldName.Rank },
};

export const TBP_STAT: Stat<FullTep2022> = {
    color: StatColor.LIGHT_BLUE,
    displayType: StatDisplayType.DECIMAL,
    listName: "Tie Breaker Points (TBP)",
    columnName: "TBP",
    identifierName: "Tie Breaker Points (TBP)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.tb12022,
    apiField: { fieldName: Tep2022FieldName.Tb1 },
};

export const TBP2_STAT: Stat<FullTep2022> = {
    color: StatColor.BLUE,
    displayType: StatDisplayType.DECIMAL,
    listName: "Tie Breaker Points 2 (TBP2)",
    columnName: "TBP2",
    identifierName: "Tie Breaker Points 2 (TBP2)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.tb22022,
    apiField: { fieldName: Tep2022FieldName.Tb2 },
};

export const PLAYED_STAT: Stat<FullTep2022> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Matches Played",
    columnName: "Played",
    identifierName: "Qual Matches Played",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.qualMatchesPlayed,
    apiField: { fieldName: Tep2022FieldName.QualMatchesPlayed },
};

export const WINS_STAT: Stat<FullTep2022> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Wins",
    columnName: "Wins",
    identifierName: "Wins",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.wins,
    apiField: { fieldName: Tep2022FieldName.Wins },
};

export const LOSSES_STAT: Stat<FullTep2022> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Losses",
    columnName: "Losses",
    identifierName: "Losses",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.losses,
    apiField: { fieldName: Tep2022FieldName.Losses },
};

export const TIES_STAT: Stat<FullTep2022> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Ties",
    columnName: "Ties",
    identifierName: "Ties",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.ties,
    apiField: { fieldName: Tep2022FieldName.Ties },
};

export const RECORD_STAT: Stat<FullTep2022> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.RECORD,
    listName: "Record",
    columnName: "Record",
    identifierName: "Event Record",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => ({ wins: s.data.stats.wins, losses: s.data.stats.losses, ties: s.data.stats.ties }),
    apiField: { fieldName: Tep2022FieldName.Wins },
};

export const DQ_STAT: Stat<FullTep2022> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Disqualifications (DQs)",
    columnName: "DQs",
    identifierName: "Disqualifications (DQs)",
    displayWhen: DisplayWhen.ALWAYS,
    read: (s) => s.data.stats.dqs,
    apiField: { fieldName: Tep2022FieldName.Dq },
};

type Group = FullTep2022["stats"]["total"];

export const TOTAL_STAT: Stat<Group> = makeStat(
    "totalPoints",
    "Total Points",
    "",
    "Total Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.TotalPoints
);
export const TOTAL_NP_STAT: Stat<Group> = makeStat(
    "totalPointsNp",
    "Total Points No Penalties",
    "np",
    "Total Points No Penalties",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.TotalPointsNp
);

// ------------------------------------------------------------------------------------------------------------------------

export const AUTO_STAT: Stat<Group> = makeStat(
    "autoPoints",
    "Auto Points",
    "Auto",
    "Auto Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoPoints
);

export const AUTO_NAV_STAT: Stat<Group> = makeStat(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoNavigationPoints
);

export const AUTO_NAV_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "autoNavigationPointsIndividual",
    "Individual",
    "Auto Nav Individual",
    "Auto Navigation Points Individual",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoNavigationPointsIndividual
);

export const AUTO_CONE_STAT: Stat<Group> = makeStat(
    "autoConePoints",
    "Auto Cone Points",
    "Auto Cone",
    "Auto Cone Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoConePoints
);

export const AUTO_CONE_TERMINAL_STAT: Stat<Group> = makeStat(
    "autoTerminalPoints",
    "Terminal",
    "Auto Terminal",
    "Auto Terminal Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoTerminalPoints
);
export const AUTO_CONE_GROUND_STAT: Stat<Group> = makeStat(
    "autoGroundPoints",
    "Ground",
    "Auto Ground",
    "Auto Ground Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoGroundPoints
);
export const AUTO_CONE_LOW_STAT: Stat<Group> = makeStat(
    "autoLowPoints",
    "Low",
    "Auto Low",
    "Auto Low Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoLowPoints
);
export const AUTO_CONE_MEDIUM_STAT: Stat<Group> = makeStat(
    "autoMediumPoints",
    "Medium",
    "Auto Medium",
    "Auto Medium Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoMediumPoints
);
export const AUTO_CONE_HIGH_STAT: Stat<Group> = makeStat(
    "autoHighPoints",
    "High",
    "Auto High",
    "Auto High Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.AutoHighPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const DC_STAT: Stat<Group> = makeStat(
    "dcPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.DriverControlledPoints
);

export const DC_CONE_TERMINAL_STAT: Stat<Group> = makeStat(
    "dcTerminalPoints",
    "Terminal",
    "DC Terminal",
    "Driver Controlled Terminal Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.DcTerminalPoints
);
export const DC_CONE_GROUND_STAT: Stat<Group> = makeStat(
    "dcGroundPoints",
    "Ground",
    "DC Ground",
    "Driver Controlled Ground Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.DcGroundPoints
);
export const DC_CONE_LOW_STAT: Stat<Group> = makeStat(
    "dcLowPoints",
    "Low",
    "DC Low",
    "Driver Controlled Low Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.DcLowPoints
);
export const DC_CONE_MEDIUM_STAT: Stat<Group> = makeStat(
    "dcMediumPoints",
    "Medium",
    "DC Medium",
    "Driver Controlled Medium Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.DcMediumPoints
);
export const DC_CONE_HIGH_STAT: Stat<Group> = makeStat(
    "dcHighPoints",
    "High",
    "DC High",
    "Driver Controlled High Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.DcHighPoints
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_STAT: Stat<Group> = makeStat(
    "endgamePoints",
    "Endgame Points",
    "Endgame",
    "Endgame Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.EndgamePoints
);

export const EG_NAV_STAT: Stat<Group> = makeStat(
    "endgameNavigationPoints",
    "Endgame Navigation Points",
    "Endgame Nav",
    "Endgame Navigation Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.EndgameNavigationPoints
);

export const EG_NAV_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "endgameNavigationPointsIndividual",
    "Individual",
    "Endgame Nav Individual",
    "Endgame Navigation Points Individual",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.EndgameNavigationPointsIndividual
);

export const OWNERSHIP_STAT: Stat<Group> = makeStat(
    "ownershipPoints",
    "Ownership Points",
    "Ownership",
    "Ownership Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.OwnershipPoints
);
export const CONE_OWNERSHIP_STAT: Stat<Group> = makeStat(
    "coneOwnershipPoints",
    "Regular",
    "Regular Ownership",
    "Regular Ownership Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.ConeOwnershipPoints
);
export const BEACON_OWNERSHIP_STAT: Stat<Group> = makeStat(
    "beaconOwnershipPoints",
    "Beacon",
    "Beacon Ownership",
    "Beacon Ownership Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.BeaconOwnershipPoints
);

export const CIRCUIT_STAT: Stat<Group> = makeStat(
    "circuitPoints",
    "Circuit",
    "Circuit",
    "Circuit Points",
    DisplayWhen.ALWAYS,
    Tep2022FieldName.BeaconOwnershipPoints
);

export let STAT_SET_TEAMS_2022: StatSet<FullTep2022, Group> = [
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
                LOSSES_STAT,
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
                            Tep2022Group.Total
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
                            Tep2022Group.Avg,
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
                            Tep2022Group.Opr,
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
                            Tep2022Group.Min
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
                            Tep2022Group.Max
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
                            Tep2022Group.Dev,
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
                            stat: AUTO_CONE_STAT,
                            nestedStats: [
                                {
                                    stat: AUTO_CONE_TERMINAL_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_GROUND_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_LOW_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_MEDIUM_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: AUTO_CONE_HIGH_STAT,
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
                            stat: DC_CONE_TERMINAL_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_GROUND_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_LOW_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_MEDIUM_STAT,
                            nestedStats: [],
                        },
                        {
                            stat: DC_CONE_HIGH_STAT,
                            nestedStats: [],
                        },
                    ],
                },
                {
                    stat: ENDGAME_STAT,
                    nestedStats: [
                        {
                            stat: EG_NAV_STAT,
                            nestedStats: [
                                {
                                    stat: EG_NAV_INDIVIDUAL_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: OWNERSHIP_STAT,
                            nestedStats: [
                                {
                                    stat: CONE_OWNERSHIP_STAT,
                                    nestedStats: [],
                                },
                                {
                                    stat: BEACON_OWNERSHIP_STAT,
                                    nestedStats: [],
                                },
                            ],
                        },
                        {
                            stat: CIRCUIT_STAT,
                            nestedStats: [],
                        },
                    ],
                },
            ],
        },
    },
];

const SCORES = STAT_SET_TEAMS_2022.find((s) => s.name == "Match Scores")!.set as StatSetGroup<FullTep2022, Group>;
const AVG = SCORES.groups.find((g) => g.shortName == "AVG")!;
const MAX = SCORES.groups.find((g) => g.shortName == "MAX")!;
const OPR = SCORES.groups.find((g) => g.shortName == "OPR")!;

export const NP_AVERAGE_STAT = AVG.get(TOTAL_NP_STAT);
export const NP_MAX_STAT = MAX.get(TOTAL_NP_STAT);
export const OPR_STAT = OPR.get(TOTAL_STAT);
export const NP_OPR_STAT = OPR.get(TOTAL_NP_STAT);
export const AUTO_OPR_STAT = OPR.get(AUTO_STAT);
export const TELEOP_OPR_STAT = OPR.get(DC_STAT);
export const ENDGAME_OPR_STAT = OPR.get(ENDGAME_STAT);
