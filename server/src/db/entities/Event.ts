import { Field } from "type-graphql";
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

@Entity()
export class Event extends BaseEntity {
    @Field()
    @PrimaryColumn({ type: "uuid", unique: true })
    eventId!: string;

    @Field()
    @Column()
    season!: Season;

    @Field(() => String)
    @Column({ type: "text" })
    code!: string;

    @OneToMany(() => Match, (match) => match.event)
    matches!: Match[];

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    divisionCode!: string | null;

    @Field(() => String)
    @Column({ type: "text" })
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

    @Field(() => String)
    @Column({ type: "text" })
    type!: string; // TODO - An enum supposedly

    @Field(() => String)
    @Column({ type: "text" })
    regionCode!: string;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    leagueCode!: string | null;

    @Field(() => String, { nullable: true })
    @Column({ type: "text", nullable: true })
    districtCode!: string | null;

    @Field(() => String)
    @Column({ type: "text" })
    venue!: string;

    @Field(() => String)
    @Column({ type: "text" })
    address!: string;

    @Field(() => String)
    @Column({ type: "text" })
    country!: string;

    @Field(() => String)
    @Column({ type: "text" })
    stateOrProvince!: string;

    @Field(() => String)
    @Column({ type: "text" })
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

    @Field(() => String)
    @Column({ type: "text" })
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
