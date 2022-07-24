import { Field, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Season } from "../../ftc-api/types/Season";
import { Match } from "./Match";
import { TeamEventParticipation2021 } from "./team-event-participation/TeamEventParticipation2021";
import { EventType } from "./types/EventType";

export const EVENT_CODE_LEN = 16;

@ObjectType()
@Entity()
export class Event extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn("smallint")
    season!: Season;

    @Field()
    @PrimaryColumn("varchar", { length: EVENT_CODE_LEN })
    code!: string;

    @Field(() => [Match])
    @OneToMany(() => Match, (match) => match.event)
    @TypeormLoader()
    matches!: Match[];

    // @Field(() => [TeamMatchParticipation])
    // @OneToMany(() => TeamMatchParticipation, (tmp) => tmp.event)
    // @TypeormLoader()
    // teamMatches!: TeamMatchParticipation[];

    @Field(() => [TeamEventParticipation2021])
    @OneToMany(() => TeamEventParticipation2021, (tep) => tep.event)
    @TypeormLoader()
    teams!: TeamEventParticipation2021[];

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    divisionCode!: string | null;

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    remote!: boolean;

    @Field()
    @Column()
    hybrid!: boolean;

    @Field()
    @Column()
    fieldCount!: number;

    @Field()
    @Column()
    published!: boolean; // TODO - figure out what this means

    @Field(() => EventType)
    @Column("enum", { enum: EventType })
    type!: EventType;

    @Field()
    @Column()
    regionCode!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    leagueCode!: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    districtCode!: string | null;

    @Field()
    @Column()
    venue!: string;

    @Field()
    @Column()
    address!: string;

    @Field()
    @Column()
    country!: string;

    @Field()
    @Column()
    stateOrProvince!: string;

    @Field()
    @Column()
    city!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    website!: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    liveStreamURL!: string | null;

    @Field(() => [String])
    @Column({ type: "varchar", array: true })
    webcasts!: string[];

    @Field()
    @Column()
    timezone!: string;

    @Field(() => String)
    @Column("date", { nullable: true })
    start!: string | Date;

    @Field(() => String)
    @Column("date", { nullable: true })
    end!: string | Date;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
