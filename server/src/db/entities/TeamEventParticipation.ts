import { Field, Float, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Team } from "./Team";
import { Event, EVENT_CODE_LEN } from "./Event";
import { Season } from "../../ftc-api/types/Season";

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

    //matchesCounted: number //This field also exists but I'm not sure what it is
}
