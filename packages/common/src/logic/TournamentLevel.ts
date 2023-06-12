export const TournamentLevel = {
    Quals: "Quals",
    Semis: "Semis",
    Finals: "Finals",
};

export type TournamentLevel = (typeof TournamentLevel)[keyof typeof TournamentLevel];

export function tournamentLevelFromFtcApi(
    str: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF"
): TournamentLevel {
    return {
        OTHER: TournamentLevel.Quals,
        QUALIFICATION: TournamentLevel.Quals,
        SEMIFINAL: TournamentLevel.Semis,
        FINAL: TournamentLevel.Finals,
        PLAYOFF: TournamentLevel.Finals,
    }[str];
}
