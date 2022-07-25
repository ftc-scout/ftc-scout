import type { FullStatsGroup2021TradFragment } from "../../graphql/generated/graphql-operations";
import type { Stat } from "./Stat";
import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";

export type FullStats_TeamEventStats2021Traditional_Fragment = {
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

export let RP_STAT: Stat<FullStats_TeamEventStats2021Traditional_Fragment> = {
    color: StatColor.RED,
    displayType: StatDisplayType.INTEGER,
    longName: "Ranking Points (RP)",
    shortName: "RP",
    read: (s) => s.rp,
};

export let RANK_STAT: Stat<FullStats_TeamEventStats2021Traditional_Fragment> = {
    color: StatColor.WHITE,
    displayType: StatDisplayType.RANK,
    longName: "Ranking",
    shortName: "Rank",
    read: (s) => s.rank,
};

export let TBP_STAT: Stat<FullStats_TeamEventStats2021Traditional_Fragment> = {
    color: StatColor.LIGHT_BLUE,
    displayType: StatDisplayType.INTEGER,
    longName: "Tie Breaker Points (TBP)",
    shortName: "TBP",
    read: (s) => s.tb1,
};

export let TBP2_STAT: Stat<FullStats_TeamEventStats2021Traditional_Fragment> = {
    color: StatColor.BLUE,
    displayType: StatDisplayType.INTEGER,
    longName: "Tie Breaker Points 2 (TBP2)",
    shortName: "TBP2",
    read: (s) => s.tb2,
};

export let PLAYED_STAT: Stat<FullStats_TeamEventStats2021Traditional_Fragment> = {
    color: StatColor.GREEN,
    displayType: StatDisplayType.INTEGER,
    longName: "Matches Played",
    shortName: "Played",
    read: (s) => s.qualMatchesPlayed,
};

export let AVG_STAT: Stat<FullStats_TeamEventStats2021Traditional_Fragment> = {
    color: StatColor.PURPLE,
    displayType: StatDisplayType.DECIMAL,
    longName: "Average Score",
    shortName: "AVG",
    read: (s) => s.average.totalPoints,
};

export let OPR_STAT: Stat<FullStats_TeamEventStats2021Traditional_Fragment> = {
    color: StatColor.PURPLE,
    displayType: StatDisplayType.DECIMAL,
    longName: "Offensive Power Rating (OPR)",
    shortName: "OPR",
    read: (s) => s.opr.totalPoints,
};
