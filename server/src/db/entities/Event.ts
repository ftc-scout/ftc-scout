import { Field, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Season } from "../../ftc-api/types/Season";
import { Match } from "./Match";
import { TeamEventParticipation } from "./TeamEventParticipation";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
    @Field()
    @PrimaryColumn({ type: "uuid", unique: true })
    eventId!: string;

    @Field()
    @Column()
    season!: Season;

    @Field()
    @Column()
    code!: string;

    @Field(() => [Match])
    @OneToMany(() => Match, (match) => match.event)
    @TypeormLoader()
    matches!: Match[];

    @Field(() => [TeamEventParticipation])
    @OneToMany(() => TeamEventParticipation, (tep) => tep.event)
    @TypeormLoader()
    teams!: TeamEventParticipation[];

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
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

    @Field()
    @Column()
    type!: string; // TODO - An enum supposedly

    @Field()
    @Column()
    regionCode!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    leagueCode!: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
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
    @Column({ type: "text", nullable: true })
    website!: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    liveStreamURL!: string | null;

    @Field(() => [String])
    @Column({ type: "text", array: true })
    webcasts!: string[];

    @Field()
    @Column()
    timezone!: string;

    @Field()
    @Column()
    start!: Date;

    @Field()
    @Column()
    end!: Date;

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;
}
