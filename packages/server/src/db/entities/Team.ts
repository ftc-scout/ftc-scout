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

@Entity()
export class Team extends BaseEntity {
    @PrimaryColumn("int")
    number!: number;

    @OneToMany(() => TeamMatchParticipation, (tmp) => tmp.team)
    matches!: TeamMatchParticipation[];

    @Column()
    name!: string;

    @Column()
    schoolName!: string;

    @Column("json")
    sponsors!: string[];

    @Column()
    country!: string;

    @Column()
    state!: string;

    @Column()
    city!: string;

    @Column()
    rookieYear!: number;

    @Column({ type: "varchar", nullable: true })
    website?: string | null;

    @Column({ type: "varchar", nullable: true })
    regionCode?: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(api: TeamFtcApi): Team | null {
        if (api.nameShort == null || api.rookieYear == null) {
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
            country: api.country ?? "",
            state: api.stateProv ?? "",
            city: api.city ?? "",
            rookieYear: api.rookieYear,
            website: api.website,
            regionCode: (api as any).homeRegion ?? null,
        } satisfies DeepPartial<Team>);
    }
}
