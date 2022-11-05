import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, DeepPartial, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Match } from "./Match";
import { Team } from "./Team";
import { Season } from "../../ftc-api/types/Season";
import { Station, stationFromFtcApi } from "./types/Station";
import { TypeormLoader } from "type-graphql-dataloader";
import { TeamMatchParticipationFtcApi } from "../../ftc-api/types/Match";

@ObjectType()
@Entity()
export class TeamMatchParticipation extends BaseEntity {
    @Field(() => Int)
    @PrimaryColumn("smallint")
    season!: Season;

    @Field()
    @PrimaryColumn()
    eventCode!: string;

    @Field(() => Int)
    @PrimaryColumn("int")
    matchId!: number;

    @Field(() => Int)
    @PrimaryColumn("int")
    teamNumber!: number;

    // @Field(() => Match)
    // @ManyToOne(() => Match, (match) => match.teams)
    // @JoinColumn([
    //     { name: "season", referencedColumnName: "eventSeason" },
    //     { name: "eventCode", referencedColumnName: "eventCode" },
    //     { name: "matchId", referencedColumnName: "id" },
    // ])
    // @TypeormLoader()
    match!: Match;

    @Field(() => Team)
    @ManyToOne(() => Team, (team) => team.matches)
    @TypeormLoader()
    team!: Team;

    @Field(() => Station)
    @Column("enum", { enum: Station })
    station!: Station;

    @Field()
    @Column()
    surrogate!: boolean;

    @Field(() => Boolean)
    @Column("bool")
    noShow!: boolean;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    dq!: boolean | null;

    @Field(() => Boolean, { nullable: true })
    @Column("bool", { nullable: true })
    onField!: boolean | null;

    static fromApi(
        season: Season,
        eventCode: string,
        matchId: number,
        team: TeamMatchParticipationFtcApi
    ): TeamMatchParticipation {
        return TeamMatchParticipation.create({
            season: season,
            eventCode,
            matchId,
            teamNumber: team.teamNumber,
            station: stationFromFtcApi(team.station),
            surrogate: team.surrogate,
            noShow: team.noShow,
            dq: (season == 2019 ? false : team.dq) ?? false, // For 2019 the api always returns false for dq & onField. Fun!
            onField: (season == 2019 ? !team.noShow : team.onField) ?? true,
        } as DeepPartial<TeamMatchParticipation>);
    }
}
