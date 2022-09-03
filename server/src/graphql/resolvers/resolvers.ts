import { NonEmptyArray } from "type-graphql";
import { AwardResolver } from "./AwardResolver";
import { EventResolver } from "./EventResolver";
import { HomePageResolver } from "./HomePageResolver";
import { MatchResolver } from "./MatchResolver";
import { SeasonRecords2019Resolver } from "./records.ts/SeasonRecords2019";
import { SeasonRecords2021Resolver } from "./records.ts/SeasonRecords2021";
import { SearchResolver } from "./SearchResolver";
import { TeamEventParticipationResolver } from "./TeamEventParticipationResolver";
import { TeamResolver } from "./TeamResolver";

export const resolvers: NonEmptyArray<Function> = [
    TeamResolver,
    MatchResolver,
    EventResolver,
    AwardResolver,
    SearchResolver,
    TeamEventParticipationResolver,
    SeasonRecords2021Resolver,
    SeasonRecords2019Resolver,
    HomePageResolver,
];
