import type { FullStatsGroup2021TradFragment } from "../../graphql/generated/graphql-operations";
import { makeStat, type Stat } from "./Stat";
import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";
import type { StatsSet } from "./StatsSet";

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

export const TEAM_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    longName: "Team",
    shortName: "Team",
    read: (s) => s.team,
};

export const RP_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.RED,
    displayType: StatDisplayType.INTEGER,
    longName: "Ranking Points (RP)",
    shortName: "RP",
    read: (s) => s.stats.rp,
};

export const RANK_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.RANK,
    longName: "Ranking",
    shortName: "Rank",
    read: (s) => s.stats.rank,
};

export const TBP_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.LIGHT_BLUE,
    displayType: StatDisplayType.INTEGER,
    longName: "Tie Breaker Points (TBP)",
    shortName: "TBP",
    read: (s) => s.stats.tb1,
};

export const TBP2_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.BLUE,
    displayType: StatDisplayType.INTEGER,
    longName: "Tie Breaker Points 2 (TBP2)",
    shortName: "TBP2",
    read: (s) => s.stats.tb2,
};

export const PLAYED_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    longName: "Matches Played",
    shortName: "Played",
    read: (s) => s.stats.qualMatchesPlayed,
};

export const WINS_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    longName: "Wins",
    shortName: "Wins",
    read: (s) => s.stats.wins,
};

export const lOSSES_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    longName: "Losses",
    shortName: "Losses",
    read: (s) => s.stats.losses,
};

export const TIES_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    longName: "Ties",
    shortName: "Ties",
    read: (s) => s.stats.ties,
};

export const DQ_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    longName: "Disqualifications (DQs)",
    shortName: "DQs",
    read: (s) => s.stats.ties,
};

export const AVG_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.PURPLE,
    displayType: StatDisplayType.DECIMAL,
    longName: "Average Score",
    shortName: "AVG",
    read: (s) => s.stats.average.totalPoints,
};

export const OPR_STAT: Stat<FullTep2021Traditional> = {
    color: StatColor.PURPLE,
    displayType: StatDisplayType.DECIMAL,
    longName: "Offensive Power Rating (OPR)",
    shortName: "OPR",
    read: (s) => s.stats.opr.totalPoints,
};

type Group = FullTep2021Traditional["stats"]["total"];

const TOTAL_STAT: Stat<Group> = makeStat("totalPoints", "Total Points", "");
const TOTAL_NP_STAT: Stat<Group> = makeStat("totalPointsNp", "Total Points No Penalties", "np");

// ------------------------------------------------------------------------------------------------------------------------

const AUTO_STAT: Stat<Group> = makeStat("autoPoints", "Auto Points", "Auto");

const AUTO_FREIGHT_STAT: Stat<Group> = makeStat("autoFreightPoints", "Auto Freight Points", "Auto Freight");
const AUTO_FREIGHT1_STAT: Stat<Group> = makeStat("autoFreightPointsLevel1", "Level 1", "Auto Freight 1");
const AUTO_FREIGHT2_STAT: Stat<Group> = makeStat("autoFreightPointsLevel2", "Level 2", "Auto Freight 2");
const AUTO_FREIGHT3_STAT: Stat<Group> = makeStat("autoFreightPointsLevel3", "Level 3", "Auto Freight 3");

const AUTO_CAROUSEL_STAT: Stat<Group> = makeStat("autoCarouselPoints", "Auto Carousel Points", "Auto Carousel");

export let STAT_SET_2021_TRAD: StatsSet<FullTep2021Traditional, Group> = {
    standalone: [
        TEAM_STAT,
        RANK_STAT,
        RP_STAT,
        TBP_STAT,
        TBP2_STAT,
        PLAYED_STAT,
        WINS_STAT,
        lOSSES_STAT,
        TIES_STAT,
        DQ_STAT,
    ],
    groups: [
        {
            longName: "Total",
            shortName: "TOT",
            description: "The sum of all points scored in the category.",
            color: StatColor.RED,
            get: (s) => s.stats.total,
        },
        {
            longName: "Average",
            shortName: "AVG",
            description: "The average number of points scored in the category.",
            color: StatColor.BLUE,
            get: (s) => s.stats.total,
        },
        {
            longName: "OPR",
            shortName: "OPR",
            description: "Offensive Power Rating.",
            color: StatColor.PURPLE,
            get: (s) => s.stats.total,
        },
        {
            longName: "Minimum",
            shortName: "MIN",
            description: "The lowest number of points scored in the category.",
            color: StatColor.GREEN,
            get: (s) => s.stats.total,
        },
        {
            longName: "Maximum",
            shortName: "MAX",
            description: "The highest number of points scored in the category.",
            color: StatColor.GREEN,
            get: (s) => s.stats.total,
        },
        {
            longName: "Std. Dev.",
            shortName: "DEV",
            description: "The standard deviation of scores in the category.",
            color: StatColor.LIGHT_BLUE,
            get: (s) => s.stats.total,
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
                    ],
                },
                {
                    stat: AUTO_CAROUSEL_STAT,
                    nestedStats: [],
                },
            ],
        },
    ],
};
