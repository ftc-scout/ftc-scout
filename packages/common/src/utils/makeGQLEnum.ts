import { GraphQLEnumType, GraphQLEnumValueConfigMap } from "graphql";

export function makeGQLEnum(e: Record<string, string>, name: string): GraphQLEnumType {
    let values: GraphQLEnumValueConfigMap = {};

    for (let [k, v] of Object.entries(e)) {
        values[k] = { value: v };
    }

    return new GraphQLEnumType({
        name,
        values,
    });
}
