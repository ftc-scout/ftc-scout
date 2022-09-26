import { Tep2021Group, type FullStatsGroup2021RemoteFragment } from "../../../../graphql/generated/graphql-operations";
import { StatColor } from "../../stat-color";
import { StatDisplayType } from "../../stat-display-type";
import { groupGetter, type StatSet, type StatSetGroup } from "../../StatSet";
import {
    AUTO_BONUS_STAT,
    AUTO_CAROUSEL_STAT,
    AUTO_FREIGHT1_STAT,
    AUTO_FREIGHT2_STAT,
    AUTO_FREIGHT3_STAT,
    AUTO_FREIGHT_STAT,
    AUTO_FREIGHT_STORAGE_STAT,
    AUTO_NAV_STAT,
    AUTO_STAT,
    DC_ALLIANCE1_STAT,
    DC_ALLIANCE2_STAT,
    DC_ALLIANCE3_STAT,
    DC_ALLIANCE_STAT,
    DC_STAT,
    DC_STORAGE_STAT,
    ENDGAME_BALANCED_STAT,
    ENDGAME_CAPPING_STAT,
    ENDGAME_DELIVERY_STAT,
    ENDGAME_PARKING_STAT,
    ENDGAME_STAT,
    PENALTIES_MAJOR_STAT,
    PENALTIES_MINOR_STAT,
    PENALTIES_STAT,
    PLAYED_STAT,
    EVENT_RANK_STAT,
    RP_STAT,
    TBP2_STAT,
    TBP_STAT,
    TEAM_STAT,
    TOTAL_NP_STAT,
    TOTAL_STAT,
} from "./StatsSharedTeams2021";

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

type Group = FullTep2021Remote["stats"]["total"];

export let STAT_SET_TEAMS_2021_REMOTE: StatSet<FullTep2021Remote, Group> = [
    {
        name: "Team's Event Performance",
        type: "standalone",
        set: {
            standalone: [TEAM_STAT, EVENT_RANK_STAT, RP_STAT, TBP_STAT, TBP2_STAT, PLAYED_STAT],
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
                            Tep2021Group.Avg
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
                            nestedStats: [],
                        },
                        {
                            stat: AUTO_BONUS_STAT,
                            nestedStats: [],
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
];

const SCORES = STAT_SET_TEAMS_2021_REMOTE.find((s) => s.name == "Match Scores")!.set as StatSetGroup<
    FullTep2021Remote,
    Group
>;
const AVG = SCORES.groups.find((g) => g.shortName == "AVG")!;
const MAX = SCORES.groups.find((g) => g.shortName == "MAX")!;

export const AVERAGE_STAT = AVG.get(TOTAL_STAT);
export const MAX_STAT = MAX.get(TOTAL_STAT);
