// HELP: Season Specific

export const Season = {
    Skystone: 2019,
    UltimateGoal: 2020,
    FreightFrenzy: 2021,
    PowerPlay: 2022,
    CenterStage: 2023,
} as const;

export type Season = (typeof Season)[keyof typeof Season];

export const CURRENT_SEASON = Season.CenterStage;
// Preserve the order oldest to newest
export const PAST_SEASONS = [
    Season.Skystone,
    Season.UltimateGoal,
    Season.FreightFrenzy,
    Season.PowerPlay,
] as const;
export const ALL_SEASONS = [...PAST_SEASONS, CURRENT_SEASON] as const;
