import { NonEmptyArray } from "type-graphql";
import { AwardResolver } from "./AwardResolver";
import { EventResolver } from "./EventResolver";
import { MatchResolver } from "./MatchResolver";
import { SeasonRecords2021Resolver } from "./records.ts/SeasonRecords2021";
import { SearchResolver } from "./SearchResolver";
import { TeamEventParticipationResolver } from "./TeamEventParticipationResolver";
import { TeamResolver } from "./TeamResolver";
import { UserResolver } from "./UserResolver";

export const resolvers: NonEmptyArray<Function> = [
    UserResolver,
    TeamResolver,
    MatchResolver,
    EventResolver,
    AwardResolver,
    SearchResolver,
    TeamEventParticipationResolver,
    SeasonRecords2021Resolver,
];
