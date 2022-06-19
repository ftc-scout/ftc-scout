import { EntitySchema, MixedList } from "typeorm";
import { FtcApiMetadata } from "./entities/FtcApiMetadata";
import { Team } from "./entities/Team";
import { User } from "./entities/User";
import { Event } from "./entities/Event";
import { TeamMatchParticipation } from "./entities/TeamMatchParticipation";
import { TeamEventParticipation } from "./entities/TeamEventParticipation";
import { Match } from "./entities/Match";
import { MatchScores2021 } from "./entities/MatchScores2021";

export const entities: MixedList<string | Function | EntitySchema<any>> = [
    User,
    Team,
    FtcApiMetadata,
    Event,
    Match,
    TeamMatchParticipation,
    TeamEventParticipation,
    MatchScores2021,
];
