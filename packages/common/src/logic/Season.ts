export const Season = {
    Skystone: 2019,
    UltimateGoal: 2020,
    FreightFrenzy: 2021,
    PowerPlay: 2022,
} as const;

export type Season = (typeof Season)[keyof typeof Season];

export const PAST_SEASONS = [Season.Skystone, Season.UltimateGoal, Season.FreightFrenzy];
export const CURRENT_SEASON = Season.PowerPlay;
export const ALL_SEASONS = [...PAST_SEASONS, CURRENT_SEASON];
