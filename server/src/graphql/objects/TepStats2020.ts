import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class TeamEventStatGroup2020 {
    constructor(obj: any) {
        Object.assign(this, obj);
    }

    @Field(() => Float)
    autoNavigationPoints!: number;
    @Field(() => Float)
    autoNavigationPointsIndividual!: number;
    @Field(() => Float)
    autoGoalPoints!: number;
    @Field(() => Float)
    autoGoalPointsLow!: number;
    @Field(() => Float)
    autoGoalPointsMid!: number;
    @Field(() => Float)
    autoGoalPointsHigh!: number;
    @Field(() => Float)
    autoWobblePoints!: number;
    @Field(() => Float)
    autoPowershotPoints!: number;
    @Field(() => Float)
    endgameWobblePoints!: number;
    @Field(() => Float)
    endgameWobbleRingPoints!: number;
    @Field(() => Float)
    majorPenaltyPoints!: number;
    @Field(() => Float)
    minorPenaltyPoints!: number;
    @Field(() => Float)
    autoPoints!: number;
    @Field(() => Float)
    driverControlledPoints!: number;
    @Field(() => Float)
    driverControlledPointsLow!: number;
    @Field(() => Float)
    driverControlledPointsMid!: number;
    @Field(() => Float)
    driverControlledPointsHigh!: number;
    @Field(() => Float)
    endgamePoints!: number;
    @Field(() => Float)
    penaltyPoints!: number;
    @Field(() => Float)
    totalPoints!: number;
    @Field(() => Float)
    totalPointsNp!: number;
}

@ObjectType()
export class TeamEventStats2020Traditional {
    constructor(obj: any) {
        Object.assign(this, obj);
    }

    @Field(() => Int)
    rank!: number;
    @Field(() => Int)
    rp!: number;
    @Field(() => Int)
    tb1!: number;
    @Field(() => Int)
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
    @Field(() => TeamEventStatGroup2020)
    total!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    average!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    min!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    max!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    standardDev!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    opr!: TeamEventStatGroup2020;
}

@ObjectType()
export class TeamEventStats2020Remote {
    constructor(obj: any) {
        Object.assign(this, obj);
    }

    @Field(() => Int)
    rank!: number;
    @Field(() => Int)
    rp!: number;
    @Field(() => Int)
    tb1!: number;
    @Field(() => Int)
    tb2!: number;
    @Field(() => Int)
    qualMatchesPlayed!: number;
    @Field(() => TeamEventStatGroup2020)
    total!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    average!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    min!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    max!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    standardDev!: TeamEventStatGroup2020;
    @Field(() => TeamEventStatGroup2020)
    opr!: TeamEventStatGroup2020;
}
