import {
    BaseEntity,
    CreateDateColumn,
    DeepPartial,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { LeagueMembershipFtcApi, Season } from "@ftc-scout/common";
import { League } from "./League";

@Entity()
export class LeagueTeam extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn({ type: "varchar" })
    leagueCode!: string;

    @PrimaryColumn({ type: "varchar" })
    regionCode!: string;

    @PrimaryColumn("int")
    teamNumber!: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(participation: LeagueMembershipFtcApi | null, league: League): LeagueTeam[] {
        return participation
            ? participation.members.map((member) =>
                  LeagueTeam.create({
                      season: league.season,
                      leagueCode: league.code,
                      teamNumber: member,
                      regionCode: league.regionCode,
                  } as DeepPartial<LeagueTeam>)
              )
            : [];
    }
}
