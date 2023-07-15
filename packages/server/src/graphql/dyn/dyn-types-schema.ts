import { DESCRIPTORS_LIST, notEmpty } from "@ftc-scout/common";
import { GraphQLUnionType } from "graphql";
import { makeMatchScoreTys } from "./match-score";

let msObjs = DESCRIPTORS_LIST.flatMap(makeMatchScoreTys).filter(notEmpty);
let outers = msObjs.filter((o) => !o.name.includes("Alliance"));

export const MatchScoresUnionGQL = new GraphQLUnionType({
    name: "MatchScores",
    types: outers,
});
