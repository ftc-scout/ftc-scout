import { Field, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Season } from "../../ftc-api/types/Season";
import { Event, EVENT_CODE_LEN } from "./Event";
import { TeamMatchParticipation } from "./TeamMatchParticipation";
import { TournamentLevel } from "./types/TournamentLevel";

@ObjectType()
@Entity()
export class Match extends BaseEntity {
    @Field(() => Int, { name: "season" })
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn("varchar", { length: EVENT_CODE_LEN })
    eventCode!: string;

    @Field(() => Int)
    @PrimaryColumn("int")
    num!: number;

    @Field(() => Event)
    @ManyToOne(() => Event, (event) => event.matches)
    @TypeormLoader()
    event!: Event;

    @Field()
    @Column()
    hasBeenPlayed!: boolean;

    @Field(() => [TeamMatchParticipation])
    @OneToMany(() => TeamMatchParticipation, (tmp) => tmp.match)
    @TypeormLoader()
    teams!: TeamMatchParticipation[];

    @Field()
    @Column()
    scheduledStartTime!: Date;

    @Field(() => Date, { nullable: true })
    @Column("timestamptz", { nullable: true })
    actualStartTime!: Date | null;

    @Field(() => Date, { nullable: true })
    @Column("timestamptz", { nullable: true })
    postResultTime!: Date | null;

    @Field(() => TournamentLevel)
    @Column("enum", { enum: TournamentLevel })
    tournamentLevel!: TournamentLevel;

    @Field(() => Int)
    @Column("int8")
    series!: number;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
