import { createUnionType } from "type-graphql";
import { MatchScores2019AllianceGraphql, MatchScores2019Graphql } from "./MatchScores2019Graphql";
import { MatchScores2020RemoteGraphql } from "./MatchScores2020RemoteGraphql";
import { MatchScores2020TradAllianceGraphql, MatchScores2020TradGraphql } from "./MatchScores2020TradGraphql";
import { MatchScores2021RemoteGraphql } from "./MatchScores2021RemoteGraphql";
import { MatchScores2021TradAllianceGraphql, MatchScores2021TradGraphql } from "./MatchScores2021TradGraphql";

export type MatchScoresGraphql =
    | MatchScores2021TradGraphql
    | MatchScores2021RemoteGraphql
    | MatchScores2020TradGraphql
    | MatchScores2020RemoteGraphql
    | MatchScores2019Graphql;
export type MatchScoresAllianceGraphql =
    | MatchScores2019AllianceGraphql
    | MatchScores2020TradAllianceGraphql
    | MatchScores2020RemoteGraphql
    | MatchScores2021TradAllianceGraphql
    | MatchScores2021RemoteGraphql;

export const MatchScoresUnion = createUnionType({
    name: "MatchScores", // the name of the GraphQL union
    types: () =>
        [
            MatchScores2021TradGraphql,
            MatchScores2021RemoteGraphql,
            MatchScores2020TradGraphql,
            MatchScores2020RemoteGraphql,
            MatchScores2019Graphql,
        ] as const, // function that returns tuple of object types classes
});

export const MatchScoresAllianceUnion = createUnionType({
    name: "MatchScoresAlliance", // the name of the GraphQL union
    types: () =>
        [
            MatchScores2019AllianceGraphql,
            MatchScores2020TradAllianceGraphql,
            MatchScores2020RemoteGraphql,
            MatchScores2021TradAllianceGraphql,
            MatchScores2021RemoteGraphql,
        ] as const, // function that returns tuple of object types classes
});
