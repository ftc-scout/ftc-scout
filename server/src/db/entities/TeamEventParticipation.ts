import { Field, Float, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import {
    BaseEntity,
    Column,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from "typeorm";
import { Team } from "./Team";
import { Event } from "./Event";

@ObjectType()
@Entity()
export class TeamEventParticipation extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field(() => Event)
    @ManyToOne(() => Event, (event) => event.teams)
    @TypeormLoader()
    event!: Event;

    @Field(() => Team)
    @ManyToOne(() => Team, (team) => team.events)
    @TypeormLoader()
    team!: Team;

    @Field(() => Int)
    @Column("int8")
    rank!: number;

    @Field(() => Int)
    @Column("int8")
    wins!: number;

    @Field(() => Int)
    @Column("int8")
    losses!: number;

    @Field(() => Int)
    @Column("int8")
    ties!: number;

    @Field(() => Float)
    @Column("float")
    qualAverage!: number;

    @Field(() => Int)
    @Column("int8")
    dq!: number;

    @Field(() => Int)
    @Column("int8")
    matchesPlayed!: number;

    //matchesCounted: number //This filed also exists but I'm not sure what it is
}
