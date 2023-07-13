import { TeamFtcApi } from "@ftc-scout/common";
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
import { TeamMatchParticipation } from "./TeamMatchParticipation";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Team extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn("int")
    number!: number;

    @OneToMany(() => TeamMatchParticipation, (tmp) => tmp.team)
    matches!: TeamMatchParticipation[];

    @Field()
    @Column()
    name!: string;

    @Field()
    @Column()
    schoolName!: string;

    @Field(() => [String])
    @Column("json")
    sponsors!: string[];

    @Field()
    @Column()
    country!: string;

    @Field()
    @Column()
    state!: string;

    @Field()
    @Column()
    city!: string;

    @Field(() => Int)
    @Column()
    rookieYear!: number;

    @Field(() => String, { nullable: true })
    @Column({ type: "varchar", nullable: true })
    website?: string | null;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(api: TeamFtcApi): Team | null {
        if (
            api.nameShort == null ||
            api.country == null ||
            api.stateProv == null ||
            api.city == null ||
            api.rookieYear == null
        ) {
            console.warn(`Rejecting api team ${api.teamNumber}.`);
            return null;
        }

        let name = api.nameShort.trim();
        let schoolName: string | null;
        let sponsors: string[];

        if (api.nameFull == null) {
            schoolName = "Unknown";
            sponsors = [];
        } else if (api.nameFull.includes("&")) {
            let index = api.nameFull.lastIndexOf("&");
            let teamNamePart = api.nameFull.slice(index + 1);
            let sponsorsPart = api.nameFull.slice(0, index);

            schoolName = teamNamePart.trim();
            sponsors = sponsorsPart
                .split("/")
                .map((s) => s.trim())
                .filter((s) => !!s);
        } else {
            schoolName = api.nameFull?.trim() ?? null;
            sponsors = [];
        }
        return Team.create({
            number: api.teamNumber,
            name,
            schoolName,
            sponsors,
            country: api.country,
            state: api.stateProv,
            city: api.city,
            rookieYear: api.rookieYear,
            website: api.website,
        } satisfies DeepPartial<Team>);
    }
}
