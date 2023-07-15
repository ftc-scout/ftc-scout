import { MS_TABLE_DESCRIPTORS, notEmpty } from "@ftc-scout/common";
import { GraphQLUnionType } from "graphql";
import { makeMatchScoreTys } from "./match-score";

let msObjs = Object.values(MS_TABLE_DESCRIPTORS).flatMap(makeMatchScoreTys).filter(notEmpty);
let outers = msObjs.filter((o) => !o.name.includes("Alliance"));

export const MatchScoresUnionGQL = new GraphQLUnionType({
    name: "MatchScores",
    types: outers,
});
