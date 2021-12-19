import { Arg, Int, Query, Resolver } from "type-graphql";
import { EntityTarget, LessThanOrEqual, MoreThanOrEqual } from "typeorm";
import { ALL_SEASONS, CURRENT_SEASON } from "../../constants";
import { DATA_SOURCE } from "../../db/data-source";
import { TeamEventParticipation2019 } from "../../db/entities/team-event-participation/TeamEventParticipation2019";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";
import { Match } from "../../db/entities/Match";
import { Event } from "../../db/entities/Event";
import { MatchScores2021 } from "../../db/entities/MatchScores2021";
import { TeamEventParticipation } from "../objects/TeamEventParticipation";

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
                    // TODO
                    return 0;
                case 2021:
                    tep = TeamEventParticipation2021;
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
    async topTradMatch2021(): Promise<Match | null> {
        return DATA_SOURCE.getRepository(Match)
            .createQueryBuilder("m")
            .leftJoin(
                MatchScores2021,
                "s",
                's.season = m."eventSeason" AND s."eventCode" = m."eventCode" AND s."matchId" = m.id'
            )
            .leftJoin(Event, "e", 'e.season = m."eventSeason" AND e.code = m."eventCode"')
            .orderBy('s."totalPoints"', "DESC")
            .where("m.hasBeenPlayed")
            .andWhere("NOT e.remote")
            .andWhere('m."eventSeason" = :season', { season: CURRENT_SEASON })
            .limit(1)
            .getOne();
    }

    @Query(() => TeamEventParticipation, { nullable: true })
    async topRemoteTep2021(): Promise<TeamEventParticipation | null> {
        let res = await DATA_SOURCE.getRepository(TeamEventParticipation2021)
            .createQueryBuilder("tep")
            .leftJoin(Event, "e", 'e.season = tep."eventSeason" AND e.code = tep."eventCode"')
            .orderBy('tep."totTotalpoints"', "DESC")
            .where("e.remote")
            .andWhere('tep."eventSeason" = :season', { season: CURRENT_SEASON })
            .limit(1)
            .getOne();

        return res ? new TeamEventParticipation(res) : null;
    }
}
