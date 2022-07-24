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
