import { EntitySchema, MixedList } from "typeorm";
import { Team } from "./entities/Team";
import { Event } from "./entities/Event";
import { IS_DEV } from "../constants";
import { FtcApiReq } from "./entities/FtcApiReq";
import { DataHasBeenLoaded } from "./entities/DataHasBeenLoaded";
import { matchScoreSchemas } from "./entities/dyn/match-score";
import { Match } from "./entities/Match";
import { tepSchemas } from "./entities/dyn/team-event-participation";
import { TeamMatchParticipation } from "./entities/TeamMatchParticipation";
import { Award } from "./entities/Award";

export const DEV_ENTITIES: MixedList<string | Function | EntitySchema<any>> = [FtcApiReq];

export const ENTITIES: MixedList<string | Function | EntitySchema<any>> = [
    DataHasBeenLoaded,
    Team,
    Event,
    Award,
    Match,
    TeamMatchParticipation,
    ...matchScoreSchemas,
    ...tepSchemas,
    ...(IS_DEV ? DEV_ENTITIES : []),
];
