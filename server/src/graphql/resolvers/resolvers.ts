import { NonEmptyArray } from "type-graphql";
import { AwardResolver } from "./AwardResolver";
import { EventResolver } from "./EventResolver";
import { HomePageResolver } from "./HomePageResolver";
import { MatchResolver } from "./MatchResolver";
import { MatchSeasonRecords2021Resolver } from "./records.ts/MatchSeasonRecords2021";
import { TeamSeasonRecords2019Resolver } from "./records.ts/TeamSeasonRecords2019";
import { TeamSeasonRecords2021Resolver } from "./records.ts/TeamSeasonRecords2021";
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
    TeamSeasonRecords2021Resolver,
    MatchSeasonRecords2021Resolver,
    TeamSeasonRecords2019Resolver,
    HomePageResolver,
];
