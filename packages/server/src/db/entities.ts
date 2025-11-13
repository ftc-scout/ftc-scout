import { EntitySchema, MixedList } from "typeorm";
import { Team } from "./entities/Team";
import { Event } from "./entities/Event";
import { IS_DEV } from "../constants";
import { FtcApiReq } from "./entities/FtcApiReq";
import { DataHasBeenLoaded } from "./entities/DataHasBeenLoaded";
import { MatchScoreSchemas } from "./entities/dyn/match-score";
import { Match } from "./entities/Match";
import { TeamMatchParticipation } from "./entities/TeamMatchParticipation";
import { Award } from "./entities/Award";
import { TeamEventParticipationSchemas } from "./entities/dyn/team-event-participation";
import { ApiReq } from "./entities/ApiReq";
import { Analytics } from "./entities/Analytics";
import { League } from "./entities/League";
import { LeagueTeam } from "./entities/LeagueTeam";
import { LeagueRankingSchemas } from "./entities/dyn/league-ranking";
import { BestName } from "./entities/BestName";

export const DEV_ENTITIES: MixedList<string | Function | EntitySchema<any>> = [FtcApiReq];

export const ENTITIES: MixedList<string | Function | EntitySchema<any>> = [
    DataHasBeenLoaded,
    Team,
    Event,
    Award,
    League,
    LeagueTeam,
    Match,
    TeamMatchParticipation,
    ...Object.values(MatchScoreSchemas),
    ...Object.values(TeamEventParticipationSchemas),
    ...Object.values(LeagueRankingSchemas),
    BestName,
    ApiReq,
    Analytics,
    ...(IS_DEV ? DEV_ENTITIES : []),
];
