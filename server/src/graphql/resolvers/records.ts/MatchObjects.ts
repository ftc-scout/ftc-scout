import { Field, Int, ObjectType, registerEnumType } from "type-graphql";
import { MatchScoresAllianceGraphql, MatchScoresAllianceUnion } from "../../objects/MatchScoresUnion";

export enum MatchGroup {
    THIS,
    OTHER,
}

registerEnumType(MatchGroup, { name: "MatchGroup" });

@ObjectType()
export class MatchRecordRow {
    @Field(() => MatchScoresAllianceUnion)
    score!: MatchScoresAllianceGraphql;

    @Field(() => Int)
    rank!: number;

    @Field(() => Int)
    preFilterRank!: number;
}

@ObjectType()
export class MatchRecords {
    @Field(() => [MatchRecordRow])
    scores!: MatchRecordRow[];

    @Field(() => Int)
    offset!: number;

    @Field(() => Int)
    count!: number;
}
