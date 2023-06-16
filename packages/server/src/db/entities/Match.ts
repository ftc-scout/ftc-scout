import {
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
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Event } from "./Event";
import { DateTime } from "luxon";

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

    @Column()
    hasBeenPlayed!: boolean;

    @Column("timestamptz", { nullable: true })
    scheduledStartTime!: Date | null;

    @Column("timestamptz", { nullable: true })
    actualStartTime!: Date | null;

    @Column("timestamptz", { nullable: true })
    postResultTime!: Date | null;

    @Column("enum", { enum: TournamentLevel })
    tournamentLevel!: TournamentLevel;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    static fromApi(api: MatchFtcApi, event: Event, hasBeenPlayed: boolean): Match {
        let timezone = event.timezone ?? "utc";
        let tournamentLevel = tournamentLevelFromFtcApi(api.tournamentLevel);
        return Match.create({
            eventSeason: event.season,
            eventCode: event.code,
            id: event.remote
                ? api.teams[0].teamNumber * 1000 + api.matchNumber
                : tournamentLevelValue(tournamentLevel) * 10000 +
                  api.series * 1000 +
                  api.matchNumber,
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
        } satisfies DeepPartial<Match>);
    }
}
