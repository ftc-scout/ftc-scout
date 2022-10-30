import { BaseEntity, Column, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Season } from "../../ftc-api/types/Season";
import { Match } from "./Match";
import { Alliance, allianceFromString } from "./types/Alliance";
import { AutoNavigation2022, autoNavigation2022FromApi } from "./types/2022/AutoNavigation2022";
import { MatchScores2022TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2022Trad";
import { assert } from "console";

@Entity()
export class MatchScores2022 extends BaseEntity {
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
    autoNavigation1!: AutoNavigation2022;

    @Column()
    autoNavigation2!: AutoNavigation2022;

    @Column("int8")
    autoTerminalCones!: number;
    @Column("int8")
    autoGroundCones!: number;
    @Column("int8")
    autoLowCones!: number;
    @Column("int8")
    autoMediumCones!: number;
    @Column("int8")
    autoHighCones!: number;

    @Column("int8")
    dcTerminalCones!: number;
    @Column("int8")
    dcGroundCones!: number;
    @Column("int8")
    dcLowCones!: number;
    @Column("int8")
    dcMediumCones!: number;
    @Column("int8")
    dcHighCones!: number;

    @Column()
    endgameNavigated1!: boolean;

    @Column()
    endgameNavigated2!: boolean;

    @Column("int8")
    coneOwnedJunctions!: number;

    @Column("int8")
    beaconOwnedJunctions!: number;

    @Column()
    circuit!: boolean;

    @Column("int8")
    minorPenalties!: number;

    @Column("int8")
    majorPenalties!: number;

    @Column("smallint")
    autoNavigationPoints!: number;

    @Column("smallint")
    autoConePoints!: number;

    @Column("smallint")
    endgameNavigationPoints!: number;

    @Column("smallint")
    ownershipPoints!: number;

    @Column("smallint")
    circuitPoints!: number;

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

    static autoNavPoints(nav: AutoNavigation2022): number {
        return [0, 2, 10, 20][nav];
    }

    addGeneratedProps() {
        this.autoNavigationPoints =
            MatchScores2022.autoNavPoints(this.autoNavigation1) + MatchScores2022.autoNavPoints(this.autoNavigation2);
        this.autoConePoints =
            this.autoTerminalCones +
            this.autoGroundCones * 2 +
            this.autoLowCones * 3 +
            this.autoMediumCones * 4 +
            this.autoHighCones * 5;
        this.endgameNavigationPoints = (this.endgameNavigated1 ? 2 : 0) + (this.endgameNavigated2 ? 2 : 0);
        this.ownershipPoints = this.coneOwnedJunctions * 3 + this.beaconOwnedJunctions * 10;
        this.circuitPoints = this.circuit ? 20 : 0;

        this.autoPoints = this.autoNavigationPoints + this.autoConePoints;
        this.dcPoints =
            this.dcTerminalCones +
            this.dcGroundCones * 2 +
            this.dcLowCones * 3 +
            this.dcMediumCones * 4 +
            this.dcHighCones * 5;
        this.endgamePoints = this.endgameNavigationPoints + this.ownershipPoints + this.circuitPoints;
        // penalty points are already calculated since they must come from the other alliance.
        this.totalPoints = Math.max(this.autoPoints + this.dcPoints + this.endgamePoints + this.penaltyPoints, 0);
        this.totalPointsNp = this.autoPoints + this.dcPoints + this.endgamePoints;
    }

    static fromTradApi(
        season: Season,
        eventCode: string,
        matchId: number,
        ms: MatchScores2022TradFtcApi
    ): MatchScores2022[] {
        return ms.alliances.map((a) => {
            let other = ms.alliances.find((o) => o != a)!;
            let dbms = MatchScores2022.create({
                season,
                eventCode,
                matchId,
                alliance: allianceFromString(a.alliance),
                autoNavigation1: autoNavigation2022FromApi(a.robot1Auto, a.initSignalSleeve1),
                autoNavigation2: autoNavigation2022FromApi(a.robot2Auto, a.initSignalSleeve2),
                autoTerminalCones: a.autoTerminal,
                autoGroundCones: a.autoJunctionCones[0],
                autoLowCones: a.autoJunctionCones[1],
                autoMediumCones: a.autoJunctionCones[2],
                autoHighCones: a.autoJunctionCones[3],
                dcTerminalCones: a.dcTerminalNear + a.dcTerminalFar,
                dcGroundCones: a.dcJunctionCones[0],
                dcLowCones: a.dcJunctionCones[1],
                dcMediumCones: a.dcJunctionCones[2],
                dcHighCones: a.dcJunctionCones[3],
                endgameNavigated1: a.egNavigated1,
                endgameNavigated2: a.egNavigated2,
                coneOwnedJunctions: a.ownedJunctions - a.beacons,
                beaconOwnedJunctions: a.beacons,
                circuit: a.circuit,
                minorPenalties: a.majorPenalties,
                majorPenalties: a.minorPenalties,
                penaltyPoints: other.penaltyPointsCommitted,
            } as DeepPartial<MatchScores2022>);
            dbms.addGeneratedProps();
            assert(dbms.totalPoints == a.totalPoints);
            return dbms;
        });
    }
}
