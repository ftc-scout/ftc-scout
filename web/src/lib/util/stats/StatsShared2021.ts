import { makeStat, type Stat } from "./Stat";
import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";
import type { FullTep2021Remote } from "./StatsRemote2021";
import { groupGetter, type StatsSet } from "./StatsSet";
import type { FullTep2021Traditional } from "./StatsTrad2021";

export type FullTep2021Shared = FullTep2021Traditional | FullTep2021Remote;

export const TEAM_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    listName: "Team",
    columnName: "Team",
    identifierName: "Team",
    read: (s) => s.team,
};

export const RP_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.RED,
    displayType: StatDisplayType.INTEGER,
    listName: "Ranking Points (RP)",
    columnName: "RP",
    identifierName: "Ranking Points (RP)",
    read: (s) => s.stats.rp,
};

export const RANK_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.RANK,
    listName: "Ranking",
    columnName: "Rank",
    identifierName: "Event Ranking",
    read: (s) => s.stats.rank,
};

export const TBP_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.LIGHT_BLUE,
    displayType: StatDisplayType.INTEGER,
    listName: "Tie Breaker Points (TBP)",
    columnName: "TBP",
    identifierName: "Tie Breaker Points (TBP)",
    read: (s) => s.stats.tb1,
};

export const TBP2_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.BLUE,
    displayType: StatDisplayType.INTEGER,
    listName: "Tie Breaker Points 2 (TBP2)",
    columnName: "TBP2",
    identifierName: "Tie Breaker Points 2 (TBP2)",
    read: (s) => s.stats.tb2,
};

export const PLAYED_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    listName: "Matches Played",
    columnName: "Played",
    identifierName: "Qual Matches Played",
    read: (s) => s.stats.qualMatchesPlayed,
};

type Group = FullTep2021Shared["stats"]["total"];

export const TOTAL_STAT: Stat<Group> = makeStat("totalPoints", "Total Points", "", "Total Points");
export const TOTAL_NP_STAT: Stat<Group> = makeStat(
    "totalPointsNp",
    "Total Points No Penalties",
    "np",
    "Total Points No Penalties"
);

// ------------------------------------------------------------------------------------------------------------------------

export const AUTO_STAT: Stat<Group> = makeStat("autoPoints", "Auto Points", "Auto", "Auto Points");

export const AUTO_FREIGHT_STAT: Stat<Group> = makeStat(
    "autoFreightPoints",
    "Auto Freight Points",
    "Auto Freight",
    "Auto Freight Points"
);
export const AUTO_FREIGHT1_STAT: Stat<Group> = makeStat(
    "autoFreightPointsLevel1",
    "Level 1",
    "Auto Freight 1",
    "Auto Freight Points Level 1"
);
export const AUTO_FREIGHT2_STAT: Stat<Group> = makeStat(
    "autoFreightPointsLevel2",
    "Level 2",
    "Auto Freight 2",
    "Auto Freight Points Level 2"
);
export const AUTO_FREIGHT3_STAT: Stat<Group> = makeStat(
    "autoFreightPointsLevel3",
    "Level 3",
    "Auto Freight 3",
    "Auto Freight Points Level 3"
);
export const AUTO_FREIGHT_STORAGE_STAT: Stat<Group> = makeStat(
    "autoFreightPointsStorage",
    "Storage",
    "Auto Storage",
    "Auto Freight Points Storage"
);

export const AUTO_CAROUSEL_STAT: Stat<Group> = makeStat(
    "autoCarouselPoints",
    "Auto Carousel Points",
    "Auto Carousel",
    "Auto Carousel Points"
);

export const AUTO_NAV_STAT: Stat<Group> = makeStat(
    "autoNavigationPoints",
    "Auto Navigation Points",
    "Auto Nav",
    "Auto Navigation Points"
);

export const AUTO_BONUS_STAT: Stat<Group> = makeStat(
    "autoBonusPoints",
    "Auto Bonus Points",
    "Bonus",
    "Auto Bonus Points"
);

// ------------------------------------------------------------------------------------------------------------------------

export const DC_STAT: Stat<Group> = makeStat(
    "driverControlledPoints",
    "Driver Controlled Points",
    "Teleop",
    "Driver Controlled Points"
);

export const DC_ALLIANCE_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPoints",
    "Alliance Hub Points",
    "Hub",
    "Driver Controlled Alliance Hub Points"
);
export const DC_ALLIANCE1_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPointsLevel1",
    "Level 1",
    "Hub 1",
    "Driver Controlled Alliance Hub Level 1 Points"
);
export const DC_ALLIANCE2_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPointsLevel2",
    "Level 2",
    "Hub 2",
    "Driver Controlled Alliance Hub Level 2 Points"
);
export const DC_ALLIANCE3_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPointsLevel3",
    "Level 3",
    "Hub 3",
    "Driver Controlled Alliance Hub Level 3 Points"
);

export const DC_STORAGE_STAT: Stat<Group> = makeStat(
    "driverControlledStoragePoints",
    "Storage Points",
    "Storage",
    "Driver Controlled Storage Points"
);

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_STAT: Stat<Group> = makeStat("endgamePoints", "Endgame Points", "Endgame", "Endgame Points");

