import {
    Alliance,
    MS_TABLE_DESCRIPTORS,
    MatchScoreTD2019,
    MatchScoreTD2020,
    MatchScoreTD2021,
    MatchScoreTD2022,
    MatchScoreTableDescriptor,
    MatchScoresFtcApi,
    Season,
} from "@ftc-scout/common";
import { EntitySchema, EntitySchemaColumnOptions, Repository } from "typeorm";
import { Match } from "../Match";
import { DATA_SOURCE } from "../../data-source";
import { AnyObject } from "../../../type-utils";

type BaseColumns = {
    season: Season;
    eventCode: string;
    matchId: number;
    alliance: Alliance;
    createdAt: Date;
    updatedAt: Date;
};

function makeMatchScore<TrScore, RemScore>(
    descriptor: MatchScoreTableDescriptor<TrScore, RemScore>
): EntitySchema<MatchScore> {
    return new EntitySchema<MatchScore>({
        tableName: `match_score_${descriptor.season}`,
        name: `match_score_${descriptor.season}`,
        columns: getMatchScoreColumns(descriptor.season),
    });
}

function getMatchScoreColumns(season: Season): Record<string, EntitySchemaColumnOptions> {
    let baseColumns: Record<keyof BaseColumns, EntitySchemaColumnOptions> = {
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

    let extraColumns: Record<string, EntitySchemaColumnOptions> = {};
    MS_TABLE_DESCRIPTORS[season].columns.forEach((c) => {
        extraColumns[c.name] = {
            type: c.ty,
            nullable: !!c.tradOnly,
        };
    });

    return { ...baseColumns, ...extraColumns };
}

// HELP: Season Specific

let msSchema2019 = makeMatchScore(MatchScoreTD2019);
let msSchema2020 = makeMatchScore(MatchScoreTD2020);
let msSchema2021 = makeMatchScore(MatchScoreTD2021);
let msSchema2022 = makeMatchScore(MatchScoreTD2022);

export let MatchScoreSchemas = {
    [2019]: msSchema2019,
    [2020]: msSchema2020,
    [2021]: msSchema2021,
    [2022]: msSchema2022,
};

export type MatchScore = BaseColumns & AnyObject;
export let MatchScore: {
    [s in Season]: Repository<MatchScore>;
} & {
    fromApi(api: MatchScoresFtcApi, match: Match, remote: boolean): MatchScore[];
};

export function initMS() {
    MatchScore = {
        [2019]: DATA_SOURCE.getRepository(msSchema2019),
        [2020]: DATA_SOURCE.getRepository(msSchema2020),
        [2021]: DATA_SOURCE.getRepository(msSchema2021),
        [2022]: DATA_SOURCE.getRepository(msSchema2022),

        fromApi(api: MatchScoresFtcApi, match: Match, remote: boolean): MatchScore[] {
            return ("scores" in api ? [api.scores] : api.alliances).map((s) => {
                type Ret = Partial<BaseColumns> & Record<string, any>;

                let score: Ret = {
                    season: match.eventSeason,
                    eventCode: match.eventCode,
                    matchId: match.id,
                    alliance: "alliance" in s ? s.alliance : Alliance.Solo,
                };

                let descriptor = MS_TABLE_DESCRIPTORS[match.eventSeason];
                for (let column of descriptor.columns) {
                    let value =
                        remote && "fromRemoteApi" in column
                            ? column.fromRemoteApi(s)
                            : column.fromApi(s as any);
                    score[column.name] = value;
                }

                return MatchScore[match.eventSeason].create(score);
            });
        },
    };
}
