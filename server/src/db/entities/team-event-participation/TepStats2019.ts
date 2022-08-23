import { Column, Index } from "typeorm";

export class TepStats2019 {
    @Column("float")
    autoNavigationPoints!: number;

    @Column("float")
    autoNavigationPointsIndividual!: number;

    @Column("float")
    autoRepositioningPoints!: number;

    @Column("float")
    autoDeliveryPoints!: number;

    @Column("float")
    autoPlacementPoints!: number;

    @Column("float")
    dcDeliveryPoints!: number;

    @Column("float")
    dcPlacementPoints!: number;

    @Column("float")
    dcSkyscraperBonusPoints!: number;

    @Column("float")
    cappingPoints!: number;

    @Column("float")
    cappingPointsIndividual!: number;

    @Column("float")
    parkingPoints!: number;

    @Column("float")
    parkingPointsIndividual!: number;

    @Column("float")
    foundationMovedPoints!: number;

    @Column("float")
    @Index()
    autoPoints!: number;

    @Column("float")
    @Index()
    dcPoints!: number;

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
