import { EntitySchema, MixedList } from "typeorm";
import { FtcApiMetadata } from "./entities/FtcApiMetadata";
import { Team } from "./entities/Team";
import { Event } from "./entities/Event";
import { TeamMatchParticipation } from "./entities/TeamMatchParticipation";
import { TeamEventParticipation2021 } from "./entities/team-event-participation/TeamEventParticipation2021";
import { Match } from "./entities/Match";
import { MatchScores2021 } from "./entities/MatchScores2021";
import { Award } from "./entities/Award";
import { TeamEventParticipation2019 } from "./entities/team-event-participation/TeamEventParticipation2019";
import { MatchScores2019 } from "./entities/MatchScores2019";
import { ApiReq } from "./entities/ApiReq";
import { TeamEventParticipation2020 } from "./entities/team-event-participation/TeamEventParticipation2020";
import { MatchScores2020 } from "./entities/MatchScores2020";

export const entities: MixedList<string | Function | EntitySchema<any>> = [
    Team,
    FtcApiMetadata,
    Event,
    Match,
    TeamMatchParticipation,
    TeamEventParticipation2021,
    TeamEventParticipation2020,
    TeamEventParticipation2019,
    MatchScores2021,
    MatchScores2020,
    MatchScores2019,
    Award,
    ApiReq,
];
