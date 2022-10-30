import { BaseEntity, Column, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Season } from "../../ftc-api/types/Season";
import { Match } from "./Match";
import { Alliance, allianceFromString } from "./types/Alliance";
import { BarcodeElement2021, barcodeElementFromApi } from "./types/2021/BarcodeElement2021";
import { AutoNavigation2021, autoNavigation2021FromApi } from "./types/2021/AutoNavigation2021";
import { EndgamePark2021, endgamePark2021FromApi } from "./types/2021/EndgamePark2021";
import { MatchScores2021RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2021Remote";
import { MatchScores2021TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2021Trad";
import assert from "assert";

@Entity()
export class MatchScores2021 extends BaseEntity {
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

    @Column("enum", { enum: BarcodeElement2021 })
    barcodeElement!: BarcodeElement2021;

    @Column("enum", { enum: BarcodeElement2021, nullable: true })
    barcodeElement2!: BarcodeElement2021 | null;

    @Column()
    autoCarousel!: boolean;

    @Column("enum", { enum: AutoNavigation2021 })
    autoNavigation!: AutoNavigation2021;

    @Column("enum", { enum: AutoNavigation2021, nullable: true })
    autoNavigation2!: AutoNavigation2021 | null;

    @Column()
    autoBonus!: boolean;

    @Column("bool", { nullable: true })
    autoBonus2!: boolean;

    @Column("int8")
    autoStorageFreight!: number;

    @Column("int8")
    autoFreight1!: number;

    @Column("int8")
    autoFreight2!: number;

    @Column("int8")
    autoFreight3!: number;

    @Column("int8")
    driverControlledStorageFreight!: number;

    @Column("int8")
    driverControlledFreight1!: number;

    @Column("int8")
    driverControlledFreight2!: number;

    @Column("int8")
    driverControlledFreight3!: number;

    @Column("int8", { nullable: true })
    sharedFreight!: number | null;

    @Column("int8")
    endgameDucksDelivered!: number;

    @Column()
    allianceBalanced!: boolean;

    @Column("bool", { nullable: true })
    sharedUnbalanced!: boolean | null;

    @Column("enum", { enum: EndgamePark2021 })
    endgamePark!: EndgamePark2021;

    @Column("enum", { enum: EndgamePark2021, nullable: true })
    endgamePark2!: EndgamePark2021 | null;

    @Column("int8")
    capped!: number;

    @Column("int8")
    minorPenalties!: number;

    @Column("int8")
    majorPenalties!: number;

    @Column("int8")
    autoCarouselPoints!: number;

    @Column("int8")
    autoNavigationPoints!: number;

    @Column("int8")
    autoFreightPoints!: number;

    @Column("int8")
    autoBonusPoints!: number;

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
        assert(dbms.totalPoints == s.totalPoints);
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
            assert(dbms.totalPoints == a.totalPoints);
            return dbms;
        });
    }
}
