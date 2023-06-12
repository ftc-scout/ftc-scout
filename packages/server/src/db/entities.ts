import { EntitySchema, MixedList } from "typeorm";
import { Team } from "./entities/Team";
import { Event } from "./entities/Event";
import { IS_DEV } from "../constants";
import { FtcApiReq } from "./entities/FtcApiReq";
import { DataHasBeenLoaded } from "./entities/DataHasBeenLoaded";
import { makeMatchScore } from "./entities/dyn/match-score";
import { SEASON_DESCRIPTORS } from "@ftc-scout/common";
import { Match } from "./entities/Match";
import { makeTep } from "./entities/dyn/team-event-participation";

// HELP: Season Specific

let [msSchema2019, msClass2019] = makeMatchScore(SEASON_DESCRIPTORS[2019]);
let [msSchema2020, msClass2020] = makeMatchScore(SEASON_DESCRIPTORS[2020]);
let [msSchema2021, msClass2021] = makeMatchScore(SEASON_DESCRIPTORS[2021]);
let [msSchema2022, msClass2022] = makeMatchScore(SEASON_DESCRIPTORS[2022]);

let matchScoreSchemas = [msSchema2019, msSchema2020, msSchema2021, msSchema2022];

export let MatchScore = {
    [2019]: msClass2019,
    [2020]: msClass2020,
    [2021]: msClass2021,
    [2022]: msClass2022,
} as const;

let [tepSchema2019, tepClass2019] = makeTep(SEASON_DESCRIPTORS[2019]);
let [tepSchema2020, tepClass2020] = makeTep(SEASON_DESCRIPTORS[2020]);
let [tepSchema2021, tepClass2021] = makeTep(SEASON_DESCRIPTORS[2021]);
let [tepSchema2022, tepClass2022] = makeTep(SEASON_DESCRIPTORS[2022]);

let tepSchemas = [tepSchema2019, tepSchema2020, tepSchema2021, tepSchema2022];

export let TeamEventParticipation = {
    [2019]: tepClass2019,
    [2020]: tepClass2020,
    [2021]: tepClass2021,
    [2022]: tepClass2022,
} as const;

export const DEV_ENTITIES: MixedList<string | Function | EntitySchema<any>> = [FtcApiReq];

export const ENTITIES: MixedList<string | Function | EntitySchema<any>> = [
    DataHasBeenLoaded,
    Team,
    Event,
    Match,
    ...matchScoreSchemas,
    ...tepSchemas,
    ...(IS_DEV ? DEV_ENTITIES : []),
];
