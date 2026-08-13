import { GraphQLEnumType, GraphQLEnumValueConfigMap } from "graphql";

export function makeGQLEnum(e: Record<string, string>, name: string): GraphQLEnumType {
    let values: GraphQLEnumValueConfigMap = {};

    for (let [, v] of Object.entries(e)) {
        values[v] = { value: v };
    }

    return new GraphQLEnumType({
        name,
        values,
    });
}
