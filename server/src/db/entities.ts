import { EntitySchema, MixedList } from "typeorm";
import { Team } from "./entities/Team";
import { User } from "./entities/User";

export const entities: MixedList<string | Function | EntitySchema<any>> = [
    User,
    Team,
];
