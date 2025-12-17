import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Season } from "@ftc-scout/common";

export type LeagueApi = {
    region: string | null;
    code: string | null;
    name: string | null;
    remote: boolean | null;
    parentLeagueCode: string | null;
    parentLeagueName: string | null;
    location: string | null;
};

@Entity()
export class League extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn({ type: "varchar" })
    code!: string;

    @PrimaryColumn({ type: "varchar" })
    regionCode!: string;

    @Column({ type: "varchar" })
    name!: string;

    @Column("bool")
    remote!: boolean;

    @Column({ type: "varchar", nullable: true })
    parentLeagueCode!: string | null;

    @Column({ type: "varchar", nullable: true })
    parentLeagueName!: string | null;

    @Column({ type: "varchar", nullable: true })
    location!: string | null;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(api: LeagueApi, season: Season): League | null {
        if (!api.code || !api.name) {
            return null;
        }

        let region = api.region?.trim();
        if (!region) {
            region = "UNKNOWN";
        }

        return League.create({
            season,
            code: api.code,
            regionCode: region,
            name: api.name,
            remote: api.remote ?? false,
            parentLeagueCode: api.parentLeagueCode,
            parentLeagueName: api.parentLeagueName,
            location: api.location,
        } satisfies DeepPartial<League>);
    }
}
