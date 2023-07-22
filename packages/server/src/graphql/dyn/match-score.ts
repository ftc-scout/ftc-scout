import { Alliance, DESCRIPTORS, Descriptor, IntTy, StrTy, nn, notEmpty } from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLObjectType } from "graphql";
import { AllianceGQL } from "../resolvers/enums";
import { MatchScore } from "../../db/entities/dyn/match-score";
import { AnyObject } from "../../type-utils";

export function makeMatchScoreTys(descriptor: Descriptor): GraphQLObjectType[] {
    return [makeMSTysTrad(descriptor), makeMSTysRemote(descriptor)].filter(notEmpty);
}

export function frontendMSFromDB(ms: MatchScore[]): AnyObject | null {
    function fields(s: MatchScore, remote: boolean): AnyObject {
        let ret: AnyObject = {};
        let descriptor = DESCRIPTORS[s.season];

        for (let c of descriptor.msColumns()) {
            if (c.outer || (remote && c.tradOnly)) continue;

            ret[c.getApiName(remote)] = s[c.dbColName];
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
            ...fields(s, true),
        };
    } else if (ms.length == 2) {
        let red = ms.find((s) => s.alliance == Alliance.Red);
        let blue = ms.find((s) => s.alliance == Alliance.Blue);
        if (red == undefined || blue == undefined) return null;

        let ret: AnyObject = {
            __typename: DESCRIPTORS[red.season].hasRemote
                ? `MatchScores${red.season}Trad`
                : `MatchScores${red.season}`,
            season: red.season,
            eventCode: red.eventCode,
            matchId: red.matchId,
            red: {
                season: red.season,
                eventCode: red.eventCode,
                matchId: red.matchId,
                alliance: Alliance.Red,
                ...fields(red, false),
            },
            blue: {
                season: red.season,
                eventCode: red.eventCode,
                matchId: red.matchId,
                alliance: Alliance.Blue,
                ...fields(blue, false),
            },
        };

        let descriptor = DESCRIPTORS[red.season];

        for (let c of descriptor.msColumns()) {
            if (!c.outer) continue;

            ret[c.getApiName(false)] =
                "apiMap" in c && c.apiMap ? c.apiMap(red, blue) : red[c.dbColName];
        }

        return ret;
    }

    return null;
}

function makeMSTysTrad(descriptor: Descriptor): GraphQLObjectType {
    let innerFields: Record<string, GraphQLFieldConfig<any, any>> = {
        season: IntTy,
        eventCode: StrTy,
        matchId: IntTy,
        alliance: { type: nn(AllianceGQL) },
    };

    let outerFields: Record<string, GraphQLFieldConfig<any, any>> = {
        season: IntTy,
        eventCode: StrTy,
        matchId: IntTy,
    };

    for (let c of descriptor.msColumns()) {
        let type = new GraphQLNonNull(c.dataTy.gql);
        if (c.outer) {
            outerFields[c.getApiName(false)] = { type };
        } else {
            innerFields[c.getApiName(false)] = { type };
        }
    }

    let allianceTy = new GraphQLObjectType({
        name: `MatchScores${descriptor.season}Alliance`,
        fields: innerFields,
    });

    let outerTy = new GraphQLObjectType({
        name: descriptor.hasRemote
            ? `MatchScores${descriptor.season}Trad`
            : `MatchScores${descriptor.season}`,
        fields: {
            ...outerFields,
            red: { type: nn(allianceTy) },
            blue: { type: nn(allianceTy) },
        },
    });

    return outerTy;
}

function makeMSTysRemote(descriptor: Descriptor): GraphQLObjectType | null {
    if (!descriptor.hasRemote) return null;

    let fields: Record<string, GraphQLFieldConfig<any, any>> = {
        season: IntTy,
        eventCode: StrTy,
        matchId: IntTy,
    };

    for (let c of descriptor.msColumns()) {
        if (c.tradOnly) continue;

        let type = c.dataTy.gql;
        fields[c.getApiName(true)] = { type: new GraphQLNonNull(type) };
    }

    let outerTy = new GraphQLObjectType({
        name: `MatchScores${descriptor.season}Remote`,
        fields,
    });

    return outerTy;
}
