import { EntitySchema, MixedList } from "typeorm";
import { FtcApiMetadata } from "./entities/FtcApiMetadata";
import { Team } from "./entities/Team";
import { User } from "./entities/User";
import { Event } from "./entities/Event";

export const entities: MixedList<string | Function | EntitySchema<any>> = [
    User,
    Team,
    FtcApiMetadata,
    Event,
];
