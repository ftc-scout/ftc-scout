import { AdvancementPointsConfig, TiebreakKey } from "../points";
import { Season } from "../../Season";

const QUAL_POINTS_MIN = 2;
const QUAL_POINTS_MAX = 16;
const QUAL_ALPHA = 1.07;

const ALLIANCE_SELECTION_BASE = 21;

const PLAYOFF_POINTS: Record<1 | 2 | 3 | 4, number> = {
    1: 40,
    2: 20,
    3: 10,
    4: 5,
};

const DIVISION_PLAYOFF_POINTS: Record<2 | 3, number> = {
    2: 10,
    3: 5,
};

const INSPIRE_POINTS: Record<1 | 2 | 3, number> = {
    1: 60,
    2: 30,
    3: 15,
};

const OTHER_AWARD_POINTS: Record<1 | 2 | 3, number> = {
    1: 12,
    2: 6,
    3: 3,
};

const ADVANCEMENT_JUDGED_AWARD_TYPES = new Set([
    "Inspire",
    "JudgesChoice",
    "Control",
    "Motivate",
    "Reach",
    "Sustain",
    "Design",
    "Innovate",
    "Connect",
    "Think",
]);

const INSPIRE_AWARD_TYPE = "Inspire";

function invErf(x: number): number {
    const a = (8 * (Math.PI - 3)) / (3 * Math.PI * (4 - Math.PI));
    const ln = Math.log(1 - x * x);
    const term = 2 / (Math.PI * a) + ln / 2;
    const inner = term * term - ln / a;
    const sign = x < 0 ? -1 : 1;
    return sign * Math.sqrt(Math.sqrt(inner) - term);
}

export const DecodeAdvancementConfig: AdvancementPointsConfig = {
    season: Season.Decode,
    tieBreakKeys: [
        TiebreakKey.TotalAdvancementPoints,
        TiebreakKey.JudgedAwardPoints,
        TiebreakKey.PlayoffAdvancementPoints,
        TiebreakKey.AllianceSelectionPoints,
        TiebreakKey.QualificationPhasePoints,
        TiebreakKey.AverageMatchPointsNp,
        TiebreakKey.AverageAutoPoints,
        TiebreakKey.MaxMatchPointsNp,
        TiebreakKey.SecondMatchPointsNp,
    ],

    calculateQualPoints: (rank: number, teamCount: number): number => {
        const num = teamCount - 2 * rank + 2;
        const denom = QUAL_ALPHA * teamCount;
        const scale = 7 / invErf(1 / QUAL_ALPHA);
        const val = Math.ceil(invErf(num / denom) * scale + 9);
        return Math.min(QUAL_POINTS_MAX, Math.max(QUAL_POINTS_MIN, val));
    },

    calculateAllianceSelectionPoints: (position: number): number => {
        return ALLIANCE_SELECTION_BASE - position;
    },

    getPlayoffPoints: (placement: 1 | 2 | 3 | 4): number => {
        return PLAYOFF_POINTS[placement] ?? 0;
    },

    getDivisionPlayoffPoints: (placement: 2 | 3): number => {
        return DIVISION_PLAYOFF_POINTS[placement] ?? 0;
    },

    getAwardPoints: (awardType: string, placement: 1 | 2 | 3): number => {
        if (!ADVANCEMENT_JUDGED_AWARD_TYPES.has(awardType)) {
            return 0;
        }
        if (awardType === INSPIRE_AWARD_TYPE) {
            return INSPIRE_POINTS[placement] ?? 0;
        }
        return OTHER_AWARD_POINTS[placement] ?? 0;
    },
};
