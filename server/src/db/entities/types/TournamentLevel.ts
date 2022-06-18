import { registerEnumType } from "type-graphql";

export enum TournamentLevel {
    QUALS = 0,
    SEMIS = 1,
    FINALS = 2,
}

registerEnumType(TournamentLevel, {
    name: "TournamentLevel",
});
