// Points table for 2025+ advancement rules.
// Qualification points must be computed separately and clamped to this min/max.

export const ADVANCEMENT_SEASON = 2025 as const;

// Qualification phase
export const QUAL_POINTS_MIN_2025 = 2;
export const QUAL_POINTS_MAX_2025 = 16;

// Alliance selection points (both alliance lead and draft acceptance)
export const ALLIANCE_SELECTION_BASE_2025 = 21; // points = 21 - position (1-based)

// Playoff advancement points by final placement rank (1–4 only)
export const PLAYOFF_POINTS_2025: Record<1 | 2 | 3 | 4, number> = {
    1: 40,
    2: 20,
    3: 10,
    4: 5,
};

// Judged award points (Table 4-1)
export const INSPIRE_POINTS_2025 = { 1: 60, 2: 30, 3: 15 } as const;
export const OTHER_AWARD_POINTS_2025 = { 1: 12, 2: 6, 3: 3 } as const;

// Tiebreak order (first five only)
export const TIEBREAK_ORDER_2025 = [
    "totalAdvancementPoints",
    "judgedAwardPoints",
    "playoffAdvancementPoints",
    "allianceSelectionPoints",
    "qualificationPhasePoints",
];

export type TiebreakKey2025 = (typeof TIEBREAK_ORDER_2025)[number];
