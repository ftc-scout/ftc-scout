import { DESCRIPTORS_LIST, Descriptor, type Season } from "@ftc-scout/common";
import { EntitySchema, EntitySchemaColumnOptions, Repository } from "typeorm";
import { DATA_SOURCE } from "../../data-source";
import { AnyObject } from "../../../type-utils";

type BaseColumns = {
    season: Season;
    eventCode: string;
    teamNumber: number;
    createdAt: Date;
    updatedAt: Date;
};

function makeTep(descriptor: Descriptor): EntitySchema<TeamEventParticipation> {
    return new EntitySchema<TeamEventParticipation>({
        tableName: `tep_${descriptor.season}`,
        name: `tep_${descriptor.season}`,
        columns: getTepColumns(),
    });
}

function getTepColumns(): Record<string, EntitySchemaColumnOptions> {
    let typeormColumns: Record<keyof BaseColumns, EntitySchemaColumnOptions> = {
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
        createdAt: {
            type: "timestamptz",
            createDate: true,
        },
        updatedAt: {
            type: "timestamptz",
            updateDate: true,
        },
    };

    return typeormColumns;
}

// HELP: Season Specific

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
