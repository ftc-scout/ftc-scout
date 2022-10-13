import { MatchScores2020RemoteFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Remote";
import { MatchScores2020TradFtcApi } from "../../ftc-api/types/match-scores/MatchScores2020Trad";
import { Season } from "../../ftc-api/types/Season";
import { BaseEntity, Column, DeepPartial, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Match } from "./Match";
import { Alliance } from "./types/Alliance";
import { WobbleEndPositions, wobbleEndPositionsFromApi } from "./types/2020/WobbleEndPositions";

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

    @Column("bool", { nullable: true })
    autoWobble2!: boolean | null;

    @Column()
    autoNavigated!: boolean;

    @Column("bool", { nullable: true })
    autoNavigated2!: boolean | null;

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
    autoPowershotPoints!: number;

    @Column("int8")
    endgameWobblePoints!: number;

    @Column("int8")
    endgamePowershotPoints!: number;

    @Column("int8")
    endgameWobbleRingPoints!: number;

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

    static calcEndgameWobblePoints(pos: WobbleEndPositions | null): number {
        return pos == null
            ? 0
            : {
                  [WobbleEndPositions.NONE]: 0,
                  [WobbleEndPositions.START_LINE]: 5,
                  [WobbleEndPositions.DROP_ZONE]: 20,
              }[pos];
    }

    addGeneratedProps() {
        this.autoNavigationPoints = (this.autoNavigated ? 5 : 0) + (this.autoNavigated2 ? 5 : 0);
        this.autoGoalPoints = this.autoGoalLow * 3 + this.autoGoalMid * 6 + this.autoGoalHigh * 12;
        this.autoWobblePoints = (this.autoWobble ? 15 : 0) + (this.autoWobble2 ? 15 : 0);
        this.autoPowershotPoints = this.autoPowershots * 15;
        this.endgamePowershotPoints = this.endgamePowershots * 15;
        this.endgameWobblePoints =
            MatchScores2020.calcEndgameWobblePoints(this.wobbleEndPositions) +
            MatchScores2020.calcEndgameWobblePoints(this.wobbleEndPositions2);
        this.endgameWobbleRingPoints = this.endgameRingsOnWobble * 5;

        this.autoPoints =
            this.autoNavigationPoints + this.autoGoalPoints + this.autoWobblePoints + this.autoPowershotPoints;
        this.driverControlledPoints =
            this.driverControlledLow * 2 + this.driverControlledMid * 4 + this.driverControlledHigh * 6;
        this.endgamePoints = this.endgamePowershotPoints + this.endgameWobblePoints + this.endgameWobbleRingPoints;
        this.penaltyPoints = this.majorPenalties * -30 + this.minorPenalties * -10;
    }

    static fromApiRemote(
        season: Season,
        eventCode: string,
        matchId: number,
        ms: MatchScores2020RemoteFtcApi
    ): MatchScores2020 {
        let s = ms.scores;
        let dbms = MatchScores2020.create({
            season,
            eventCode,
            matchId,
            alliance: Alliance.SOLO,
            randomization: ms.randomization,
            autoWobble: s.autoWobble,
            autoWobble2: null,
            autoNavigated: s.autoNavigated == "PAST_LAUNCH_LINE",
            autoNavigated2: null,
            autoPowershots: s.autoPowershot,
            autoGoalLow: s.autoGoalLow,
            autoGoalMid: s.autoGoalMid,
            autoGoalHigh: s.autoGoalHigh,
            driverControlledLow: s.driverControlledGoalLow,
            driverControlledMid: s.driverControlledGoalMid,
            driverControlledHigh: s.driverControlledGoalHigh,
            wobbleEndPositions: wobbleEndPositionsFromApi(s.wobbleEndPosititions),
            wobbleEndPositions2: null,
            endgameRingsOnWobble: s.ringsOnWobble,
            endgamePowershots: s.endgamePowerShots,
            minorPenalties: s.minorPenalties,
            majorPenalties: s.majorPenalties,
        } as DeepPartial<MatchScores2020>);
        dbms.addGeneratedProps();
        return dbms;
    }

    static fromTradApi(
        season: Season,
        eventCode: string,
        matchId: number,
        ms: MatchScores2020TradFtcApi
    ): MatchScores2020[] {
        return ms.alliances.map((a) => {
            let dbms = MatchScores2020.create({
                season,
                eventCode,
                matchId,
                alliance: Alliance.SOLO,
                randomization: ms.randomization,
                autoWobble: a.autoWobble1,
                autoWobble2: a.autoWobble2,
                autoNavigated: a.autoNavigated1 == "PAST_LAUNCH_LINE",
                autoNavigated2: a.autoNavigated2 == "PAST_LAUNCH_LINE",
                autoPowershots: a.autoPowershot,
                autoGoalLow: a.autoGoalLow,
                autoGoalMid: a.autoGoalMid,
                autoGoalHigh: a.autoGoalHigh,
                driverControlledLow: a.driverControlledGoalLow,
                driverControlledMid: a.driverControlledGoalMid,
                driverControlledHigh: a.driverControlledGoalHigh,
                wobbleEndPositions: wobbleEndPositionsFromApi(a.wobbleEndPositions1),
                wobbleEndPositions2: wobbleEndPositionsFromApi(a.wobbleEndPositions2),
                endgameRingsOnWobble: a.ringsOnWobble1 + a.ringsOnWobble2,
                endgamePowershots: a.endgamePowerShots,
                minorPenalties: a.minorPenalties,
                majorPenalties: a.majorPenalties,
            } as DeepPartial<MatchScores2020>);
            dbms.addGeneratedProps();
            return dbms;
        });
    }
}
