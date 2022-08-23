import { BaseEntity, Column, Entity, Index, ManyToOne, PrimaryColumn } from "typeorm";
import { Team } from "../Team";
import { Event } from "../Event";
import { Season } from "../../../ftc-api/types/Season";
import { TypeormLoader } from "type-graphql-dataloader";
import { Award } from "../Award";
import { TepStats2019 } from "./TepStats2019";

@Entity()
export class TeamEventParticipation2019 extends BaseEntity {
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    teamNumber!: number;

    // @ManyToOne(() => Event, (event) => event.teams)
    // @TypeormLoader()
    // event!: Event;

    // @Field(() => [Award])
    // @OneToMany(() => Award, (award) => award.teamEventParticipation)
    // @TypeormLoader()
    // awards!: Award[];

    // @ManyToOne(() => Team, (team) => team.events2019)
    // @TypeormLoader()
    // team!: Team;

    @Column("float", { nullable: true })
    @Index()
    rp!: number | null;

    @Column("float", { nullable: true })
    tb!: number | null;

    @Column("int8", { nullable: true })
    @Index()
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
    @Index()
    qualMatchesPlayed!: number | null;

    @Column()
    @Index()
    hasStats!: boolean;

    @Column(() => TepStats2019)
    tot!: TepStats2019;

    @Column(() => TepStats2019)
    avg!: TepStats2019;

    @Column(() => TepStats2019)
    min!: TepStats2019;

    @Column(() => TepStats2019)
    max!: TepStats2019;

    @Column(() => TepStats2019)
    dev!: TepStats2019;

    @Column(() => TepStats2019)
    opr!: TepStats2019;
}
