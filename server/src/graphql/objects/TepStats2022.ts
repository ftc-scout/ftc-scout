import { Field, Float, Int, ObjectType } from "type-graphql";
import { TepStats2022 } from "../../db/entities/team-event-participation/TepStats2022";

@ObjectType()
export class TeamEventStats2022 {
    constructor(obj: any) {
        Object.assign(this, obj);
    }

    @Field(() => Int)
    rank!: number;
    @Field(() => Float)
    rp!: number;
    @Field(() => Float)
    tb1!: number;
    @Field(() => Float)
    tb2!: number;
    @Field(() => Int)
    wins!: number;
    @Field(() => Int)
    losses!: number;
    @Field(() => Int)
    ties!: number;
    @Field(() => Int)
    dqs!: number;
    @Field(() => Int)
    qualMatchesPlayed!: number;
    @Field(() => TepStats2022)
    total!: TepStats2022;
    @Field(() => TepStats2022)
    average!: TepStats2022;
    @Field(() => TepStats2022)
    min!: TepStats2022;
    @Field(() => TepStats2022)
    max!: TepStats2022;
    @Field(() => TepStats2022)
    standardDev!: TepStats2022;
    @Field(() => TepStats2022)
    opr!: TepStats2022;
}
