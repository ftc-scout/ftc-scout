import { registerEnumType } from "type-graphql";

export enum TournamentLevel {
    QUALS = 0,
    SEMIS = 1,
    FINALS = 2,
}

export function tournamentLevelFromApi(
    str: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF"
): TournamentLevel {
    return {
        OTHER: TournamentLevel.QUALS,
        QUALIFICATION: TournamentLevel.QUALS,
        SEMIFINAL: TournamentLevel.SEMIS,
        FINAL: TournamentLevel.FINALS,
        PLAYOFF: TournamentLevel.FINALS,
    }[str];
}

registerEnumType(TournamentLevel, {
    name: "TournamentLevel",
});
