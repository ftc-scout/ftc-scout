import { Field, Int, ObjectType } from "type-graphql";
import { MatchScores2019 } from "../../db/entities/MatchScores2019";
import { Season } from "../../ftc-api/types/Season";

@ObjectType("MatchScores2019Alliance", { simpleResolvers: true })
export class MatchScores2019AllianceGraphql {
    constructor(dbScore: MatchScores2019) {
        this.season = dbScore.season;
        this.eventCode = dbScore.eventCode;
        this.matchId = dbScore.matchId;

        this.navigated1 = dbScore.navigated1;
        this.navigated2 = dbScore.navigated2;
        this.repositioned = dbScore.repositioned;
        this.autoStonesDelivered = dbScore.autoStonesDelivered;
        this.autoSkystoneDeliveredFirst = dbScore.autoSkystoneDeliveredFirst;
        this.autoReturned = dbScore.autoReturned;
        this.autoFirstReturnedSkystone = dbScore.autoFirstReturnedSkystone;
        this.autoStonesPlaced = dbScore.autoStonesPlaced;
        this.dcStonesDelivered = dbScore.dcStonesDelivered;
        this.dcReturned = dbScore.dcReturned;
        this.dcStonesPlaced = dbScore.dcStonesPlaced;
        this.dcSkyscraperHeight = dbScore.dcSkyscraperHeight;
        this.capLevel1 = dbScore.capLevel1;
        this.capLevel2 = dbScore.capLevel2;
        this.foundationMoved = dbScore.foundationMoved;
        this.parked1 = dbScore.parked1;
        this.parked2 = dbScore.parked2;
        this.majorPenalties = dbScore.majorPenalties;
        this.minorPenalties = dbScore.minorPenalties;
        this.autoNavigationPoints = dbScore.autoNavigationPoints;
        this.autoRepositioningPoints = dbScore.autoRepositioningPoints;
        this.autoDeliveryPoints = dbScore.autoDeliveryPoints;
        this.autoPlacementPoints = dbScore.autoPlacementPoints;
        this.dcDeliveryPoints = dbScore.dcDeliveryPoints;
        this.dcPlacementPoints = dbScore.dcPlacementPoints;
        this.dcSkyscraperBonusPoints = dbScore.dcSkyscraperBonusPoints;
        this.cappingPoints = dbScore.cappingPoints;
        this.parkingPoints = dbScore.parkingPoints;
        this.foundationMovedPoints = dbScore.foundationMovedPoints;
        this.autoPoints = dbScore.autoPoints;
        this.dcPoints = dbScore.dcPoints;
        this.endgamePoints = dbScore.endgamePoints;
        this.penaltyPoints = dbScore.penaltyPoints;
        this.totalPoints = dbScore.totalPoints;
        this.totalPointsNp = dbScore.totalPointsNp;
    }

    @Field(() => Int)
    season: Season;

    @Field()
    eventCode: string;

    @Field(() => Int)
    matchId: number;

    @Field()
    navigated1: boolean;

    @Field()
    navigated2: boolean;

    @Field()
    repositioned: boolean;

    @Field(() => Int)
    autoStonesDelivered: number;

    @Field(() => Int)
    autoSkystoneDeliveredFirst: number;

    @Field(() => Int)
    autoReturned: number;

    @Field(() => Int)
    autoFirstReturnedSkystone: boolean;

    @Field(() => Int)
    autoStonesPlaced: number;

    @Field(() => Int)
    dcStonesDelivered: number;

    @Field(() => Int)
    dcReturned: number;

    @Field(() => Int)
    dcStonesPlaced: number;

    @Field(() => Int)
    dcSkyscraperHeight: number;

    @Field(() => Int)
    capLevel1: number;

    @Field(() => Int)
    capLevel2: number;

    @Field()
    foundationMoved: boolean;

    @Field()
    parked1: boolean;

    @Field()
    parked2: boolean;

    @Field(() => Int)
    majorPenalties: number;

    @Field(() => Int)
    minorPenalties: number;

    @Field(() => Int)
    autoNavigationPoints: number;

    @Field(() => Int)
    autoRepositioningPoints: number;

    @Field(() => Int)
    autoDeliveryPoints: number;

    @Field(() => Int)
    autoPlacementPoints: number;

    @Field(() => Int)
    dcDeliveryPoints: number;

    @Field(() => Int)
    dcPlacementPoints: number;

    @Field(() => Int)
    dcSkyscraperBonusPoints: number;

    @Field(() => Int)
    cappingPoints: number;

    @Field(() => Int)
    parkingPoints: number;

    @Field(() => Int)
    foundationMovedPoints: number;

    @Field(() => Int)
    autoPoints: number;

    @Field(() => Int)
    dcPoints: number;

    @Field(() => Int)
    endgamePoints: number;

    @Field(() => Int)
    penaltyPoints: number;

    @Field(() => Int)
    totalPoints: number;

    @Field(() => Int)
    totalPointsNp: number;
}

@ObjectType("MatchScores2019")
export class MatchScores2019Graphql {
    constructor(red: MatchScores2019, blue: MatchScores2019) {
        this.season = red.season;
        this.eventCode = red.eventCode;
        this.matchId = red.matchId;

        this.red = new MatchScores2019AllianceGraphql(red);
        this.blue = new MatchScores2019AllianceGraphql(blue);
    }

    @Field(() => Int)
    season: Season;

    @Field()
    eventCode: string;

    @Field(() => Int)
    matchId: number;

    @Field(() => MatchScores2019AllianceGraphql)
    red: MatchScores2019AllianceGraphql;

    @Field(() => MatchScores2019AllianceGraphql)
    blue: MatchScores2019AllianceGraphql;
}
