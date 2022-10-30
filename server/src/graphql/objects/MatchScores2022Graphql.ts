import { Field, Int, ObjectType } from "type-graphql";
import { MatchScores2022 } from "../../db/entities/MatchScores2022";
import { AutoNavigation2022 } from "../../db/entities/types/2022/AutoNavigation2022";
import { Alliance } from "../../db/entities/types/Alliance";
import { Season } from "../../ftc-api/types/Season";

@ObjectType("MatchScores2022Alliance", { simpleResolvers: true })
export class MatchScores2022AllianceGraphql {
    constructor(dbScore: MatchScores2022) {
        this.season = dbScore.season;
        this.eventCode = dbScore.eventCode;
        this.matchId = dbScore.matchId;
        this.alliance = dbScore.alliance;

        this.autoNavigation1 = dbScore.autoNavigation1;
        this.autoNavigation2 = dbScore.autoNavigation2;
        this.autoTerminalCones = dbScore.autoTerminalCones;
        this.autoGroundCones = dbScore.autoGroundCones;
        this.autoLowCones = dbScore.autoLowCones;
        this.autoMediumCones = dbScore.autoMediumCones;
        this.autoHighCones = dbScore.autoHighCones;
        this.dcTerminalCones = dbScore.dcTerminalCones;
        this.dcGroundCones = dbScore.dcGroundCones;
        this.dcLowCones = dbScore.dcLowCones;
        this.dcMediumCones = dbScore.dcMediumCones;
        this.dcHighCones = dbScore.dcHighCones;
        this.endgameNavigated1 = dbScore.endgameNavigated1;
        this.endgameNavigated2 = dbScore.endgameNavigated2;
        this.coneOwnedJunctions = dbScore.coneOwnedJunctions;
        this.beaconOwnedJunctions = dbScore.beaconOwnedJunctions;
        this.circuit = dbScore.circuit;
        this.majorPenalties = dbScore.majorPenalties;
        this.minorPenalties = dbScore.minorPenalties;
        this.autoNavigationPoints = dbScore.autoNavigationPoints;
        this.autoConePoints = dbScore.autoConePoints;
        this.endgameNavigationPoints = dbScore.endgameNavigationPoints;
        this.ownershipPoints = dbScore.ownershipPoints;
        this.circuitPoints = dbScore.ownershipPoints;
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

    @Field(() => Alliance)
    alliance: Alliance;

    @Field(() => AutoNavigation2022)
    autoNavigation1: AutoNavigation2022;

    @Field(() => AutoNavigation2022)
    autoNavigation2: AutoNavigation2022;

    @Field(() => Int)
    autoTerminalCones: number;
    @Field(() => Int)
    autoGroundCones: number;
    @Field(() => Int)
    autoLowCones: number;
    @Field(() => Int)
    autoMediumCones: number;
    @Field(() => Int)
    autoHighCones: number;

    @Field(() => Int)
    dcTerminalCones: number;
    @Field(() => Int)
    dcGroundCones: number;
    @Field(() => Int)
    dcLowCones: number;
    @Field(() => Int)
    dcMediumCones: number;
    @Field(() => Int)
    dcHighCones: number;

    @Field()
    endgameNavigated1: boolean;

    @Field()
    endgameNavigated2: boolean;

    @Field(() => Int)
    coneOwnedJunctions: number;

    @Field(() => Int)
    beaconOwnedJunctions: number;

    @Field()
    circuit: boolean;

    @Field(() => Int)
    minorPenalties: number;

    @Field(() => Int)
    majorPenalties: number;

    @Field(() => Int)
    autoNavigationPoints: number;

    @Field(() => Int)
    autoConePoints: number;

    @Field(() => Int)
    endgameNavigationPoints: number;

    @Field(() => Int)
    ownershipPoints: number;

    @Field(() => Int)
    circuitPoints: number;

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

@ObjectType("MatchScores2022")
export class MatchScores2022Graphql {
    constructor(red: MatchScores2022, blue: MatchScores2022) {
        this.season = red.season;
        this.eventCode = red.eventCode;
        this.matchId = red.matchId;

        this.red = new MatchScores2022AllianceGraphql(red);
        this.blue = new MatchScores2022AllianceGraphql(blue);
    }

    @Field(() => Int)
    season: Season;

    @Field()
    eventCode: string;

    @Field(() => Int)
    matchId: number;

    @Field(() => MatchScores2022AllianceGraphql)
    red: MatchScores2022AllianceGraphql;

    @Field(() => MatchScores2022AllianceGraphql)
    blue: MatchScores2022AllianceGraphql;
}
