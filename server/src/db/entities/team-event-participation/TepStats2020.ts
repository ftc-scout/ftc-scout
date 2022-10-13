import { Column, Index } from "typeorm";

export class TepStats2020 {
    @Column("float")
    autoNavigationPoints!: number;

    @Column("float")
    autoNavigationPointsIndividual!: number;

    @Column("float")
    autoGoalPoints!: number;

    @Column("float")
    autoGoalPointsLow!: number;
    @Column("float")
    autoGoalPointsMid!: number;
    @Column("float")
    autoGoalPointsHigh!: number;

    @Column("float")
    autoWobblePoints!: number;

    @Column("float")
    autoPowershotPoints!: number;

    @Column("float")
    endgameWobblePoints!: number;

    @Column("float")
    endgameWobbleRingPoints!: number;

    @Column("float")
    majorPenaltyPoints!: number;

    @Column("float")
    minorPenaltyPoints!: number;

    @Column("float")
    @Index()
    autoPoints!: number;

    @Column("float")
    @Index()
    driverControlledPoints!: number;

    @Column("float")
    driverControlledPointsLow!: number;
    @Column("float")
    driverControlledPointsMid!: number;
    @Column("float")
    driverControlledPointsHigh!: number;

    @Column("float")
    @Index()
    endgamePoints!: number;

    @Column("float")
    @Index()
    penaltyPoints!: number;

    @Column("float")
    @Index()
    totalPoints!: number;

    @Column("float")
    @Index()
    totalPointsNp!: number;
}
