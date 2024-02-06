import {
    Alliance,
    DESCRIPTORS,
    DESCRIPTORS_LIST,
    Descriptor,
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

type KnownColumns = {
    totalPoints: number;
    totalPointsNp: number;
};

function makeMatchScore(descriptor: Descriptor): EntitySchema<MatchScore> {
    return new EntitySchema<MatchScore>({
        tableName: `match_score_${descriptor.season}`,
        name: `match_score_${descriptor.season}`,
        columns: getMatchScoreColumns(descriptor),
    });
}

function getMatchScoreColumns(descriptor: Descriptor): Record<string, EntitySchemaColumnOptions> {
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
            enumName: "alliance_enum",
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
    descriptor.msColumns().forEach((c) => {
        extraColumns[c.dbColName] = {
            ...c.dataTy.typeorm,
            nullable: c.tradOnly,
        };
    });

    return { ...baseColumns, ...extraColumns };
}

export let MatchScoreSchemas = {} as Record<Season, EntitySchema<MatchScore>>;
for (let d of DESCRIPTORS_LIST) {
    MatchScoreSchemas[d.season] = makeMatchScore(d);
}

export type MatchScore = BaseColumns & KnownColumns & AnyObject;
export let MatchScore = {} as Record<Season, Repository<MatchScore>> & {
    fromApi(api: MatchScoresFtcApi, match: Match, remote: boolean): MatchScore[];
};

export function initMS() {
    for (let d of DESCRIPTORS_LIST) {
        MatchScore[d.season] = DATA_SOURCE.getRepository(MatchScoreSchemas[d.season]);
    }

    MatchScore.fromApi = (api: MatchScoresFtcApi, match: Match, remote: boolean): MatchScore[] => {
        let scores = "scores" in api ? [api.scores] : api.alliances;
        return scores.map((s, i) => {
            let other = scores.length == 2 ? scores[1 - i] : null;

            type Ret = Partial<BaseColumns> & Record<string, any>;

            let dbScore: Ret = {
                season: match.eventSeason,
                eventCode: match.eventCode,
                matchId: match.id,
                alliance: "alliance" in s ? s.alliance : Alliance.Solo,
            };
            let apiScore = {
                season: match.eventSeason,
                eventCode: match.eventCode,
                matchId: match.id,
                alliance: "alliance" in s ? s.alliance : Alliance.Solo,
            };

            let descriptor = DESCRIPTORS[match.eventSeason];
            for (let column of descriptor.msColumns()) {
                column.addSelfFromApi(s, other, dbScore, apiScore, remote);
            }

            return MatchScore[match.eventSeason].create(dbScore);
        });
    };
}
