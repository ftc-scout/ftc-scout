import { ALL_SEASONS, MS_TABLE_DESCRIPTORS, notEmpty } from "@ftc-scout/common";
import { GraphQLInt, GraphQLObjectType, GraphQLSchema, GraphQLUnionType } from "graphql";
import { makeMatchScoreTys } from "./match-score";

export function makeDynSchema(prevSchema: GraphQLSchema) {
    let msObjs = ALL_SEASONS.flatMap((s) =>
        makeMatchScoreTys(MS_TABLE_DESCRIPTORS[s], prevSchema)
    ).filter(notEmpty);
    let outers = msObjs.filter((o) => !o.name.includes("Alliance"));

    let MatchScoresUnion = new GraphQLUnionType({
        name: "MatchScores",
        types: outers,
    });

    let prevConfig = prevSchema.toConfig();

    let match = prevConfig.types.find((t) => t.name == "Match") as GraphQLObjectType;
    prevConfig.types = prevConfig.types.filter((t) => t !== match);

    let matchC = match.toConfig();
    let newMatch = new GraphQLObjectType({
        ...matchC,
        fields: {
            ...matchC.fields,
            foo: {
                type: GraphQLInt,
            },
        },
    });

    console.log(prevConfig);

    return new GraphQLSchema({
        ...prevConfig,
        types: [...prevConfig.types, ...msObjs, MatchScoresUnion, newMatch],
    });
}
