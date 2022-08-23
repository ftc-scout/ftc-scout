import { TepStats2019 } from "../../db/entities/team-event-participation/TepStats2019";
import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class TeamEventStats2019 {
    constructor(obj: any) {
        Object.assign(this, obj);
    }

    @Field(() => Int)
    rank!: number;
    @Field(() => Float)
    rp!: number;
    @Field(() => Float)
    tb!: number;
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
    @Field(() => TepStats2019)
    total!: TepStats2019;
    @Field(() => TepStats2019)
    average!: TepStats2019;
    @Field(() => TepStats2019)
    min!: TepStats2019;
    @Field(() => TepStats2019)
    max!: TepStats2019;
    @Field(() => TepStats2019)
    standardDev!: TepStats2019;
    @Field(() => TepStats2019)
    opr!: TepStats2019;
}
