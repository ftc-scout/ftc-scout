import { Field, Float, Int, ObjectType } from "type-graphql";

@ObjectType()
export class TeamEventStatGroup2021Traditional {
    constructor(obj: any) {
        Object.assign(this, obj);
    }

    @Field(() => Float)
    autoCarouselPoints!: number;
    @Field(() => Float)
    autoNavigationPoints!: number;
    @Field(() => Float)
    autoNavigationPointsIndividual!: number;
    @Field(() => Float)
    autoFreightPoints!: number;
    @Field(() => Float)
    autoFreightPointsLevel1!: number;
    @Field(() => Float)
    autoFreightPointsLevel2!: number;
    @Field(() => Float)
    autoFreightPointsLevel3!: number;
    @Field(() => Float)
    autoFreightPointsStorage!: number;
    @Field(() => Float)
    autoBonusPoints!: number;
    @Field(() => Float)
    autoBonusPointsIndividual!: number;
    @Field(() => Float)
    driverControlledAllianceHubPoints!: number;
    @Field(() => Float)
    driverControlledAllianceHubPointsLevel1!: number;
    @Field(() => Float)
    driverControlledAllianceHubPointsLevel2!: number;
    @Field(() => Float)
    driverControlledAllianceHubPointsLevel3!: number;
    @Field(() => Float)
    driverControlledSharedHubPoints!: number;
    @Field(() => Float)
    driverControlledStoragePoints!: number;
    @Field(() => Float)
    endgameDeliveryPoints!: number;
    @Field(() => Float)
    allianceBalancedPoints!: number;
    @Field(() => Float)
    sharedUnbalancedPoints!: number;
    @Field(() => Float)
    endgameParkingPoints!: number;
    @Field(() => Float)
    endgameParkingPointsIndividual!: number;
    @Field(() => Float)
    cappingPoints!: number;
    @Field(() => Float)
    majorPenaltyPoints!: number;
    @Field(() => Float)
    minorPenaltyPoints!: number;
    @Field(() => Float)
    autoPoints!: number;
    @Field(() => Float)
    driverControlledPoints!: number;
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
export class TeamEventStatGroup2021Remote {
    constructor(obj: any) {
        Object.assign(this, obj);
    }

    @Field(() => Float)
    autoCarouselPoints!: number;
    @Field(() => Float)
    autoNavigationPoints!: number;
    @Field(() => Float)
    autoNavigationPointsIndividual!: number;
    @Field(() => Float)
    autoFreightPoints!: number;
    @Field(() => Float)
    autoFreightPointsLevel1!: number;
    @Field(() => Float)
    autoFreightPointsLevel2!: number;
    @Field(() => Float)
    autoFreightPointsLevel3!: number;
    @Field(() => Float)
    autoFreightPointsStorage!: number;
    @Field(() => Float)
    autoBonusPoints!: number;
    @Field(() => Float)
    autoBonusPointsIndividual!: number;
    @Field(() => Float)
    driverControlledAllianceHubPoints!: number;
    @Field(() => Float)
    driverControlledAllianceHubPointsLevel1!: number;
    @Field(() => Float)
    driverControlledAllianceHubPointsLevel2!: number;
    @Field(() => Float)
    driverControlledAllianceHubPointsLevel3!: number;
    @Field(() => Float)
    driverControlledSharedHubPoints!: number;
    @Field(() => Float)
    driverControlledStoragePoints!: number;
    @Field(() => Float)
    endgameDeliveryPoints!: number;
    @Field(() => Float)
    allianceBalancedPoints!: number;
    @Field(() => Float)
    sharedUnbalancedPoints!: number;
    @Field(() => Float)
    endgameParkingPoints!: number;
    @Field(() => Float)
    endgameParkingPointsIndividual!: number;
    @Field(() => Float)
    cappingPoints!: number;
    @Field(() => Float)
    majorPenaltyPoints!: number;
    @Field(() => Float)
    minorPenaltyPoints!: number;
    @Field(() => Float)
    autoPoints!: number;
    @Field(() => Float)
    driverControlledPoints!: number;
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
export class TeamEventStats2021Traditional {
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
    @Field(() => TeamEventStatGroup2021Traditional)
    total!: TeamEventStatGroup2021Traditional;
    @Field(() => TeamEventStatGroup2021Traditional)
    average!: TeamEventStatGroup2021Traditional;
    @Field(() => TeamEventStatGroup2021Traditional)
    min!: TeamEventStatGroup2021Traditional;
    @Field(() => TeamEventStatGroup2021Traditional)
    max!: TeamEventStatGroup2021Traditional;
    @Field(() => TeamEventStatGroup2021Traditional)
    standardDev!: TeamEventStatGroup2021Traditional;
    @Field(() => TeamEventStatGroup2021Traditional)
    opr!: TeamEventStatGroup2021Traditional;
}

@ObjectType()
export class TeamEventStats2021Remote {
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
    @Field(() => TeamEventStatGroup2021Remote)
    total!: TeamEventStatGroup2021Remote;
    @Field(() => TeamEventStatGroup2021Remote)
    average!: TeamEventStatGroup2021Remote;
    @Field(() => TeamEventStatGroup2021Remote)
    min!: TeamEventStatGroup2021Remote;
    @Field(() => TeamEventStatGroup2021Remote)
    max!: TeamEventStatGroup2021Remote;
    @Field(() => TeamEventStatGroup2021Remote)
    standardDev!: TeamEventStatGroup2021Remote;
    @Field(() => TeamEventStatGroup2021Remote)
    opr!: TeamEventStatGroup2021Remote;
}
