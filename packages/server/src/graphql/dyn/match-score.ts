import {
    Alliance,
    MS_TABLE_DESCRIPTORS,
    MatchScoreTableDescriptor,
    SEASON_DESCRIPTORS,
} from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { typeormTypeToGraphQLType } from "./db-to-api-type";
import { IntTy, StrTy, nn } from "../utils";
import { AllianceGQL } from "../resolvers/enums";
import { MatchScore } from "../../db/entities/dyn/match-score";
import { AnyObject } from "../../type-utils";

export function makeMatchScoreTys(
    descriptor: MatchScoreTableDescriptor<any, any, any>
): [GraphQLObjectType, GraphQLObjectType, GraphQLObjectType | null] {
    return [...makeMSTysTrad(descriptor), makeMSTysRemote(descriptor)];
}

export function frontendMSFromDB(ms: MatchScore[]): AnyObject | null {
    function fields(s: MatchScore): AnyObject {
        let ret: AnyObject = {};
        let descriptor = MS_TABLE_DESCRIPTORS[s.season];

        for (let c of descriptor.columns) {
            ret[c.dbName] = s[c.dbName];
        }

        return ret;
    }

    if (ms.length == 1) {
        let s = ms[0];
        if (s.alliance != Alliance.Solo) return null;

        return {
            __typename: `MatchScores${s.season}Remote`,
            season: s.season,
            eventCode: s.eventCode,
            matchId: s.matchId,
            ...fields(s),
        };
    } else if (ms.length == 2) {
        let red = ms.find((s) => s.alliance == Alliance.Red);
        let blue = ms.find((s) => s.alliance == Alliance.Blue);
        if (red == undefined || blue == undefined) return null;

        return {
            __typename: SEASON_DESCRIPTORS[red.season].hasRemote
                ? `MatchScores${red.season}Trad`
                : `MatchScores${red.season}`,
            season: red.season,
            eventCode: red.eventCode,
            matchId: red.matchId,
            red: fields(red),
            blue: fields(blue),
        };
    }

    return null;
}

function makeMSTysTrad(
    descriptor: MatchScoreTableDescriptor<any, any, any>
): [GraphQLObjectType, GraphQLObjectType] {
    let fields: Record<string, GraphQLFieldConfig<any, any>> = {
        season: IntTy,
        eventCode: StrTy,
        matchID: IntTy,
        alliance: { type: nn(AllianceGQL) },
    };

    for (let c of descriptor.columns) {
        let type = c.apiTy ?? typeormTypeToGraphQLType(c.dbTy);
        if (type == null) throw `Unknown type ${c.dbTy}`;
        fields[c.dbName] = { type: new GraphQLNonNull(type) };
    }

    let allianceTy = new GraphQLObjectType({
        name: `MatchScores${descriptor.season}Alliance`,
        fields,
    });

    let outerTy = new GraphQLObjectType({
        name: descriptor.hasRemote
            ? `MatchScores${descriptor.season}Trad`
            : `MatchScores${descriptor.season}`,
        fields: {
            season: IntTy,
            eventCode: StrTy,
            matchID: IntTy,
            red: { type: nn(allianceTy) },
            blue: { type: nn(allianceTy) },
        },
    });

    return [outerTy, allianceTy];
}

function makeMSTysRemote(
    descriptor: MatchScoreTableDescriptor<any, any, any>
): GraphQLObjectType | null {
    if (!descriptor.hasRemote) return null;

    let fields: Record<string, GraphQLFieldConfig<any, any>> = {
        season: IntTy,
        eventCode: StrTy,
        matchID: IntTy,
    };

    for (let c of descriptor.columns) {
        let type = c.apiTy ?? typeormTypeToGraphQLType(c.dbTy);
        if (type == null) throw `Unknown type ${c.dbTy}`;
        fields[c.dbName] = { type: new GraphQLNonNull(type) };
    }

    let outerTy = new GraphQLObjectType({
        name: `MatchScores${descriptor.season}Remote`,
        fields,
    });

    return outerTy;
}
