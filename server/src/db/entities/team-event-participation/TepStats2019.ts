import { Field, Float, ObjectType } from "type-graphql";
import { Column, Index } from "typeorm";

@ObjectType()
export class TepStats2019 {
    @Field(() => Float)
    @Column("float")
    autoNavigationPoints!: number;

    @Field(() => Float)
    @Column("float")
    autoNavigationPointsIndividual!: number;

    @Field(() => Float)
    @Column("float")
    autoRepositioningPoints!: number;

    @Field(() => Float)
    @Column("float")
    autoDeliveryPoints!: number;

    @Field(() => Float)
    @Column("float")
    autoPlacementPoints!: number;

    @Field(() => Float)
    @Column("float")
    dcDeliveryPoints!: number;

    @Field(() => Float)
    @Column("float")
    dcPlacementPoints!: number;

    @Field(() => Float)
    @Column("float")
    dcSkyscraperBonusPoints!: number;

    @Field(() => Float)
    @Column("float")
    cappingPoints!: number;

    @Field(() => Float)
    @Column("float")
    cappingPointsIndividual!: number;

    @Field(() => Float)
    @Column("float")
    parkingPoints!: number;

    @Field(() => Float)
    @Column("float")
    parkingPointsIndividual!: number;

    @Field(() => Float)
    @Column("float")
    foundationMovedPoints!: number;

    @Field(() => Float)
    @Column("float")
    @Index()
    autoPoints!: number;

    @Field(() => Float)
    @Column("float")
    @Index()
    dcPoints!: number;

    @Field(() => Float)
    @Column("float")
    @Index()
    endgamePoints!: number;

    @Field(() => Float)
    @Column("float")
    @Index()
    penaltyPoints!: number;

    @Field(() => Float)
    @Column("float")
    @Index()
    totalPoints!: number;

    @Field(() => Float)
    @Column("float")
    @Index()
    totalPointsNp!: number;
}
