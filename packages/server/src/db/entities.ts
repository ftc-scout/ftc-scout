import { EntitySchema, MixedList } from "typeorm";
import { Team } from "./entities/Team";
import { IS_DEV } from "../constants";
import { FtcApiReq } from "./entities/FtcApiReq";
import { DataHasBeenLoaded } from "./entities/DataHasBeenLoaded";

export const DEV_ENTITIES: MixedList<string | Function | EntitySchema<any>> = [FtcApiReq];

export const ENTITIES: MixedList<string | Function | EntitySchema<any>> = [
    DataHasBeenLoaded,
    Team,
    ...(IS_DEV ? DEV_ENTITIES : []),
];
