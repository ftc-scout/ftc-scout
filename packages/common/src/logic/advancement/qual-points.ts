import { QUAL_POINTS_MAX_2025, QUAL_POINTS_MIN_2025 } from "./points-2025";

// Inverse error function approximation (Abramowitz-Stegun 7.1.26)
function invErf(x: number): number {
    const a = (8 * (Math.PI - 3)) / (3 * Math.PI * (4 - Math.PI));
    const ln = Math.log(1 - x * x);
    const term = 2 / (Math.PI * a) + ln / 2;
    const inner = term * term - ln / a;
    const sign = x < 0 ? -1 : 1;
    return sign * Math.sqrt(Math.sqrt(inner) - term);
}

// 2025+ qualification phase performance points.
export function qualPoints2025(rank: number, teamCount: number): number {
    const alpha = 1.07;
    const num = teamCount - 2 * rank + 2;
    const denom = alpha * teamCount;
    const scale = 7 / invErf(1 / alpha);
    const val = Math.ceil(invErf(num / denom) * scale + 9);
    return Math.min(QUAL_POINTS_MAX_2025, Math.max(QUAL_POINTS_MIN_2025, val));
}
