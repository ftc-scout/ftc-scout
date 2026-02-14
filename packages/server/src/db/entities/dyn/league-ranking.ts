import { DESCRIPTORS_LIST, Descriptor, type Season } from "@ftc-scout/common";
import {
    EntitySchema,
    EntitySchemaColumnOptions,
    NamingStrategyInterface,
    Repository,
} from "typeorm";
import { DATA_SOURCE } from "../../data-source";
import { AnyObject } from "../../../type-utils";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

type BaseColumns = {
    season: Season;
    leagueCode: string;
    regionCode: string;
    teamNumber: number;
    isRemote: boolean;
    rank: number;
    rp: number;
    tb1: number;
    tb2: number;
    wins: number;
    losses: number;
    ties: number;
    dqs: number;
    qualMatchesPlayed: number;
    hasStats: boolean;
    createdAt: Date;
    updatedAt: Date;
};

const ns = new SnakeNamingStrategy() as NamingStrategyInterface;

function makeLeagueRankingSchema(descriptor: Descriptor): EntitySchema<LeagueRanking> {
    let aggregates = getAggregateStatColumns(descriptor);

    return new EntitySchema<LeagueRanking>({
        tableName: `league_ranking_${descriptor.season}`,
        name: `league_ranking_${descriptor.season}`,
        columns: {
            season: {
                type: "smallint",
                primary: true,
            },
            leagueCode: {
                type: "varchar",
                primary: true,
            },
            regionCode: {
                type: "varchar",
                primary: true,
            },
            teamNumber: {
                type: "int",
                primary: true,
            },
            isRemote: { type: "bool" },
            rank: { type: "int" },
            rp: { type: "float" },
            tb1: { type: "float" },
            tb2: { type: "float" },
            wins: { type: "int" },
            losses: { type: "int" },
            ties: { type: "int" },
            dqs: { type: "int" },
            qualMatchesPlayed: { type: "int" },
            hasStats: { type: "bool" },
            createdAt: {
                type: "timestamptz",
                createDate: true,
            },
            updatedAt: {
                type: "timestamptz",
                updateDate: true,
            },
        },
        embeddeds: {
            tot: { schema: aggregates },
            avg: { schema: aggregates },
            min: { schema: aggregates },
            max: { schema: aggregates },
            dev: { schema: aggregates },
            opr: { schema: aggregates },
        },
        checks: [
            { expression: "rp <> 'NaN'" },
            { expression: "tb1 <> 'NaN'" },
            { expression: "tb2 <> 'NaN'" },
            ...descriptor.tepColumns().flatMap((c) => {
                return [
                    { expression: `${ns.columnName(c.dbName, undefined, ["tot"])} <> 'NaN'` },
                    { expression: `${ns.columnName(c.dbName, undefined, ["avg"])} <> 'NaN'` },
                    { expression: `${ns.columnName(c.dbName, undefined, ["min"])} <> 'NaN'` },
                    { expression: `${ns.columnName(c.dbName, undefined, ["max"])} <> 'NaN'` },
                    { expression: `${ns.columnName(c.dbName, undefined, ["dev"])} <> 'NaN'` },
                    { expression: `${ns.columnName(c.dbName, undefined, ["opr"])} <> 'NaN'` },
                ];
            }),
        ],
    });
}

function getAggregateStatColumns(descriptor: Descriptor): EntitySchema<any> {
    let columns: Record<string, EntitySchemaColumnOptions> = {};

    descriptor.tepColumns().forEach((c) => {
        columns[c.dbName] = { type: "float", nullable: true };
    });

    return new EntitySchema({
        name: `league_${descriptor.season}_stats`,
        columns,
    });
}

export let LeagueRankingSchemas = {} as Record<Season, EntitySchema<LeagueRanking>>;
for (let descriptor of DESCRIPTORS_LIST) {
    LeagueRankingSchemas[descriptor.season] = makeLeagueRankingSchema(descriptor);
}

export type LeagueRanking = BaseColumns & AnyObject;
export let LeagueRanking = {} as Record<Season, Repository<LeagueRanking>>;

export function initLeagueRanking() {
    for (let descriptor of DESCRIPTORS_LIST) {
        LeagueRanking[descriptor.season] = DATA_SOURCE.getRepository(
            LeagueRankingSchemas[descriptor.season]
        );
    }
}
