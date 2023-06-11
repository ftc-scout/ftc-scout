import { EntitySchema, MixedList } from "typeorm";
import { Team } from "./entities/Team";
import { Event } from "./entities/Event";
import { IS_DEV } from "../constants";
import { FtcApiReq } from "./entities/FtcApiReq";
import { DataHasBeenLoaded } from "./entities/DataHasBeenLoaded";
import { makeMatchScoresFromSeasonDescriptor } from "./entities/make-from-season-descriptor";
import { SEASON_DESCRIPTORS } from "@ftc-scout/common";

// HELP: Season Specific

let [schema2019, class2019] = makeMatchScoresFromSeasonDescriptor(SEASON_DESCRIPTORS[2019]);
let [schema2020, class2020] = makeMatchScoresFromSeasonDescriptor(SEASON_DESCRIPTORS[2020]);
let [schema2021, class2021] = makeMatchScoresFromSeasonDescriptor(SEASON_DESCRIPTORS[2021]);
let [schema2022, class2022] = makeMatchScoresFromSeasonDescriptor(SEASON_DESCRIPTORS[2022]);

let matchScoreSchemas = [schema2019, schema2020, schema2021, schema2022];

export let MatchScores = {
    [2019]: class2019,
    [2020]: class2020,
    [2021]: class2021,
    [2022]: class2022,
} as const;

export const DEV_ENTITIES: MixedList<string | Function | EntitySchema<any>> = [FtcApiReq];

export const ENTITIES: MixedList<string | Function | EntitySchema<any>> = [
    DataHasBeenLoaded,
    Team,
    Event,
    ...matchScoreSchemas,
    ...(IS_DEV ? DEV_ENTITIES : []),
];
