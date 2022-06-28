import { Field, Float, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Team } from "./Team";
import { Event, EVENT_CODE_LEN } from "./Event";
import { Season } from "../../ftc-api/types/Season";
import { TypeormLoader } from "type-graphql-dataloader";

@ObjectType()
@Entity()
export class TeamEventParticipation extends BaseEntity {
    @Field(() => Int, { name: "season" })
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn({ length: EVENT_CODE_LEN })
    eventCode!: string;

    @PrimaryColumn("smallint")
    teamNumber!: number;

    @Field(() => Event)
    @ManyToOne(() => Event, (event) => event.teams)
    @TypeormLoader()
    event!: Event;

    @Field(() => Team)
    @ManyToOne(() => Team, (team) => team.events)
    @TypeormLoader()
    team!: Team;

    @Field(() => Int, { nullable: true })
    @Column("int8", { nullable: true })
    rank!: number | null;

    @Field(() => Int, { nullable: true })
    @Column("int8", { nullable: true })
    wins!: number | null;

    @Field(() => Int, { nullable: true })
    @Column("int8", { nullable: true })
    losses!: number | null;

    @Field(() => Int, { nullable: true })
    @Column("int8", { nullable: true })
    ties!: number | null;

    @Field(() => Int, { nullable: true })
    @Column("int", { nullable: true })
    qualPoints!: number | null;

    @Field(() => Float, { nullable: true })
    @Column("float", { nullable: true })
    qualAverage!: number | null;

    @Field(() => Int, { nullable: true })
    @Column("int8", { nullable: true })
    dq!: number | null;

    @Field(() => Int, { nullable: true })
    @Column("int8", { nullable: true })
    qualMatchesPlayed!: number | null;

    @Field(() => Int, { nullable: true })
    @Column("int8", { nullable: true })
    matchesPlayed!: number | null;
}
