import { Season } from "@ftc-scout/common";
import { GraphQLInt, GraphQLObjectType } from "graphql";

export function makeMatchScoreTys(season: Season): GraphQLObjectType[] {
    return [
        new GraphQLObjectType({
            name: `MatchScores${season}`,
            fields: {
                x: {
                    type: GraphQLInt,
                },
            },
        }),
    ];
}
