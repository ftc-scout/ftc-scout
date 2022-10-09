import { MatchScores2020RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Remote";
import { MatchScores2020TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Trad";
import { Season } from "../../ftc-api/types/Season";
import { BaseEntity, Column, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Match } from "./Match";
import { Alliance, allianceFromString } from "./types/Alliance";
import { AutoNavigation2020, autoNavigation2020FromApi } from "./types/2020/AutoNavigation2020";
import { WobbleEndPositions, wobbleEndPositionsFromApi } from "./types/2020/WobbleEndPositions";

//Jonah do what is in the other matchscores ones nexttheyre
@Entity()
export class MatchScores2020 extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn("varchar")
    eventCode!: string;

    @PrimaryColumn("int")
    matchId!: number;

    @PrimaryColumn("enum", { enum: Alliance })
    alliance!: Alliance;

    @ManyToOne(() => Match, (match) => match.scores2021)
    @JoinColumn([
        { name: "season", referencedColumnName: "eventSeason" },
        { name: "eventCode", referencedColumnName: "eventCode" },
        { name: "matchId", referencedColumnName: "id" },
    ])
    match!: Match;

    @Column("int8")
    randomization!: number;

    @Column()
    autoWobble!: boolean;

    @Column()
    autoWobble2!: boolean;

    @Column("enum", { enum: AutoNavigation2020 })
    autoNavigation!: AutoNavigation2020;

    @Column("enum", { enum: AutoNavigation2020, nullable: true })
    autoNavigation2!: AutoNavigation2020 | null;

    @Column("int8")
    autoPowershots!: number;

    @Column("int8")
    autoGoalLow!: number;

    @Column("int8")
    autoGoalMid!: number;

    @Column("int8")
    autoGoalHigh!: number;

    @Column("int8")
    driverControlledLow!: number;

    @Column("int8")
    driverControlledMid!: number;

    @Column("int8")
    driverControlledHigh!: number;

    @Column("enum", { enum: WobbleEndPositions })
    wobbleEndPositions!: WobbleEndPositions;

    @Column("enum", { enum: WobbleEndPositions, nullable: true })
    wobbleEndPositions2!: WobbleEndPositions | null;

    @Column("int8")
    endgameRingsOnWobble!: number;

    @Column("int8")
    endgameRingsOnWobble2!: number;

    @Column("int8")
    endgamePowershots!: number;

    @Column("int8")
    minorPenalties!: number;

    @Column("int8")
    majorPenalties!: number;

    @Column("int8")
    autoNavigationPoints!: number;

    @Column("int8")
    autoGoalPoints!: number;

    @Column("int8")
    autoWobblePoints!: number;

    @Column("int8")
    driverControlledAllianceHubPoints!: number;

    @Column("int8", { nullable: true })
    driverControlledSharedHubPoints!: number | null;

    @Column("int8")
    driverControlledStoragePoints!: number;

    @Column("int8")
    endgameDeliveryPoints!: number;

    @Column("int8")
    allianceBalancedPoints!: number;

    @Column("int8", { nullable: true })
    sharedUnbalancedPoints!: number | null;

    @Column("int8")
    endgameParkingPoints!: number;

    @Column("int8")
    cappingPoints!: number;

    @Column("smallint")
    autoPoints!: number;

    @Column("smallint")
    driverControlledPoints!: number;

    @Column("smallint")
    endgamePoints!: number;

    @Column("smallint")
    penaltyPoints!: number;

    @Column("smallint")
    totalPoints!: number;

    @Column("smallint")
    totalPointsNp!: number;

    static calcAutoNavigationPoints(nav: AutoNavigation2021): number {
        return [0, 3, 6, 5, 10][nav];
    }

    static calcAutoBonusPoints(bonus: boolean, barcode: BarcodeElement2021): number {
        return bonus ? (barcode == BarcodeElement2021.DUCK ? 10 : 20) : 0;
    }

    static calcParkPoints(park: EndgamePark2021): number {
        return [0, 3, 6][park];
    }

    addGeneratedProps() {
        this.autoCarouselPoints = this.autoCarousel ? 10 : 0;
        this.autoNavigationPoints =
            [0, 3, 6, 5, 10][this.autoNavigation] +
            (this.autoNavigation2 != null ? [0, 3, 6, 5, 10][this.autoNavigation2] : 0);
        this.autoFreightPoints =
            this.autoStorageFreight * 2 + (this.autoFreight1 + this.autoFreight2 + this.autoFreight3) * 6;
        this.autoBonusPoints =
            (this.autoBonus ? (this.barcodeElement == BarcodeElement2021.DUCK ? 10 : 20) : 0) +
            (this.autoBonus2 ? (this.barcodeElement2 == BarcodeElement2021.DUCK ? 10 : 20) : 0);
        this.driverControlledAllianceHubPoints =
            this.driverControlledFreight1 * 2 + this.driverControlledFreight2 * 4 + this.driverControlledFreight3 * 6;
        this.driverControlledSharedHubPoints = this.sharedFreight == null ? null : this.sharedFreight * 4;
        this.driverControlledStoragePoints = this.driverControlledStorageFreight * 1;
        this.endgameDeliveryPoints = this.endgameDucksDelivered * 6;
        this.allianceBalancedPoints = this.allianceBalanced ? 10 : 0;
        this.sharedUnbalancedPoints = this.sharedUnbalanced == null ? null : this.sharedUnbalanced ? 20 : 0;
        this.endgameParkingPoints =
            [0, 3, 6][this.endgamePark] + (this.endgamePark2 != null ? [0, 3, 6][this.endgamePark2] : 0);
        this.cappingPoints = this.capped * 15;
        this.autoPoints =
            this.autoCarouselPoints + this.autoNavigationPoints + this.autoFreightPoints + this.autoBonusPoints;
        this.driverControlledPoints =
            this.driverControlledAllianceHubPoints +
            this.driverControlledStoragePoints +
            (this.driverControlledSharedHubPoints ?? 0);
        this.endgamePoints =
            this.endgameDeliveryPoints +
            this.allianceBalancedPoints +
            (this.sharedUnbalancedPoints ?? 0) +
            this.endgameParkingPoints +
            this.cappingPoints;
        this.penaltyPoints = this.majorPenalties * -30 + this.minorPenalties * -10;
        this.totalPoints = Math.max(
            this.autoPoints + this.driverControlledPoints + this.endgamePoints + this.penaltyPoints,
            0
        );
        this.totalPointsNp = this.autoPoints + this.driverControlledPoints + this.endgamePoints;
    }

    static fromApiRemote(
        season: Season,
        eventCode: string,
        matchId: number,
        ms: MatchScores2021RemoteFtcApi
    ): MatchScores2021 {
        let s = ms.scores;
        let dbms = MatchScores2021.create({
            season,
            eventCode,
            matchId,
            alliance: Alliance.SOLO,
            randomization: ms.randomization,
            barcodeElement: barcodeElementFromApi(s.barcodeElement),
            autoCarousel: s.carousel,
            autoNavigation: autoNavigation2021FromApi(s.autoNavigated),
            autoBonus: s.autoBonus,
            autoStorageFreight: s.autoStorageFreight,
            autoFreight1: s.autoFreight1,
            autoFreight2: s.autoFreight2,
            autoFreight3: s.autoFreight3,
            driverControlledStorageFreight: s.driverControlledStorageFreight,
            driverControlledFreight1: s.driverControlledFreight1,
            driverControlledFreight2: s.driverControlledFreight2,
            driverControlledFreight3: s.driverControlledFreight3,
            endgameDucksDelivered: s.endgameDelivered,
            allianceBalanced: s.allianceBalanced,
            endgamePark: endgamePark2021FromApi(s.endgameParked),
            capped: s.capped,
            minorPenalties: s.minorPenalties,
            majorPenalties: s.majorPenalties,
        } as DeepPartial<MatchScores2021>);
        dbms.addGeneratedProps();
        return dbms;
    }

    static fromTradApi(
        season: Season,
        eventCode: string,
        matchId: number,
        ms: MatchScores2021TradFtcApi
    ): MatchScores2021[] {
        return ms.alliances.map((a) => {
            let dbms = MatchScores2021.create({
                season,
                eventCode,
                matchId,
                alliance: allianceFromString(a.alliance),
                randomization: ms.randomization,
                barcodeElement: barcodeElementFromApi(a.barcodeElement1),
                barcodeElement2: barcodeElementFromApi(a.barcodeElement2),
                autoCarousel: a.carousel,
                autoNavigation: autoNavigation2021FromApi(a.autoNavigated1),
                autoNavigation2: autoNavigation2021FromApi(a.autoNavigated2),
                autoBonus: a.autoBonus1,
                autoBonus2: a.autoBonus2,
                autoStorageFreight: a.autoStorageFreight,
                autoFreight1: a.autoFreight1,
                autoFreight2: a.autoFreight2,
                autoFreight3: a.autoFreight3,
                driverControlledStorageFreight: a.driverControlledStorageFreight,
                driverControlledFreight1: a.driverControlledFreight1,
                driverControlledFreight2: a.driverControlledFreight2,
                driverControlledFreight3: a.driverControlledFreight3,
                sharedFreight: a.sharedFreight,
                endgameDucksDelivered: a.endgameDelivered,
                allianceBalanced: a.allianceBalanced,
                sharedUnbalanced: a.sharedUnbalanced,
                endgamePark: endgamePark2021FromApi(a.endgameParked1),
                endgamePark2: endgamePark2021FromApi(a.endgameParked2),
                capped: a.capped,
                minorPenalties: a.minorPenalties,
                majorPenalties: a.majorPenalties,
            } as DeepPartial<MatchScores2021>);
            dbms.addGeneratedProps();
            return dbms;
        });
    }
}
