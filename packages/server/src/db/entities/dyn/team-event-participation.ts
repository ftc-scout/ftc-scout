import { DESCRIPTORS_LIST, Descriptor, type Season } from "@ftc-scout/common";
import { EntitySchema, EntitySchemaColumnOptions, Repository } from "typeorm";
import { DATA_SOURCE } from "../../data-source";
import { AnyObject } from "../../../type-utils";

type BaseColumns = {
    season: Season;
    eventCode: string;
    teamNumber: number;
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

function makeTep(descriptor: Descriptor): EntitySchema<TeamEventParticipation> {
    let agg = getAggregateStatColumns(descriptor);

    return new EntitySchema<TeamEventParticipation>({
        tableName: `tep_${descriptor.season}`,
        name: `tep_${descriptor.season}`,
        columns: {
            season: {
                type: "smallint",
                primary: true,
            },
            eventCode: {
                type: "varchar",
                primary: true,
            },
            teamNumber: {
                type: "int",
                primary: true,
            },
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
            tot: { schema: agg },
            avg: { schema: agg },
            min: { schema: agg },
            max: { schema: agg },
            dev: { schema: agg },
            opr: { schema: agg },
        },
    });
}

function getAggregateStatColumns(descriptor: Descriptor): EntitySchema<any> {
    let columns: Record<string, EntitySchemaColumnOptions> = {};

    descriptor.columns.forEach((c) => {
        if (c.tep == undefined) return;
        columns[c.name] = { type: "float" };
        if (c.tep.individual != undefined) columns[c.name + "Individual"] = { type: "float" };
    });

    return new EntitySchema({
        name: `test${descriptor.season}`,
        columns,
    });
}

export let TeamEventParticipationSchemas = {} as Record<
    Season,
    EntitySchema<TeamEventParticipation>
>;
for (let d of DESCRIPTORS_LIST) {
    TeamEventParticipationSchemas[d.season] = makeTep(d);
}

export type TeamEventParticipation = BaseColumns & AnyObject;
export let TeamEventParticipation = {} as Record<Season, Repository<TeamEventParticipation>>;

export function initTep() {
    for (let d of DESCRIPTORS_LIST) {
        TeamEventParticipation[d.season] = DATA_SOURCE.getRepository(
            TeamEventParticipationSchemas[d.season]
        );
    }
}
