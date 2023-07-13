import {
    type Season,
    SeasonDescriptor,
    SeasonDescriptor2019,
    SeasonDescriptor2020,
    SeasonDescriptor2021,
    SeasonDescriptor2022,
} from "@ftc-scout/common";
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

function makeTep(descriptor: SeasonDescriptor): EntitySchema<TeamEventParticipation> {
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

let tepSchema2019 = makeTep(SeasonDescriptor2019);
let tepSchema2020 = makeTep(SeasonDescriptor2020);
let tepSchema2021 = makeTep(SeasonDescriptor2021);
let tepSchema2022 = makeTep(SeasonDescriptor2022);

export let tepSchemas = [tepSchema2019, tepSchema2020, tepSchema2021, tepSchema2022];

export type TeamEventParticipation = BaseColumns & AnyObject;
export let TeamEventParticipation: {
    [s in Season]: Repository<TeamEventParticipation>;
};

export function initTep() {
    TeamEventParticipation = {
        [2019]: DATA_SOURCE.getRepository(tepSchema2019),
        [2020]: DATA_SOURCE.getRepository(tepSchema2020),
        [2021]: DATA_SOURCE.getRepository(tepSchema2021),
        [2022]: DATA_SOURCE.getRepository(tepSchema2022),
    };
}
