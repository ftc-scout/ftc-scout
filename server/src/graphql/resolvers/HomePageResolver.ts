import { Arg, Int, Query, Resolver } from "type-graphql";
import { EntityTarget } from "typeorm";
import { ALL_SEASONS, CURRENT_SEASON } from "../../constants";
import { DATA_SOURCE } from "../../db/data-source";
import { TeamEventParticipation2019 } from "../../db/entities/team-event-participation/TeamEventParticipation2019";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";
import { Match } from "../../db/entities/Match";
import { Event } from "../../db/entities/Event";
import { TeamEventParticipation } from "../objects/TeamEventParticipation";
import { TeamEventParticipation2020 } from "../../db/entities/team-event-participation/TeamEventParticipation2020";
import { TeamEventParticipation2022 } from "../../db/entities/team-event-participation/TeamEventParticipation2022";
import { MatchScores2022 } from "../../db/entities/MatchScores2022";

@Resolver()
export class HomePageResolver {
    // Maybe update these in the future
    @Query(() => Int)
    async activeTeamsCount(@Arg("season", () => Int) season: number): Promise<number> {
        if (ALL_SEASONS.indexOf(season) != -1) {
            let tep: EntityTarget<any> | null = null;
            switch (season) {
                case 2019:
                    tep = TeamEventParticipation2019;
                    break;
                case 2020:
                    tep = TeamEventParticipation2020;
                    break;
                case 2021:
                    tep = TeamEventParticipation2021;
                    break;
                case 2022:
                    tep = TeamEventParticipation2022;
                    break;
            }
            let res = (await DATA_SOURCE.getRepository(tep!)
                .createQueryBuilder()
                .select('COUNT(DISTINCT("teamNumber"))')
                .getRawOne()!) as { count: string };

            return +res.count;
        } else {
            return 0;
        }
    }

    @Query(() => Int)
    async matchesPlayedCount(@Arg("season", () => Int) season: number): Promise<number> {
        return DATA_SOURCE.getRepository(Match)
            .createQueryBuilder("m")
            .select()
            .where('m."eventSeason" = :season', { season })
            .andWhere('m."hasBeenPlayed"')
            .getCount();
    }

    @Query(() => Match, { nullable: true })
    async topTradMatch(): Promise<Match | null> {
        return DATA_SOURCE.getRepository(Match)
            .createQueryBuilder("m")
            .leftJoin(
                MatchScores2022,
                "s",
                's.season = m."eventSeason" AND s."eventCode" = m."eventCode" AND s."matchId" = m.id'
            )
            .leftJoin(Event, "e", 'e.season = m."eventSeason" AND e.code = m."eventCode"')
            .orderBy('s."totalPointsNp"', "DESC")
            .where("m.hasBeenPlayed")
            .andWhere("NOT e.remote")
            .andWhere('m."eventSeason" = :season', { season: CURRENT_SEASON })
            .limit(1)
            .getOne();
    }

    @Query(() => TeamEventParticipation, { nullable: true })
    async topRemoteTep(): Promise<TeamEventParticipation | null> {
        let res = await DATA_SOURCE.getRepository(TeamEventParticipation2022)
            .createQueryBuilder("tep")
            .leftJoin(Event, "e", 'e.season = tep."eventSeason" AND e.code = tep."eventCode"')
            .orderBy('tep."totTotalpoints"', "DESC")
            .where("e.remote")
            .andWhere('tep."eventSeason" = :season', { season: CURRENT_SEASON })
            .limit(1)
            .getOne();

        return res ? new TeamEventParticipation(res) : null;
    }

    @Query(() => [Event])
    async todaysEvents(): Promise<Event[]> {
        return DATA_SOURCE.getRepository(Event)
            .createQueryBuilder("e")
            .where("e.start <= (NOW() at time zone timezone)::date")
            .andWhere("e.end >= (NOW() at time zone timezone)::date")
            .orderBy("e.start", "ASC")
            .addOrderBy("e.name", "DESC")
            .getMany();
    }
}
