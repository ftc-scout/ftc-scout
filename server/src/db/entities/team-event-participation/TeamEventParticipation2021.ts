import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Team } from "../Team";
import { Event } from "../Event";
import { Season } from "../../../ftc-api/types/Season";
import { TypeormLoader } from "type-graphql-dataloader";
import { Award } from "../Award";
import { TepStats2021 } from "./TepStats2021";

@ObjectType()
@Entity()
export class TeamEventParticipation2021 extends BaseEntity {
    @Field(() => Int, { name: "season" })
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @Field()
    @PrimaryColumn()
    eventCode!: string;

    @Field(() => Int)
    @PrimaryColumn("int")
    teamNumber!: number;

    @Field(() => Event)
    @ManyToOne(() => Event, (event) => event.teams)
    @TypeormLoader()
    event!: Event;

    @Field(() => [Award])
    @OneToMany(() => Award, (award) => award.teamEventParticipation)
    @TypeormLoader()
    awards!: Award[];

    @Field(() => Team)
    @ManyToOne(() => Team, (team) => team.events)
    @TypeormLoader()
    team!: Team;

    @Column("int", { nullable: true })
    rp!: number | null;

    @Column("int", { nullable: true })
    tb1!: number | null;

    @Column("int", { nullable: true })
    tb2!: number | null;

    @Column("int8", { nullable: true })
    rank!: number | null;

    @Column("int8", { nullable: true })
    wins!: number | null;

    @Column("int8", { nullable: true })
    losses!: number | null;

    @Column("int8", { nullable: true })
    ties!: number | null;

    @Column("int8", { nullable: true })
    dq!: number | null;

    @Column("int8", { nullable: true })
    qualMatchesPlayed!: number | null;

    @Column()
    hasStats!: boolean;

    @Column(() => TepStats2021)
    tot!: TepStats2021;

    @Column(() => TepStats2021)
    avg!: TepStats2021;

    @Column(() => TepStats2021)
    min!: TepStats2021;

    @Column(() => TepStats2021)
    max!: TepStats2021;

    @Column(() => TepStats2021)
    dev!: TepStats2021;

    @Column(() => TepStats2021)
    opr!: TepStats2021;
}
