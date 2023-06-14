import { ColumnNames, Columns, Season, SeasonDescriptor, StrToColumnType } from "@ftc-scout/common";
import { BaseEntity, EntitySchema } from "typeorm";
import { SubtypeClass, getTypeormType } from "./types";

export type TypeormRecord<T extends SeasonDescriptor> = {
    [K in ColumnNames<T>]: StrToColumnType<Extract<Columns<T>, { name: K }>["type"]>;
} & {
    season: Season;
    eventCode: string;
    matchId: number;
    createdAt: Date;
    updatedAt: Date;
};

export function makeMatchScore<T extends SeasonDescriptor>(
    descriptor: T
): [EntitySchema<TypeormRecord<T>>, SubtypeClass<typeof BaseEntity, TypeormRecord<T>>] {
    class Entity extends BaseEntity {}

    let entity = new EntitySchema<TypeormRecord<T>>({
        tableName: `match_score_${descriptor.season}`,
        name: `match_score_${descriptor.season}`,
        target: Entity,
        columns: getMatchScoreColumns(descriptor),
    });

    return [entity, Entity as any];
}

function getMatchScoreColumns<T extends SeasonDescriptor>(
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
        matchId: {
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
