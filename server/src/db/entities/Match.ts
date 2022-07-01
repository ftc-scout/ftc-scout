import { Field, Int, ObjectType } from "type-graphql";
import { TypeormLoader } from "type-graphql-dataloader";
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
import { MatchFtcApi } from "../../ftc-api/types/Match";
import { Season } from "../../ftc-api/types/Season";
import { Event, EVENT_CODE_LEN } from "./Event";
import { MatchScores2021 } from "./MatchScores2021";
import { TeamMatchParticipation } from "./TeamMatchParticipation";
import { Alliance } from "./types/Alliance";
import {
    TournamentLevel,
    tournamentLevelFromApi,
} from "./types/TournamentLevel";

@ObjectType()
@Entity()
export class Match extends BaseEntity {
    @Field(() => Int, { name: "season" })
    @PrimaryColumn("smallint")
    eventSeason!: Season;

    @Field(() => String)
    @PrimaryColumn("varchar", { length: EVENT_CODE_LEN })
    eventCode!: string;

    @Field(() => Int)
    @PrimaryColumn("int")
    id!: number;

    static encodeMatchIdTraditional(
        matchNum: number,
        level: TournamentLevel,
        series: number
    ): number {
        return level.valueOf() * 10000 + series * 1000 + matchNum;
    }

    static encodeMatchIdRemote(matchNum: number, teamNum: number) {
        return teamNum * 1000 + matchNum;
    }

    @Field(() => Event)
    @ManyToOne(() => Event, (event) => event.matches)
    @TypeormLoader()
    event!: Event;

    @Field()
    @Column()
    hasBeenPlayed!: boolean;

    @Field(() => [TeamMatchParticipation])
    @OneToMany(() => TeamMatchParticipation, (tmp) => tmp.match)
    @TypeormLoader()
    teams!: TeamMatchParticipation[];

    @Field()
    @Column()
    scheduledStartTime!: Date;

    @Field(() => Date, { nullable: true })
    @Column("timestamptz", { nullable: true })
    actualStartTime!: Date | null;

    @Field(() => Date, { nullable: true })
    @Column("timestamptz", { nullable: true })
    postResultTime!: Date | null;

    @Field(() => Int)
    get matchNum(): number {
        return this.id % 1000;
    }

    @Field(() => TournamentLevel)
    @Column("enum", { enum: TournamentLevel })
    tournamentLevel!: TournamentLevel;

    @Field(() => Int)
    @Column("int8")
    series!: number;

    @Field(() => String)
    get matchDescription(): string {
        switch (this.tournamentLevel) {
            case TournamentLevel.QUALS:
                return `Q-${this.matchNum}`;
            case TournamentLevel.SEMIS:
                return `SF-${this.series}-${this.matchNum}`;
            case TournamentLevel.FINALS:
                return `F-${this.matchNum}`;
        }
    }

    @OneToMany(() => MatchScores2021, (ms2021) => ms2021.match, {
        cascade: true,
        eager: true,
    })
    @TypeormLoader()
    scores2021!: MatchScores2021[];

    @Field()
    @CreateDateColumn()
    createdAt!: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt!: Date;

    redTotalPoints(): number | null {
        if (this.scores2021) {
            return this.scores2021.filter((s) => s.alliance == Alliance.RED)[0]
                .totalPoints;
        } else {
            return null;
        }
    }

    blueTotalPoints(): number | null {
        if (this.scores2021) {
            return this.scores2021.filter((s) => s.alliance == Alliance.BLUE)[0]
                .totalPoints;
        } else {
            return null;
        }
    }

    soloPoints(): number | null {
        if (this.scores2021) {
            return this.scores2021[0].totalPoints;
        } else {
            return null;
        }
    }

    static fromApi(
        season: Season,
        eventCode: string,
        apiMatch: MatchFtcApi,
        isRemote: boolean,
        hasBeenPlayed: boolean
    ): Match {
        let tournamentLevel = tournamentLevelFromApi(apiMatch.tournamentLevel);
        let matchId = isRemote
            ? Match.encodeMatchIdRemote(
                  apiMatch.matchNumber,
                  apiMatch.teams[0].teamNumber
              )
            : Match.encodeMatchIdTraditional(
                  apiMatch.matchNumber,
                  tournamentLevel,
                  apiMatch.series
              );
        return Match.create({
            eventSeason: season,
            eventCode,
            id: matchId,
            hasBeenPlayed,
            scheduledStartTime: apiMatch.startTime,
            actualStartTime: apiMatch.actualStartTime,
            postResultTime: apiMatch.postResultTime,
            tournamentLevel,
            series: apiMatch.series,
        } as DeepPartial<Match>);
    }
}
