import { Field, Int, ObjectType } from "type-graphql";
import { MatchScores2021 } from "../../db/entities/MatchScores2021";
import { AutoNavigation2021 } from "../../db/entities/types/2021/AutoNavigation2021";
import { BarcodeElement2021 } from "../../db/entities/types/2021/BarcodeElement2021";
import { EndgamePark2021 } from "../../db/entities/types/2021/EndgamePark2021";
import { Season } from "../../ftc-api/types/Season";

@ObjectType("MatchScores2021Remote", { simpleResolvers: true })
export class MatchScores2021RemoteGraphql {
    constructor(dbScore: MatchScores2021) {
        this.season = dbScore.season;
        this.eventCode = dbScore.eventCode;
        this.matchId = dbScore.matchId;

        this.randomization = dbScore.randomization;
        this.barcodeElement = dbScore.barcodeElement;
        this.autoCarousel = dbScore.autoCarousel;
        this.autoNavigation = dbScore.autoNavigation;
        this.autoBonus = dbScore.autoBonus;
        this.autoStorageFreight = dbScore.autoStorageFreight;
        this.autoFreight1 = dbScore.autoFreight1;
        this.autoFreight2 = dbScore.autoFreight2;
        this.autoFreight3 = dbScore.autoFreight3;
        this.driverControlledStorageFreight = dbScore.driverControlledStorageFreight;
        this.driverControlledFreight1 = dbScore.driverControlledFreight1;
        this.driverControlledFreight2 = dbScore.driverControlledFreight2;
        this.driverControlledFreight3 = dbScore.driverControlledFreight3;
        this.endgameDucksDelivered = dbScore.endgameDucksDelivered;
        this.allianceBalanced = dbScore.allianceBalanced;
        this.endgamePark = dbScore.endgamePark;
        this.capped = dbScore.capped;
        this.minorPenalties = dbScore.minorPenalties;
        this.majorPenalties = dbScore.majorPenalties;
        this.autoCarouselPoints = dbScore.autoCarouselPoints;
        this.autoNavigationPoints = dbScore.autoNavigationPoints;
        this.autoFreightPoints = dbScore.autoFreightPoints;
        this.autoBonusPoints = dbScore.autoBonusPoints;
        this.driverControlledAllianceHubPoints = dbScore.driverControlledAllianceHubPoints;
        this.driverControlledStoragePoints = dbScore.driverControlledStoragePoints;
        this.endgameDeliveryPoints = dbScore.endgameDeliveryPoints;
        this.allianceBalancedPoints = dbScore.allianceBalancedPoints;
        this.endgameParkingPoints = dbScore.endgameParkingPoints;
        this.cappingPoints = dbScore.cappingPoints;
        this.autoPoints = dbScore.autoPoints;
        this.driverControlledPoints = dbScore.driverControlledPoints;
        this.endgamePoints = dbScore.endgamePoints;
        this.penaltyPoints = dbScore.penaltyPoints;
        this.totalPoints = dbScore.totalPoints;
    }

    @Field(() => Int)
    season: Season;

    @Field()
    eventCode: string;

    @Field(() => Int)
    matchId: number;

    @Field(() => Int)
    randomization: number;

    @Field(() => BarcodeElement2021)
    barcodeElement: BarcodeElement2021;

    @Field()
    autoCarousel: boolean;

    @Field(() => AutoNavigation2021)
    autoNavigation: AutoNavigation2021;

    @Field()
    autoBonus: boolean;

    @Field(() => Int)
    autoStorageFreight: number;

    @Field(() => Int)
    autoFreight1: number;

    @Field(() => Int)
    autoFreight2: number;

    @Field(() => Int)
    autoFreight3: number;

    @Field(() => Int)
    driverControlledStorageFreight: number;

    @Field(() => Int)
    driverControlledFreight1: number;

    @Field(() => Int)
    driverControlledFreight2: number;

    @Field(() => Int)
    driverControlledFreight3: number;

    @Field(() => Int)
    endgameDucksDelivered: number;

    @Field()
    allianceBalanced: boolean;

    @Field(() => EndgamePark2021)
    endgamePark: EndgamePark2021;

    @Field(() => Int)
    capped: number;

    @Field(() => Int)
    minorPenalties: number;

    @Field(() => Int)
    majorPenalties: number;

    @Field(() => Int)
    autoCarouselPoints: number;

    @Field(() => Int)
    autoNavigationPoints: number;

    @Field(() => Int)
    autoFreightPoints: number;

    @Field(() => Int)
    autoBonusPoints: number;

    @Field(() => Int)
    driverControlledAllianceHubPoints: number;

    @Field(() => Int)
    driverControlledStoragePoints: number;

    @Field(() => Int)
    endgameDeliveryPoints: number;

    @Field(() => Int)
    allianceBalancedPoints: number;

    @Field(() => Int)
    endgameParkingPoints: number;

    @Field(() => Int)
    cappingPoints: number;

    @Field(() => Int)
    autoPoints: number;

    @Field(() => Int)
    driverControlledPoints: number;

    @Field(() => Int)
    endgamePoints: number;

    @Field(() => Int)
    penaltyPoints: number;

    @Field(() => Int)
    totalPoints: number;
}
