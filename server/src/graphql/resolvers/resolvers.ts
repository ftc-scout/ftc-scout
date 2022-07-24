import { NonEmptyArray } from "type-graphql";
import { AwardResolver } from "./AwardResolver";
import { EventResolver } from "./EventResolver";
import { MatchResolver } from "./MatchResolver";
import { SearchResolver } from "./SearchResolver";
import { TeamEventParticipation2021Resolver } from "./TeamEventParticipation2021Resolver";
import { TeamResolver } from "./TeamResolver";
import { UserResolver } from "./UserResolver";

export const resolvers: NonEmptyArray<Function> = [
    UserResolver,
    TeamResolver,
    MatchResolver,
    EventResolver,
    AwardResolver,
    SearchResolver,
    TeamEventParticipation2021Resolver,
];