export const ENDGAME_DELIVERY_STAT: Stat<Group> = makeStat(
    "endgameDeliveryPoints",
    "Delivery Points",
    "Delivery",
    "Endgame Delivery Points"
);

export const ENDGAME_CAPPING_STAT: Stat<Group> = makeStat(
    "cappingPoints",
    "Capping Points",
    "Capping",
    "Endgame Capping Points"
);

export const ENDGAME_PARKING_STAT: Stat<Group> = makeStat(
    "endgameParkingPoints",
    "Parking Points",
    "Endgame Park",
    "Endgame Parking Points"
);

export const ENDGAME_BALANCED_STAT: Stat<Group> = makeStat(
    "allianceBalancedPoints",
    "Hub Balanced Points",
    "Hub Balanced",
    "Endgame Alliance Hub Balanced Points"
);

// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<Group> = makeStat("penaltyPoints", "Penalty Points", "Penalties", "Penalty Points");

export const PENALTIES_MAJOR_STAT: Stat<Group> = makeStat(
    "majorPenaltyPoints",
    "Major Penalty Points",
    "Majors",
    "Major Penalty Points"
);

export const PENALTIES_MINOR_STAT: Stat<Group> = makeStat(
    "minorPenaltyPoints",
    "Minor Penalty Points",
    "Minors",
    "Minor Penalty Points"
);

export const ENDGAME_PARKING_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "endgameParkingPointsIndividual",
    "Individual",
    "Endgame Park Individual",
    "Endgame Parking Points Individual"
);

// ------------------------------------------------------------------------------------------------------------------------

// Individual stats
export const AUTO_NAV_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "autoNavigationPointsIndividual",
    "Individual",
    "Auto Nav Individual",
    "Auto Navigation Points Individual"
);

export const AUTO_BONUS_INDIVIDUAL_STAT: Stat<Group> = makeStat(
    "autoBonusPointsIndividual",
    "Individual",
    "Bonus Individual",
    "Auto Bonus Points Individual"
);

export let STAT_SET_2021_SHARED: StatsSet<FullTep2021Traditional, Group> = {
    standalone: [TEAM_STAT, RANK_STAT, RP_STAT, TBP_STAT, TBP2_STAT, PLAYED_STAT],
    groups: [
        {
            longName: "Total",
            shortName: "TOT",
            description: "The sum of all points scored in the category.",
            color: StatColor.RED,
            get: (s) => groupGetter((t) => t.stats.total, s, StatColor.RED, "TOT", "Total", "Total"),
        },
        {
            longName: "Average",
            shortName: "AVG",
            description: "The average number of points scored in the category.",
            color: StatColor.PURPLE,
            get: (s) =>
                groupGetter(
                    (t) => t.stats.average,
                    s,
                    StatColor.PURPLE,
                    "AVG",
                    "Average",
                    "Average",
                    StatDisplayType.DECIMAL
                ),
        },
        {
            longName: "OPR",
            shortName: "OPR",
            description: "Offensive Power Rating.",
            color: StatColor.PURPLE,
            get: (s) =>
                groupGetter((t) => t.stats.opr, s, StatColor.PURPLE, "OPR", "OPR", "OPR", StatDisplayType.DECIMAL),
        },
        {
            longName: "Minimum",
            shortName: "MIN",
            description: "The lowest number of points scored in the category.",
            color: StatColor.LIGHT_BLUE,
            get: (s) => groupGetter((t) => t.stats.min, s, StatColor.LIGHT_BLUE, "MIN", "Minimum", "Minimum"),
        },
        {
            longName: "Maximum",
            shortName: "MAX",
            description: "The highest number of points scored in the category.",
            color: StatColor.BLUE,
            get: (s) => groupGetter((t) => t.stats.max, s, StatColor.BLUE, "MAX", "Maximum", "Maximum"),
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
                    "Standard Deviation",
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

export const AVERAGE_STAT = STAT_SET_2021_SHARED.groups.find((g) => g.shortName == "AVG")!.get(TOTAL_STAT);
export const MAX_STAT = STAT_SET_2021_SHARED.groups.find((g) => g.shortName == "MAX")!.get(TOTAL_STAT);
export const OPR_STAT = STAT_SET_2021_SHARED.groups.find((g) => g.shortName == "OPR")!.get(TOTAL_STAT);
export const NP_OPR_STAT = STAT_SET_2021_SHARED.groups.find((g) => g.shortName == "OPR")!.get(TOTAL_NP_STAT);
export const AUTO_OPR_STAT = STAT_SET_2021_SHARED.groups.find((g) => g.shortName == "OPR")!.get(AUTO_STAT);
export const TELEOP_OPR_STAT = STAT_SET_2021_SHARED.groups.find((g) => g.shortName == "OPR")!.get(DC_STAT);
export const ENDGAME_OPR_STAT = STAT_SET_2021_SHARED.groups.find((g) => g.shortName == "OPR")!.get(ENDGAME_STAT);
