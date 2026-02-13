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

@Entity()
export class LeagueTeam extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn({ type: "varchar" })
    leagueCode!: string;

    @Column({ type: "varchar", nullable: true })
    regionCode!: string | null;

    @PrimaryColumn("int")
    teamNumber!: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static createFromTeam(
        season: Season,
        leagueCode: string,
        teamNumber: number,
        regionCode: string | null
    ): LeagueTeam {
        return LeagueTeam.create({
            season,
            leagueCode,
            regionCode,
            teamNumber,
        } satisfies DeepPartial<LeagueTeam>);
    }
}
