import { ColumnNames, Columns, Season, SeasonDescriptor } from "@ftc-scout/common";
import { BaseEntity, EntitySchema } from "typeorm";
import { StrToColumnType, SubtypeClass, getTypeormType } from "./types";

export type TypeormRecord<T extends SeasonDescriptor> = {
    [K in ColumnNames<T>]: StrToColumnType<Extract<Columns<T>, { name: K }>["type"]>;
} & {
    season: Season;
    eventCode: string;
    teamNumber: number;
    createdAt: Date;
    updatedAt: Date;
};

export function makeTep<T extends SeasonDescriptor>(
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
        typeormColumns[name] = { type };
    });

    return typeormColumns;
}
