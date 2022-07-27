import { createUnionType, Field, FieldResolver, Float, Int, ObjectType, Resolver, Root } from "type-graphql";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";

@ObjectType()
class TeamEventStatGroup2021Traditional {
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
class TeamEventStatGroup2021Remote {
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
class TeamEventStats2021Traditional {
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
class TeamEventStats2021Remote {
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

const TeamEventStats2021Union = createUnionType({
    name: "TeamEventStats2021",
    types: () => [TeamEventStats2021Traditional, TeamEventStats2021Remote] as const,
});

@Resolver(TeamEventParticipation2021)
export class TeamEventParticipation2021Resolver {
    @FieldResolver(() => TeamEventStats2021Union, { nullable: true })
    stats(@Root() tep: TeamEventParticipation2021): TeamEventStats2021Traditional | TeamEventStats2021Remote | null {
        if (!tep.hasStats) {
            return null;
        } else if (tep.avg.sharedUnbalancedPoints == null) {
            return new TeamEventStats2021Remote({
                rank: tep.rank,
                rp: tep.rp,
                tb1: tep.tb1,
                tb2: tep.tb2,
                qualMatchesPlayed: tep.qualMatchesPlayed,
                total: new TeamEventStatGroup2021Remote(tep.tot),
                average: new TeamEventStatGroup2021Remote(tep.avg),
                min: new TeamEventStatGroup2021Remote(tep.min),
                max: new TeamEventStatGroup2021Remote(tep.max),
                standardDev: new TeamEventStatGroup2021Remote(tep.dev),
                opr: new TeamEventStatGroup2021Remote(tep.opr),
            } as TeamEventStats2021Remote);
        } else {
            return new TeamEventStats2021Traditional({
                rank: tep.rank,
                rp: tep.rp,
                tb1: tep.tb1,
                tb2: tep.tb2,
                wins: tep.wins,
                losses: tep.losses,
                ties: tep.ties,
                dqs: tep.dq,
                qualMatchesPlayed: tep.qualMatchesPlayed,
                total: new TeamEventStatGroup2021Traditional(tep.tot),
                average: new TeamEventStatGroup2021Traditional(tep.avg),
                min: new TeamEventStatGroup2021Traditional(tep.min),
                max: new TeamEventStatGroup2021Traditional(tep.max),
                standardDev: new TeamEventStatGroup2021Traditional(tep.dev),
                opr: new TeamEventStatGroup2021Traditional(tep.opr),
            } as TeamEventStats2021Traditional);
        }
    }
}
