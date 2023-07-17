import { DESCRIPTORS_LIST } from "@ftc-scout/common";
import { GraphQLUnionType } from "graphql";
import { makeMatchScoreTys as makeMatchScoreTypes } from "./match-score";
import { makeTepTypes } from "./tep";

export const MatchScoresUnionGQL = new GraphQLUnionType({
    name: "MatchScores",
    types: DESCRIPTORS_LIST.flatMap(makeMatchScoreTypes),
});

export const TepStatsUnionGQL = new GraphQLUnionType({
    name: "TeamEventStats",
    types: DESCRIPTORS_LIST.flatMap(makeTepTypes),
});
