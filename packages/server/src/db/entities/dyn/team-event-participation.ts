import {
    ColumnNames,
    Columns,
    FreightFrenzyDescriptor,
    PowerPlayDescriptor,
    Season,
    SeasonDescriptor,
    SkystoneDescriptor,
    StrToColumnType,
    UltimateGoalDescriptor,
} from "@ftc-scout/common";
import { BaseEntity, EntitySchema } from "typeorm";
import { SubtypeClass, getTypeormType } from "./types";

export type TypeormRecord<T extends SeasonDescriptor> = {
    [K in ColumnNames<T>]: StrToColumnType<Extract<Columns<T>, { name: K }>["type"]>;
} & {
    season: Season;
    eventCode: string;
    teamNumber: number;
    createdAt: Date;
    updatedAt: Date;
};

function makeTep<T extends SeasonDescriptor>(
    descriptor: T
): [EntitySchema<TypeormRecord<T>>, SubtypeClass<typeof BaseEntity, TypeormRecord<T>>] {
    class Entity extends BaseEntity {}

    let entity = new EntitySchema<TypeormRecord<T>>({
        tableName: `tep_${descriptor.season}`,
        name: `tep_${descriptor.season}`,
        target: Entity,
        columns: getTepColumns(descriptor),
    });

    return [entity, Entity as any];
}

function getTepColumns<T extends SeasonDescriptor>(
    descriptor: T
): EntitySchema<TypeormRecord<T>>["options"]["columns"] {
    type Schema = EntitySchema<TypeormRecord<T>>;
    type ColumnNames = Columns<T>["name"];

    let typeormColumns: Schema["options"]["columns"] = {
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

    descriptor.columns.forEach((c) => {
        let name: ColumnNames = c.name;
        let type = getTypeormType(c.type);
        let nullable = descriptor.hasRemote && c.fromRemoteApi == undefined;
        typeormColumns[name] = { type, nullable };
    });

    return typeormColumns;
}

// HELP: Season Specific

let [tepSchema2019, tepClass2019] = makeTep(SkystoneDescriptor);
let [tepSchema2020, tepClass2020] = makeTep(UltimateGoalDescriptor);
let [tepSchema2021, tepClass2021] = makeTep(FreightFrenzyDescriptor);
let [tepSchema2022, tepClass2022] = makeTep(PowerPlayDescriptor);

export let tepSchemas = [tepSchema2019, tepSchema2020, tepSchema2021, tepSchema2022];

export let TeamEventParticipation = {
    [2019]: tepClass2019,
    [2020]: tepClass2020,
    [2021]: tepClass2021,
    [2022]: tepClass2022,
} as const;
