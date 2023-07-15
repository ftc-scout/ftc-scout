import { MatchScoreTableDescriptor } from "@ftc-scout/common";
import {
    GraphQLEnumType,
    GraphQLFieldConfig,
    GraphQLInt,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";
import { typeormTypeToGraphQLType } from "./dbToApiTy";

export function makeMatchScoreTys(
    descriptor: MatchScoreTableDescriptor<any, any, any>,
    prevSchema: GraphQLSchema
): [GraphQLObjectType, GraphQLObjectType, GraphQLObjectType | null] {
    return [...makeMSTysTrad(descriptor, prevSchema), makeMSTysRemote(descriptor)];
}

function makeMSTysTrad(
    descriptor: MatchScoreTableDescriptor<any, any, any>,
    prevSchema: GraphQLSchema
): [GraphQLObjectType, GraphQLObjectType] {
    let fields: Record<string, GraphQLFieldConfig<any, any>> = {
        season: { type: new GraphQLNonNull(GraphQLInt) },
        eventCode: { type: new GraphQLNonNull(GraphQLString) },
        matchID: { type: new GraphQLNonNull(GraphQLInt) },
        alliance: {
            type: new GraphQLNonNull(prevSchema.getType("Alliance") as GraphQLEnumType),
        },
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
            season: { type: new GraphQLNonNull(GraphQLInt) },
            eventCode: { type: new GraphQLNonNull(GraphQLString) },
            matchID: { type: new GraphQLNonNull(GraphQLInt) },
            red: { type: new GraphQLNonNull(allianceTy) },
            blue: { type: new GraphQLNonNull(allianceTy) },
        },
    });

    return [outerTy, allianceTy];
}

function makeMSTysRemote(
    descriptor: MatchScoreTableDescriptor<any, any, any>
): GraphQLObjectType | null {
    if (!descriptor.hasRemote) return null;

    let outerTy = new GraphQLObjectType({
        name: `MatchScores${descriptor.season}Remote`,

        fields: {
            season: { type: new GraphQLNonNull(GraphQLInt) },
            eventCode: { type: new GraphQLNonNull(GraphQLString) },
            matchID: { type: new GraphQLNonNull(GraphQLInt) },
        },
    });

    return outerTy;
}
