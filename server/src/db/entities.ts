import { EntitySchema, MixedList } from "typeorm";
import { User } from "./entities/User";

export const entities: MixedList<string | Function | EntitySchema<any>> = [
    User,
];
