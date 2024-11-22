export const TournamentLevel = {
    Quals: "Quals",
    Semis: "Semis",
    Finals: "Finals",
    DoubleElim: "DoubleElim",
} as const;
export type TournamentLevel = (typeof TournamentLevel)[keyof typeof TournamentLevel];

export function tournamentLevelFromFtcApi(
    str: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF"
): TournamentLevel {
    return {
        OTHER: TournamentLevel.Quals,
        QUALIFICATION: TournamentLevel.Quals,
        SEMIFINAL: TournamentLevel.Semis,
        FINAL: TournamentLevel.Finals,
        PLAYOFF: TournamentLevel.DoubleElim,
    }[str];
}

export function tournamentLevelValue(level: TournamentLevel): number {
    switch (level) {
        case TournamentLevel.Quals:
            return 0;
        case TournamentLevel.Semis:
            return 1;
        default:
            return 2;
    }
}
