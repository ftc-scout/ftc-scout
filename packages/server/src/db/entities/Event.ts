import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { EventFtcApi, EventType, Season, eventTypeFromFtcApi } from "@ftc-scout/common";
import { Match } from "./Match";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Event extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn("smallint")
    season!: Season;

    @Field()
    @PrimaryColumn()
    code!: string;

    @OneToMany(() => Match, (match) => match.event)
    matches!: Match[];

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

    @Field(() => Int)
    @Column()
    fieldCount!: number;

    @Field()
    @Column()
    published!: boolean;

    @Field(() => EventType)
    @Column("enum", { enum: EventType })
    type!: EventType;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    regionCode!: string | null;

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
    state!: string;

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
    @Column("json")
    webcasts!: string[];

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    timezone!: string | null;

    @Field()
    @Column("date")
    start!: Date;

    @Field()
    @Column("date")
    end!: Date;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(api: EventFtcApi, season: Season): Event {
        let type = eventTypeFromFtcApi(api.typeName ?? "");
        if (
            api.code == null ||
            type == null ||
            api.country == null ||
            api.stateprov == null ||
            api.city == null ||
            api.venue == null ||
            api.address == null
        ) {
            console.log(api, type);
            throw `Rejecting api event ${season} ${api.code}.`;
        }

        const EVENT_RENAMING: Record<string, string> = {
            FTCCMP1: "FIRST World Championship - Finals Division",
            FTCCMP1FRNK: "FIRST World Championship - Franklin Division",
            FTCCMP1FRAN: "FIRST World Championship - Franklin Division",
            FTCCMP1JEMI: "FIRST World Championship - Jemison Division",
            FTCCMP1EDIS: "FIRST World Championship - Edison Division",
            FTCCMP1OCHO: "FIRST World Championship - Ochoa Division",
        };

        return Event.create({
            season,
            code: api.code,
            divisionCode: api.divisionCode ? api.divisionCode : null,
            name: (EVENT_RENAMING[api.code] ?? api.name).trim(),
            remote: api.remote,
            hybrid: api.hybrid,
            fieldCount: api.fieldCount,
            published: api.published,
            type,
            regionCode: api.regionCode,
            leagueCode: api.leagueCode,
            districtCode: api.districtCode ? api.districtCode : null,
            venue: api.venue.trim(),
            address: api.address?.trim(),
            country: api.country,
            state: api.stateprov,
            city: api.city,
            website: api.website ? api.website.trim() : null,
            liveStreamURL: api.liveStreamUrl ? api.liveStreamUrl.trim() : null,
            webcasts: api.webcasts ? api.webcasts : [],
            timezone: api.timezone,
            start: new Date(api.dateStart),
            end: new Date(api.dateEnd),
        } satisfies DeepPartial<Event>);
    }
}
