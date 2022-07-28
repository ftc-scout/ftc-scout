import { makeStat, type Stat } from "./Stat";
import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";
import type { FullTep2021Remote } from "./StatsRemote2021";
import type { FullTep2021Traditional } from "./StatsTrad2021";

export type FullTep2021Shared = FullTep2021Traditional | FullTep2021Remote;

export const TEAM_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.TEAM,
    longName: "Team",
    shortName: "Team",
    read: (s) => s.team,
};

export const RP_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.RED,
    displayType: StatDisplayType.INTEGER,
    longName: "Ranking Points (RP)",
    shortName: "RP",
    read: (s) => s.stats.rp,
};

export const RANK_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.RANK,
    longName: "Ranking",
    shortName: "Rank",
    read: (s) => s.stats.rank,
};

export const TBP_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.LIGHT_BLUE,
    displayType: StatDisplayType.INTEGER,
    longName: "Tie Breaker Points (TBP)",
    shortName: "TBP",
    read: (s) => s.stats.tb1,
};

export const TBP2_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.BLUE,
    displayType: StatDisplayType.INTEGER,
    longName: "Tie Breaker Points 2 (TBP2)",
    shortName: "TBP2",
    read: (s) => s.stats.tb2,
};

export const PLAYED_STAT: Stat<FullTep2021Shared> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    longName: "Matches Played",
    shortName: "Played",
    read: (s) => s.stats.qualMatchesPlayed,
};

type Group = FullTep2021Shared["stats"]["total"];

export const TOTAL_STAT: Stat<Group> = makeStat("totalPoints", "Total Points", "");
export const TOTAL_NP_STAT: Stat<Group> = makeStat("totalPointsNp", "Total Points No Penalties", "np");

// ------------------------------------------------------------------------------------------------------------------------

export const AUTO_STAT: Stat<Group> = makeStat("autoPoints", "Auto Points", "Auto");

export const AUTO_FREIGHT_STAT: Stat<Group> = makeStat("autoFreightPoints", "Auto Freight Points", "Auto Freight");
export const AUTO_FREIGHT1_STAT: Stat<Group> = makeStat("autoFreightPointsLevel1", "Level 1", "Auto Freight 1");
export const AUTO_FREIGHT2_STAT: Stat<Group> = makeStat("autoFreightPointsLevel2", "Level 2", "Auto Freight 2");
export const AUTO_FREIGHT3_STAT: Stat<Group> = makeStat("autoFreightPointsLevel3", "Level 3", "Auto Freight 3");
export const AUTO_FREIGHT_STORAGE_STAT: Stat<Group> = makeStat("autoFreightPointsStorage", "Storage", "Auto Storage");

export const AUTO_CAROUSEL_STAT: Stat<Group> = makeStat("autoCarouselPoints", "Auto Carousel Points", "Auto Carousel");

export const AUTO_NAV_STAT: Stat<Group> = makeStat("autoNavigationPoints", "Auto Navigation Points", "Auto Nav");

export const AUTO_BONUS_STAT: Stat<Group> = makeStat("autoBonusPoints", "Auto Bonus Points", "Bonus");

// ------------------------------------------------------------------------------------------------------------------------

export const DC_STAT: Stat<Group> = makeStat("driverControlledPoints", "Driver Controlled Points", "Teleop");

export const DC_ALLIANCE_STAT: Stat<Group> = makeStat(
    "driverControlledAllianceHubPoints",
    "Alliance Hub Points",
    "Hub"
);
export const DC_ALLIANCE1_STAT: Stat<Group> = makeStat("driverControlledAllianceHubPointsLevel1", "Level 1", "Hub 1");
export const DC_ALLIANCE2_STAT: Stat<Group> = makeStat("driverControlledAllianceHubPointsLevel2", "Level 2", "Hub 2");
export const DC_ALLIANCE3_STAT: Stat<Group> = makeStat("driverControlledAllianceHubPointsLevel3", "Level 3", "Hub 3");

export const DC_STORAGE_STAT: Stat<Group> = makeStat("driverControlledStoragePoints", "Storage Points", "Storage");

// ------------------------------------------------------------------------------------------------------------------------

export const ENDGAME_STAT: Stat<Group> = makeStat("endgamePoints", "Endgame Points", "Endgame");

export const ENDGAME_DELIVERY_STAT: Stat<Group> = makeStat("endgameDeliveryPoints", "Delivery Points", "Delivery");

export const ENDGAME_CAPPING_STAT: Stat<Group> = makeStat("cappingPoints", "Capping Points", "Capping");

export const ENDGAME_PARKING_STAT: Stat<Group> = makeStat("endgameParkingPoints", "Parking Points", "Endgame Park");

// ------------------------------------------------------------------------------------------------------------------------

export const PENALTIES_STAT: Stat<Group> = makeStat("penaltyPoints", "Penalty Points", "Penalties");

export const PENALTIES_MAJOR_STAT: Stat<Group> = makeStat("majorPenaltyPoints", "Major Penalty Points", "Majors");

export const PENALTIES_MINOR_STAT: Stat<Group> = makeStat("minorPenaltyPoints", "Minor Penalty Points", "Minors");

// ------------------------------------------------------------------------------------------------------------------------
