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

export const entities: MixedList<string | Function | EntitySchema<any>> = [
    Team,
    FtcApiMetadata,
    Event,
    Match,
    TeamMatchParticipation,
    TeamEventParticipation2021,
    TeamEventParticipation2019,
    MatchScores2021,
    MatchScores2019,
    Award,
];
