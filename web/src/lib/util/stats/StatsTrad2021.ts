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

type Group = FullTep2021Traditional["stats"]["total"];

const TOTAL_STAT: Stat<Group> = makeStat("totalPoints", "Total Points", "");
const TOTAL_NP_STAT: Stat<Group> = makeStat("totalPointsNp", "Total Points No Penalties", "np");

// ------------------------------------------------------------------------------------------------------------------------

const AUTO_STAT: Stat<Group> = makeStat("autoPoints", "Auto Points", "Auto");

const AUTO_FREIGHT_STAT: Stat<Group> = makeStat("autoFreightPoints", "Auto Freight Points", "Auto Freight");
const AUTO_FREIGHT1_STAT: Stat<Group> = makeStat("autoFreightPointsLevel1", "Level 1", "Auto Freight 1");
const AUTO_FREIGHT2_STAT: Stat<Group> = makeStat("autoFreightPointsLevel2", "Level 2", "Auto Freight 2");
const AUTO_FREIGHT3_STAT: Stat<Group> = makeStat("autoFreightPointsLevel3", "Level 3", "Auto Freight 3");
const AUTO_FREIGHT_STORAGE_STAT: Stat<Group> = makeStat("autoFreightPointsStorage", "Storage", "Auto Storage");

const AUTO_CAROUSEL_STAT: Stat<Group> = makeStat("autoCarouselPoints", "Auto Carousel Points", "Auto Carousel");

const AUTO_NAV_STAT: Stat<Group> = makeStat("autoNavigationPoints", "Auto Navigation Points", "Auto Nav");
const AUTO_NAV_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "autoNavigationPointsIndividual",
    "Individual",
    "Auto Nav Individual"
);

const AUTO_BONUS_STAT: Stat<Group> = makeStat("autoBonusPoints", "Auto Bonus Points", "Bonus");
const AUTO_BONUS_INDIVIDUAL_STAT: Stat<Group> = makeStat("autoBonusPointsIndividual", "Individual", "Bonus Individual");

// ------------------------------------------------------------------------------------------------------------------------

const DC_STAT: Stat<Group> = makeStat("driverControlledPoints", "Driver Controlled Points", "Teleop");

const DC_ALLIANCE_STAT: Stat<Group> = makeStat("driverControlledAllianceHubPoints", "Alliance Hub Points", "Hub");
const DC_ALLIANCE1_STAT: Stat<Group> = makeStat("driverControlledAllianceHubPointsLevel1", "Level 1", "Hub 1");
const DC_ALLIANCE2_STAT: Stat<Group> = makeStat("driverControlledAllianceHubPointsLevel2", "Level 2", "Hub 2");
const DC_ALLIANCE3_STAT: Stat<Group> = makeStat("driverControlledAllianceHubPointsLevel3", "Level 3", "Hub 3");

const DC_SHARED_STAT: Stat<Group> = makeStat("driverControlledSharedHubPoints", "Shared Hub Points", "Shared");

const DC_STORAGE_STAT: Stat<Group> = makeStat("driverControlledStoragePoints", "Storage Points", "Storage");

// ------------------------------------------------------------------------------------------------------------------------

const ENDGAME_STAT: Stat<Group> = makeStat("endgamePoints", "Endgame Points", "Endgame");

const ENDGAME_DELIVERY_STAT: Stat<Group> = makeStat("endgameDeliveryPoints", "Delivery Points", "Delivery");

const ENDGAME_CAPPING_STAT: Stat<Group> = makeStat("cappingPoints", "Capping Points", "Capping");

const ENDGAME_PARKING_STAT: Stat<Group> = makeStat("endgameParkingPoints", "Parking Points", "Endgame Park");
const ENDGAME_PARKING_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "endgameParkingPointsIndividual",
    "Individual",
    "Endgame Park Individual"
);

// ------------------------------------------------------------------------------------------------------------------------

const PENALTIES_STAT: Stat<Group> = makeStat("penaltyPoints", "Penalty Points", "Penalties");

const PENALTIES_MAJOR_STAT: Stat<Group> = makeStat("majorPenaltyPoints", "Major Penalty Points", "Majors");

const PENALTIES_MINOR_STAT: Stat<Group> = makeStat("minorPenaltyPoints", "Minor Penalty Points", "Minors");

// ------------------------------------------------------------------------------------------------------------------------

function groupGetter<T, U>(
    getInner: (t2: T) => U,
    stat: Stat<U>,
    color: StatColor,
    shortNameAdd: string,
    longNameAdd: string,
    displayTypeOverride: StatDisplayType | null = null
): Stat<T> {
    return {
        read: (t: T) => stat.read(getInner(t)),
        shortName: `${stat.shortName} ${shortNameAdd}`,
        longName: `${stat.longName} ${longNameAdd}`,
        displayType: displayTypeOverride ?? stat.displayType,
        color,
    };
}

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
            get: (s) => groupGetter((t) => t.stats.total, s, StatColor.RED, "TOT", "Total"),
        },
        {
            longName: "Average",
            shortName: "AVG",
            description: "The average number of points scored in the category.",
            color: StatColor.PURPLE,
            get: (s) =>
                groupGetter((t) => t.stats.average, s, StatColor.PURPLE, "AVG", "Average", StatDisplayType.DECIMAL),
        },
        {
            longName: "OPR",
            shortName: "OPR",
            description: "Offensive Power Rating.",
            color: StatColor.PURPLE,
            get: (s) => groupGetter((t) => t.stats.opr, s, StatColor.PURPLE, "OPR", "OPR", StatDisplayType.DECIMAL),
        },
        {
            longName: "Minimum",
            shortName: "MIN",
            description: "The lowest number of points scored in the category.",
            color: StatColor.LIGHT_BLUE,
            get: (s) => groupGetter((t) => t.stats.min, s, StatColor.LIGHT_BLUE, "MIN", "Minimum"),
        },
        {
            longName: "Maximum",
            shortName: "MAX",
            description: "The highest number of points scored in the category.",
            color: StatColor.BLUE,
            get: (s) => groupGetter((t) => t.stats.max, s, StatColor.BLUE, "MAX", "Maximum"),
        },
        {
            longName: "Std. Dev.",
            shortName: "DEV",
            description: "The standard deviation of scores in the category.",
            color: StatColor.GREEN,
            get: (s) =>
                groupGetter(
                    (t) => t.stats.standardDev,
                    s,
                    StatColor.GREEN,
                    "DEV",
                    "Std. Dev.",
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
};

export const AVERAGE_STAT = STAT_SET_2021_TRAD.groups.find((g) => g.shortName == "AVG")!.get(TOTAL_STAT);
export const MAX_STAT = STAT_SET_2021_TRAD.groups.find((g) => g.shortName == "MAX")!.get(TOTAL_STAT);
export const OPR_STAT = STAT_SET_2021_TRAD.groups.find((g) => g.shortName == "OPR")!.get(TOTAL_STAT);
