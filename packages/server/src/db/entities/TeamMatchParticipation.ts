import {
    Alliance,
    AllianceRole,
    Season,
    Station,
    TeamMatchParticipationFtcApi,
    allianceFromApiStation,
    allianceRoleFromApiStation,
    notEmpty,
} from "@ftc-scout/common";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Match } from "./Match";
import { Team } from "./Team";
import { Field, Int, ObjectType } from "type-graphql";

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

    @Field(() => Alliance)
    @PrimaryColumn("enum", { enum: Alliance })
    alliance!: Alliance;

    @Field(() => Station)
    @PrimaryColumn("enum", { enum: Station })
    station!: Station;

    match!: Match;

    @ManyToOne(() => Team, (team) => team.matches)
    team!: Team;

    @Field(() => Int)
    @Column("int")
    teamNumber!: number;

    @Field(() => AllianceRole)
    @Column("enum", { enum: AllianceRole })
    allianceRole!: AllianceRole;

    @Field()
    @Column("bool")
    surrogate!: boolean;

    @Field()
    @Column("bool")
    noShow!: boolean;

    @Field()
    @Column("bool")
    dq!: boolean;

    @Field()
    @Column("bool")
    onField!: boolean;

    @Field()
    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Field()
    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(
        teams: TeamMatchParticipationFtcApi[],
        match: Match,
        remote: boolean
    ): TeamMatchParticipation[] {
        const cmp = (a: TeamMatchParticipationFtcApi, b: TeamMatchParticipationFtcApi) =>
            a.station.localeCompare(b.station);

        function getOnField(
            teams: TeamMatchParticipationFtcApi[],
            color: string
        ): TeamMatchParticipationFtcApi[] {
            // In some cases when teams are disqualified they are marked as not on the field.
            // If every team is not on the field we ignore this as we still need to know their
            // positions.
            let anyOnField = teams.some((t) => t.onField && t.station.includes(color));

            return teams
                .filter(
                    (t) =>
                        (match.eventSeason == 2019 ? true : !anyOnField || (t.onField ?? true)) &&
                        t.station.includes(color)
                )
                .sort(cmp);
        }

        let redTeams = getOnField(teams, "Red");
        let blueTeams = getOnField(teams, "Blue");

        function getStation(team: TeamMatchParticipationFtcApi): Station {
            if (remote) {
                return Station.Solo;
            } else if (
                team.teamNumber == redTeams?.[0]?.teamNumber ||
                team.teamNumber == blueTeams?.[0]?.teamNumber
            ) {
                return Station.One;
            } else if (
                team.teamNumber == redTeams?.[1]?.teamNumber ||
                team.teamNumber == blueTeams?.[1]?.teamNumber
            ) {
                return Station.Two;
            } else {
                return Station.NotOnField;
            }
        }

        return teams
            .map((t) => {
                // There is one tmp with no team number.
                // https://ftc-events.firstinspires.org/2019/63709253779.8239/playoffs
                if (t.teamNumber == null) return null;

                return TeamMatchParticipation.create({
                    season: match.eventSeason,
                    eventCode: match.eventCode,
                    matchId: match.id,
                    alliance: allianceFromApiStation(t.station),
                    station: getStation(t),
                    teamNumber: t.teamNumber,
                    allianceRole: allianceRoleFromApiStation(t.station),
                    surrogate: t.surrogate,
                    noShow: t.noShow,
                    dq: match.eventSeason == 2019 ? false : t.dq ?? false, // For 2019 the api always returns false for dq
                    onField: match.eventSeason == 2019 ? true : t.onField ?? true, // And doesn't return the teams that weren't on the field.
                } as DeepPartial<TeamMatchParticipation>);
            })
            .filter(notEmpty);
    }
}
