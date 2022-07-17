import { createUnionType } from "type-graphql";
import { MatchScores2021RemoteGraphql } from "./MatchScores2021RemoteGraphql";
import { MatchScores2021TradGraphql } from "./MatchScores2021TradGraphql";

export const MatchScoresUnion = createUnionType({
    name: "MatchScores", // the name of the GraphQL union
    types: () => [MatchScores2021TradGraphql, MatchScores2021RemoteGraphql] as const, // function that returns tuple of object types classes
});
