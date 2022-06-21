import { NonEmptyArray } from "type-graphql";
import { EventResolver } from "./EventResolver";
import { MatchResolver } from "./MatchResolver";
import { TeamResolver } from "./TeamResolver";
import { UserResolver } from "./UserResolver";

export const resolvers: NonEmptyArray<Function> = [
    UserResolver,
    TeamResolver,
    MatchResolver,
    EventResolver,
];
