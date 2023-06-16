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

@Entity()
export class TeamMatchParticipation extends BaseEntity {
    @PrimaryColumn("smallint")
    season!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    matchId!: number;

    @PrimaryColumn("int")
    teamNumber!: number;

    match!: Match;

    @ManyToOne(() => Team, (team) => team.matches)
    team!: Team;

    @Column("enum", { enum: Alliance })
    alliance!: Alliance;

    @Column("enum", { enum: Station })
    station!: Station;

    @Column("enum", { enum: AllianceRole })
    allianceRole!: AllianceRole;

    @Column()
    surrogate!: boolean;

    @Column("bool")
    noShow!: boolean;

    @Column("bool")
    dq!: boolean;

    @Column("bool")
    onField!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
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
            return teams
                .filter(
                    (t) =>
                        (match.eventSeason == 2019 ? true : !!t.onField) &&
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
                    teamNumber: t.teamNumber,
                    alliance: allianceFromApiStation(t.station),
                    station: getStation(t),
                    allianceRole: allianceRoleFromApiStation(t.station),
                    surrogate: t.surrogate,
                    noShow: t.noShow,
                    dq: match.eventSeason == 2019 ? false : !!t.dq, // For 2019 the api always returns false for dq
                    onField: match.eventSeason == 2019 ? true : !!t.onField, // And doesn't return the teams that weren't on the field.
                } as DeepPartial<TeamMatchParticipation>);
            })
            .filter(notEmpty);
    }
}
