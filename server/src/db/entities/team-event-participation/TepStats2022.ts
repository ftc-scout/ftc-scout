import { Field, Float, ObjectType } from "type-graphql";
import { Column, Index } from "typeorm";

@ObjectType("TeamEventStatGroup2022")
export class TepStats2022 {
    @Field(() => Float)
    @Column("float")
    autoNavigationPoints!: number;

    @Field(() => Float)
    @Column("float")
    autoNavigationPointsIndividual!: number;

    @Field(() => Float)
    @Column("float")
    autoConePoints!: number;

    @Field(() => Float)
    @Column("float")
    autoTerminalPoints!: number;
    @Field(() => Float)
    @Column("float")
    autoGroundPoints!: number;
    @Field(() => Float)
    @Column("float")
    autoLowPoints!: number;
    @Field(() => Float)
    @Column("float")
    autoMediumPoints!: number;
    @Field(() => Float)
    @Column("float")
    autoHighPoints!: number;

    @Field(() => Float)
    @Column("float")
    dcTerminalPoints!: number;
    @Field(() => Float)
    @Column("float")
    dcGroundPoints!: number;
    @Field(() => Float)
    @Column("float")
    dcLowPoints!: number;
    @Field(() => Float)
    @Column("float")
    dcMediumPoints!: number;
    @Field(() => Float)
    @Column("float")
    dcHighPoints!: number;

    @Field(() => Float)
    @Column("float")
    endgameNavigationPoints!: number;

    @Field(() => Float)
    @Column("float")
    endgameNavigationPointsIndividual!: number;

    @Field(() => Float)
    @Column("float")
    ownershipPoints!: number;

    @Field(() => Float)
    @Column("float")
    coneOwnershipPoints!: number;

    @Field(() => Float)
    @Column("float")
    beaconOwnershipPoints!: number;

    @Field(() => Float)
    @Column("float")
    circuitPoints!: number;

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
