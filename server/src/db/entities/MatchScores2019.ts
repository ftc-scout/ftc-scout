import { MatchScores2019FtcApi } from "src/ftc-api/types/match-scores/MatchScores2019";
import { Season } from "../../ftc-api/types/Season";
import { BaseEntity, Column, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Match } from "./Match";
import { Alliance, allianceFromString } from "./types/Alliance";
import assert from "assert";

@Entity()
export class MatchScores2019 extends BaseEntity {
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

    @Column()
    navigated1!: boolean;

    @Column()
    navigated2!: boolean;

    @Column()
    repositioned!: boolean;

    @Column("int8")
    autoStonesDelivered!: number;

    @Column("int8")
    autoSkystoneDeliveredFirst!: number;

    @Column("int8")
    autoReturned!: number;

    @Column()
    autoFirstReturnedSkystone!: boolean;

    @Column("int8")
    autoStonesPlaced!: number;

    @Column("int8")
    dcStonesDelivered!: number;

    @Column("int8")
    dcReturned!: number;

    @Column("int8")
    dcStonesPlaced!: number;

    @Column("int8")
    dcSkyscraperHeight!: number;

    @Column("int8")
    capLevel1!: number;

    @Column("int8")
    capLevel2!: number;

    @Column()
    foundationMoved!: boolean;

    @Column()
    parked1!: boolean;

    @Column()
    parked2!: boolean;

    @Column("int8")
    majorPenalties!: number;

    @Column("int8")
    minorPenalties!: number;

    @Column("int8")
    autoNavigationPoints!: number;

    @Column("int8")
    autoRepositioningPoints!: number;

    @Column("int8")
    autoDeliveryPoints!: number;

    @Column("int8")
    autoPlacementPoints!: number;

    @Column("int8")
    dcDeliveryPoints!: number;

    @Column("int8")
    dcPlacementPoints!: number;

    @Column("int8")
    dcSkyscraperBonusPoints!: number;

    @Column("int8")
    cappingPoints!: number;

    @Column("int8")
    parkingPoints!: number;

    @Column("int8")
    foundationMovedPoints!: number;

    @Column("smallint")
    autoPoints!: number;

    @Column("smallint")
    dcPoints!: number;

    @Column("smallint")
    endgamePoints!: number;

    @Column("smallint")
    penaltyPoints!: number;

    @Column("smallint")
    totalPoints!: number;

    @Column("smallint")
    totalPointsNp!: number;

    static calcCapPoints(level: number): number {
        return level == -1 ? 0 : level + 5;
    }

    addGeneratedProps() {
        this.autoNavigationPoints = (this.navigated1 ? 5 : 0) + (this.navigated2 ? 5 : 0);
        this.autoRepositioningPoints = this.repositioned ? 10 : 0;
        this.autoDeliveryPoints =
            this.autoStonesDelivered * 2 +
            this.autoSkystoneDeliveredFirst * 8 -
            this.autoReturned * 2 -
            (this.autoFirstReturnedSkystone ? 8 : 0);
        this.autoPlacementPoints = this.autoStonesPlaced * 4;

        this.dcDeliveryPoints = this.dcStonesDelivered - this.dcReturned;
        this.dcPlacementPoints = this.dcStonesPlaced;
        this.dcSkyscraperBonusPoints = this.dcSkyscraperHeight * 2;

        this.cappingPoints =
            MatchScores2019.calcCapPoints(this.capLevel1) + MatchScores2019.calcCapPoints(this.capLevel2);
        this.parkingPoints = (this.parked1 ? 5 : 0) + (this.parked2 ? 5 : 0);
        this.foundationMovedPoints = this.foundationMoved ? 15 : 0;

        this.autoPoints =
            this.autoNavigationPoints +
            this.autoRepositioningPoints +
            this.autoDeliveryPoints +
            this.autoPlacementPoints;
        this.dcPoints = this.dcDeliveryPoints + this.dcPlacementPoints + this.dcSkyscraperBonusPoints;
        this.endgamePoints = this.cappingPoints + this.parkingPoints + this.foundationMovedPoints;
        // penalty points are already calculated since they must come from the other alliance.

        this.totalPoints = Math.max(this.autoPoints + this.dcPoints + this.endgamePoints + this.penaltyPoints, 0);
        this.totalPointsNp = this.autoPoints + this.dcPoints + this.endgamePoints;
    }

    static fromApi(season: Season, eventCode: string, matchId: number, ms: MatchScores2019FtcApi): MatchScores2019[] {
        return ms.alliances.map((a) => {
            let dbms = MatchScores2019.create({
                season,
                eventCode,
                matchId,
                alliance: allianceFromString(a.alliance),
                navigated1: a.robot1Navigated,
                navigated2: a.robot2Navigated,
                repositioned: a.foundationRepositioned,
                autoStonesDelivered: a.autoDelivered,
                autoSkystoneDeliveredFirst:
                    a.autoStones == null
                        ? 0
                        : (a.autoStones[0] == "SKYSTONE" ? 1 : 0) + (a.autoStones[1] == "SKYSTONE" ? 1 : 0),
                autoReturned: a.autoReturned,
                autoFirstReturnedSkystone: a.firstReturnedIsSkystone,
                autoStonesPlaced: a.autoPlaced,
                dcStonesDelivered: a.driverControlledDelivered,
                dcReturned: a.driverControlledReturned,
                dcStonesPlaced: a.driverControlledPlaced,
                dcSkyscraperHeight: a.tallestSkyscraper,
                capLevel1: a.robot1CapstoneLevel,
                capLevel2: a.robot2CapstoneLevel,
                foundationMoved: a.foundationMoved,
                parked1: a.robot1Parked,
                parked2: a.robot2Parked,
                majorPenalties: a.majorPenalties,
                minorPenalties: a.minorPenalties,
                penaltyPoints: a.penaltyPoints, // this is penalties committed bu the other alliance
            } as DeepPartial<MatchScores2019>);
            dbms.addGeneratedProps();
            assert(dbms.totalPoints == a.totalPoints);
            return dbms;
        });
    }
}
