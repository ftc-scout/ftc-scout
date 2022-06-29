import { Field, Int, ObjectType } from "type-graphql";
import { MatchScores2021 } from "../../db/entities/MatchScores2021";
import { AutoNavigation2021 } from "../../db/entities/types/2021/AutoNavigation2021";
import { BarcodeElement2021 } from "../../db/entities/types/2021/BarcodeElement2021";
import { EndgamePark2021 } from "../../db/entities/types/2021/EndgamePark2021";

@ObjectType("MatchScores2021TraditionalAlliance", { simpleResolvers: true })
export class MatchScores2021TradAllianceGraphql {
    constructor(dbScore: MatchScores2021) {
        this.barcodeElement1 = dbScore.barcodeElement;
        this.barcodeElement2 = dbScore.barcodeElement2!;
        this.autoCarousel = dbScore.autoCarousel;
        this.autoNavigation1 = dbScore.autoNavigation;
        this.autoNavigation2 = dbScore.autoNavigation2!;
        this.autoBonus1 = dbScore.autoBonus;
        this.autoBonus2 = dbScore.autoBonus2!;
        this.autoStorageFreight = dbScore.autoStorageFreight;
        this.autoFreight1 = dbScore.autoFreight1;
        this.autoFreight2 = dbScore.autoFreight2;
        this.autoFreight3 = dbScore.autoFreight3;
        this.driverControlledStorageFreight =
            dbScore.driverControlledStorageFreight;
        this.driverControlledFreight1 = dbScore.driverControlledFreight1;
        this.driverControlledFreight2 = dbScore.driverControlledFreight2;
        this.driverControlledFreight3 = dbScore.driverControlledFreight3;
        this.sharedFreight = dbScore.sharedFreight!;
        this.endgameDucksDelivered = dbScore.endgameDucksDelivered;
        this.allianceBalanced = dbScore.allianceBalanced;
        this.sharedUnbalanced = dbScore.sharedUnbalanced!;
        this.endgamePark1 = dbScore.endgamePark;
        this.endgamePark2 = dbScore.endgamePark2!;
        this.capped = dbScore.capped;
        this.minorPenalties = dbScore.minorPenalties;
        this.majorPenalties = dbScore.majorPenalties;
        this.autoCarouselPoints = dbScore.autoCarouselPoints;
        this.autoNavigationPoints = dbScore.autoNavigationPoints;
        this.autoFreightPoints = dbScore.autoFreightPoints;
        this.autoBonusPoints = dbScore.autoBonusPoints;
        this.driverControlledAllianceHubPoints =
            dbScore.driverControlledAllianceHubPoints;
        this.driverControlledSharedHubPoints =
            dbScore.driverControlledSharedHubPoints!;
        this.driverControlledStoragePoints =
            dbScore.driverControlledStoragePoints;
        this.endgameDeliveryPoints = dbScore.endgameDeliveryPoints;
        this.allianceBalancedPoints = dbScore.allianceBalancedPoints;
        this.sharedUnbalancedPoints = dbScore.sharedUnbalancedPoints!;
        this.endgameParkingPoints = dbScore.endgameParkingPoints;
        this.cappingPoints = dbScore.cappingPoints;
        this.autoPoints = dbScore.autoPoints;
        this.driverControlledPoints = dbScore.driverControlledPoints;
        this.endgamePoints = dbScore.endgamePoints;
        this.penaltyPoints = dbScore.penaltyPoints;
        this.totalPoints = dbScore.totalPoints;
    }

    @Field(() => BarcodeElement2021)
    barcodeElement1: BarcodeElement2021;

    @Field(() => BarcodeElement2021)
    barcodeElement2: BarcodeElement2021;

    @Field()
    autoCarousel: boolean;

    @Field(() => AutoNavigation2021)
    autoNavigation1: AutoNavigation2021;

    @Field(() => AutoNavigation2021)
    autoNavigation2: AutoNavigation2021;

    @Field()
    autoBonus1: boolean;

    @Field(() => Boolean)
    autoBonus2: boolean;

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
    sharedFreight: number;

    @Field(() => Int)
    endgameDucksDelivered: number;

    @Field()
    allianceBalanced: boolean;

    @Field(() => Boolean)
    sharedUnbalanced: boolean;

    @Field(() => EndgamePark2021)
    endgamePark1: EndgamePark2021;

    @Field(() => EndgamePark2021)
    endgamePark2: EndgamePark2021;

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
    driverControlledSharedHubPoints: number;

    @Field(() => Int)
    driverControlledStoragePoints: number;

    @Field(() => Int)
    endgameDeliveryPoints: number;

    @Field(() => Int)
    allianceBalancedPoints: number;

    @Field(() => Int)
    sharedUnbalancedPoints: number;

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

@ObjectType("MatchScores2021Traditional")
export class MatchScores2021TradGraphql {
    constructor(red: MatchScores2021, blue: MatchScores2021) {
        this.randomization = red.randomization;
        this.red = new MatchScores2021TradAllianceGraphql(red);
        this.blue = new MatchScores2021TradAllianceGraphql(blue);
    }

    @Field(() => Int)
    randomization: number;

    @Field(() => MatchScores2021TradAllianceGraphql)
    red: MatchScores2021TradAllianceGraphql;

    @Field(() => MatchScores2021TradAllianceGraphql)
    blue: MatchScores2021TradAllianceGraphql;
}
