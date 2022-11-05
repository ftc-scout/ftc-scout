import { NonEmptyArray } from "type-graphql";
import { AwardResolver } from "./AwardResolver";
import { EventResolver } from "./EventResolver";
import { HomePageResolver } from "./HomePageResolver";
import { MatchResolver } from "./MatchResolver";
import { MatchSeasonRecords2019Resolver } from "./records.ts/MatchSeasonRecords2019";
import { MatchSeasonRecords2020Resolver } from "./records.ts/MatchSeasonRecords2020";
import { MatchSeasonRecords2021Resolver } from "./records.ts/MatchSeasonRecords2021";
import { MatchSeasonRecords2022Resolver } from "./records.ts/MatchSeasonRecords2022";
import { TeamSeasonRecords2019Resolver } from "./records.ts/TeamSeasonRecords2019";
import { TeamSeasonRecords2020Resolver } from "./records.ts/TeamSeasonRecords2020";
import { TeamSeasonRecords2021Resolver } from "./records.ts/TeamSeasonRecords2021";
import { TeamSeasonRecords2022Resolver } from "./records.ts/TeamSeasonRecords2022";
import { Scores2019Resolver } from "./scores/Scores2019Resolver";
import { Scores2020RemoteResolver, Scores2020TradResolver } from "./scores/Scores2020Resolver";
import { Scores2021RemoteResolver, Scores2021TradResolver } from "./scores/Scores2021Resolver";
import { Scores2022Resolver } from "./scores/Scores2022Resolver";
import { SearchResolver } from "./SearchResolver";
import { TeamEventParticipationResolver } from "./TeamEventParticipationResolver";
import { TeamMatchParticipationResolver } from "./TeamMatchParticipation";
import { TeamResolver } from "./TeamResolver";

export const resolvers: NonEmptyArray<Function> = [
    TeamResolver,
    MatchResolver,
    EventResolver,
    AwardResolver,
    SearchResolver,
    TeamEventParticipationResolver,
    TeamSeasonRecords2022Resolver,
    MatchSeasonRecords2022Resolver,
    TeamSeasonRecords2021Resolver,
    MatchSeasonRecords2021Resolver,
    TeamSeasonRecords2020Resolver,
    MatchSeasonRecords2020Resolver,
    TeamSeasonRecords2019Resolver,
    MatchSeasonRecords2019Resolver,
    HomePageResolver,
    Scores2022Resolver,
    Scores2021TradResolver,
    Scores2021RemoteResolver,
    Scores2020TradResolver,
    Scores2020RemoteResolver,
    Scores2019Resolver,
    TeamMatchParticipationResolver,
];
