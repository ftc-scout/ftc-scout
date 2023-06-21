import {
    Alliance,
    ColumnNames,
    Columns,
    FreightFrenzyDescriptor,
    MatchScoresFtcApi,
    PowerPlayDescriptor,
    SEASON_DESCRIPTORS,
    Season,
    SeasonDescriptor,
    SkystoneDescriptor,
    StrToColumnType,
    UltimateGoalDescriptor,
} from "@ftc-scout/common";
import { BaseEntity, EntitySchema } from "typeorm";
import { SubtypeClass, getTypeormType } from "./types";
import { Match } from "../Match";

export type TypeormRecord<T extends SeasonDescriptor> = {
    [K in ColumnNames<T>]: StrToColumnType<Extract<Columns<T>, { name: K }>["type"]>;
} & {
    season: Season;
    eventCode: string;
    matchId: number;
    alliance: Alliance;
    createdAt: Date;
    updatedAt: Date;
};

function makeMatchScore<T extends SeasonDescriptor>(
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
        alliance: {
            type: "enum",
            enum: Alliance,
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
        let nullable = !!c.tradOnly;
        typeormColumns[name] = { type, nullable };
    });

    return typeormColumns;
}

// HELP: Season Specific

let [msSchema2019, msClass2019] = makeMatchScore(SkystoneDescriptor);
let [msSchema2020, msClass2020] = makeMatchScore(UltimateGoalDescriptor);
let [msSchema2021, msClass2021] = makeMatchScore(FreightFrenzyDescriptor);
let [msSchema2022, msClass2022] = makeMatchScore(PowerPlayDescriptor);

export let matchScoreSchemas = [msSchema2019, msSchema2020, msSchema2021, msSchema2022];

export type MatchScore = SubtypeClass<typeof BaseEntity, TypeormRecord<SeasonDescriptor>>;
export let MatchScore = {
    [2019]: msClass2019,
    [2020]: msClass2020,
    [2021]: msClass2021,
    [2022]: msClass2022,

    fromApi(api: MatchScoresFtcApi, match: Match, remote: boolean): MatchScore[] {
        return ("scores" in api ? [api.scores] : api.alliances).map((s) => {
            type Ret = Partial<TypeormRecord<SeasonDescriptor>>;
            let score: Ret = {
                season: match.eventSeason,
                eventCode: match.eventCode,
                matchId: match.id,
                alliance: "alliance" in s ? s.alliance : Alliance.Solo,
            };

            let descriptor = SEASON_DESCRIPTORS[match.eventSeason];
            for (let column of descriptor.columns) {
                let value =
                    remote && "fromRemoteApi" in column
                        ? column.fromRemoteApi(s)
                        : column.fromTradApi(s);
                score[column.name] = value;
            }

            return MatchScore[match.eventSeason].create(score) as any;
        });
    },
} as const;
