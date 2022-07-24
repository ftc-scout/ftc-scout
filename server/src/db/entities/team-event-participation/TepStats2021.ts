import { Column } from "typeorm";

export class TepStats2021 {
    @Column("float")
    autoCarouselPoints!: number;

    @Column("float")
    autoNavigationPoints!: number;

    @Column("float")
    autoNavigationPointsIndividual!: number;

    @Column("float")
    autoFreightPoints!: number;

    @Column("float")
    autoFreightPointsLevel1!: number;
    @Column("float")
    autoFreightPointsLevel2!: number;
    @Column("float")
    autoFreightPointsLevel3!: number;
    @Column("float")
    autoFreightPointsStorage!: number;

    @Column("float")
    autoBonusPoints!: number;

    @Column("float")
    autoBonusPointsIndividual!: number;

    @Column("float")
    driverControlledAllianceHubPoints!: number;

    @Column("float")
    driverControlledAllianceHubPointsLevel1!: number;
    @Column("float")
    driverControlledAllianceHubPointsLevel2!: number;
    @Column("float")
    driverControlledAllianceHubPointsLevel3!: number;

    @Column("float", { nullable: true })
    driverControlledSharedHubPoints!: number | null;

    @Column("float")
    driverControlledStoragePoints!: number;

    @Column("float")
    endgameDeliveryPoints!: number;

    @Column("float")
    allianceBalancedPoints!: number;

    @Column("float", { nullable: true })
    sharedUnbalancedPoints!: number | null;

    @Column("float")
    endgameParkingPoints!: number;

    @Column("float")
    endgameParkingPointsIndividual!: number;

    @Column("float")
    cappingPoints!: number;

    @Column("float")
    autoPoints!: number;

    @Column("float")
    driverControlledPoints!: number;

    @Column("float")
    endgamePoints!: number;

    @Column("float")
    penaltyPoints!: number;

    @Column("float")
    totalPoints!: number;

    @Column("float")
    totalPointsNp!: number;
}
