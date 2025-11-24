import {
    FrontendMatch,
    MatchFtcApi,
    Season,
    TournamentLevel,
    tournamentLevelFromFtcApi,
    tournamentLevelValue,
} from "@ftc-scout/common";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeepPartial,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Event } from "./Event";
import { DateTime } from "luxon";
import { MatchScore } from "./dyn/match-score";
import { TeamMatchParticipation } from "./TeamMatchParticipation";
import { frontendMSFromDB } from "../../graphql/dyn/match-score";

@Entity()
export class Match extends BaseEntity {
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @PrimaryColumn()
    eventCode!: string;

    @PrimaryColumn("int")
    id!: number;

    @ManyToOne(() => Event, (event) => event.matches)
    event!: Event;

    scores!: MatchScore[];

    @OneToMany(() => TeamMatchParticipation, (p) => p.match)
    teams!: TeamMatchParticipation[];

    @Column()
    hasBeenPlayed!: boolean;

    @Column("timestamptz", { nullable: true })
    scheduledStartTime!: Date | null;

    @Column("timestamptz", { nullable: true })
    actualStartTime!: Date | null;

    @Column("timestamptz", { nullable: true })
    postResultTime!: Date | null;

    @Column("enum", { enum: TournamentLevel, enumName: "tournament_level_enum" })
    tournamentLevel!: TournamentLevel;

    @Column("smallint")
    series!: number;

    get matchNum(): number {
        return this.id % 1000;
    }

    get description(): string {
        switch (this.tournamentLevel) {
            case TournamentLevel.Quals:
                return `Q-${this.matchNum}`;
            case TournamentLevel.Semis:
                return `SF${this.series}-${this.matchNum}`;
            case TournamentLevel.Finals:
                return `F-${this.matchNum}`;
            case TournamentLevel.DoubleElim:
                return this.matchNum > 1 ? `M-${this.series}.${this.matchNum}` : `M-${this.series}`;
        }
    }

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(
        api: MatchFtcApi,
        event: Event,
        hasBeenPlayed: boolean,
        allMatches: MatchFtcApi[]
    ): Match {
        let timezone = event.timezone;
        let tournamentLevel = tournamentLevelFromFtcApi(api.tournamentLevel);
        let [tournamentLevel_, series, matchNum] = computeMatchOrder(
            tournamentLevel,
            api,
            event,
            allMatches
        );
        tournamentLevel = tournamentLevel_;

        return Match.create({
            eventSeason: event.season,
            eventCode: event.code,
            id: event.remote
                ? api.teams[0].teamNumber * 1000 + matchNum
                : tournamentLevelValue(tournamentLevel) * 10000 + series * 1000 + matchNum,
            hasBeenPlayed,
            scheduledStartTime:
                DateTime.fromISO(api.startTime, { zone: timezone }).year > 2000
                    ? DateTime.fromISO(api.startTime, { zone: timezone }).toJSDate()
                    : null,
            actualStartTime: api.actualStartTime
                ? DateTime.fromISO(api.actualStartTime, { zone: timezone }).toJSDate()
                : null,
            postResultTime: api.postResultTime
                ? DateTime.fromISO(api.postResultTime, { zone: timezone }).toJSDate()
                : null,
            tournamentLevel,
            series,
        } satisfies DeepPartial<Match>);
    }

    toFrontend(): FrontendMatch {
        return { ...this, scores: frontendMSFromDB(this.scores) as any };
    }
}

function computeMatchOrder(
    level: TournamentLevel,
    api: MatchFtcApi,
    event: Event,
    allMatches: MatchFtcApi[]
): [TournamentLevel, number, number] {
    if (event.remote) {
        return [level, 0, api.matchNumber];
    }

    if (level != TournamentLevel.DoubleElim) {
        return [level, api.series, api.matchNumber];
    }

    // Now we have to handle double elim matches
    let uniquePlayoffTeams = allMatches
        .filter((m) => m.tournamentLevel == "PLAYOFF")
        .flatMap((m) => m.teams.map((t) => t.teamNumber));
    uniquePlayoffTeams = [...new Set(uniquePlayoffTeams)];

    if (uniquePlayoffTeams.length <= 4) {
        // This is technically double elim but there are only two teams so it
        // is really more of a best of three. Let's call it a finals
        level = TournamentLevel.Finals;
        return [level, 0, api.matchNumber];
    }

    return [level, api.series, api.matchNumber];
}
