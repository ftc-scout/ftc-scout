import { ColumnNames, ColumnTypeStr, Columns, SeasonDescriptor } from "@ftc-scout/common";
import { BaseEntity, ColumnType, EntitySchema } from "typeorm";

type InstanceTypeable = abstract new (...args: any) => any;
export type SubtypeClass<Super extends InstanceTypeable, Props> = Super &
    (new () => InstanceType<Super> & Props);

type StrToColumnType<T extends ColumnTypeStr> = T extends "int"
    ? number
    : T extends "string"
    ? string
    : T extends "bool"
    ? boolean
    : never;

export type TypeormRecord<T extends SeasonDescriptor> = {
    [K in ColumnNames<T>]: StrToColumnType<Extract<Columns<T>, { name: K }>["type"]>;
} & {
    id: number;
};

export function makeMatchScoresFromSeasonDescriptor<T extends SeasonDescriptor>(
    descriptor: T
): [EntitySchema<TypeormRecord<T>>, SubtypeClass<typeof BaseEntity, TypeormRecord<T>>] {
    class Entity extends BaseEntity {}

    let entity = new EntitySchema<TypeormRecord<T>>({
        tableName: `MatchScores${descriptor.season}`,
        name: `MatchScores${descriptor.season}`,
        target: Entity,
        columns: getColumns(descriptor),
    });

    return [entity, Entity as any];
}

function getColumns<T extends SeasonDescriptor>(
    descriptor: T
): EntitySchema<TypeormRecord<T>>["options"]["columns"] {
    type Schema = EntitySchema<TypeormRecord<T>>;
    type ColumnNames = Columns<T>["name"];

    let typeormColumns: Schema["options"]["columns"] = {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
    };

    descriptor.columns.forEach((c) => {
        let name: ColumnNames = c.name;
        let type = getTypeormType(c.type);
        typeormColumns[name] = { type };
    });

    return typeormColumns;
}

function getTypeormType(strTy: ColumnTypeStr): ColumnType {
    switch (strTy) {
        case "string":
            return "varchar";
        case "int":
            return "int";
        case "bool":
            return "boolean";
    }
}
