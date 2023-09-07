import { DESCRIPTORS, DateTimeTy, IntTy, Season, list, nn, nullTy } from "@ftc-scout/common";
import { GraphQLFieldConfig } from "graphql";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { DATA_SOURCE } from "../../db/data-source";
import { Match } from "../../db/entities/Match";
import { EventGQL } from "./Event";
import { Event } from "../../db/entities/Event";
import { MatchGQL } from "./Match";
import { MatchScore } from "../../db/entities/dyn/match-score";

export const HomeQueries: Record<string, GraphQLFieldConfig<any, any>> = {
    activeTeamsCount: {
        ...IntTy,
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) => {
            let tep = TeamEventParticipation[season as Season];
            if (!tep) return 0;

            let res = (await tep
                .createQueryBuilder("tep")
                .select('COUNT(DISTINCT("team_number"))')
                .getRawOne()!) as { count: string };

            return +res.count;
        },
    },

    matchesPlayedCount: {
        ...IntTy,
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) => {
            return DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .select()
                .where("m.event_season = :season", { season })
                .andWhere("m.has_been_played")
                .getCount();
        },
    },

    eventsOnDate: {
        type: list(nn(EventGQL)),
        args: { date: nullTy(DateTimeTy) },
        resolve: async (_, { date }: { date: Date }) => {
            return DATA_SOURCE.getRepository(Event)
                .createQueryBuilder("e")
                .where("e.start <= (:e at time zone timezone)::date", { e: date ?? "NOW()" })
                .andWhere("e.end >= (:e at time zone timezone)::date")
                .orderBy("e.start", "ASC")
                .addOrderBy("e.name", "DESC")
                .getMany();
        },
    },

    tradWorldRecord: {
        type: nn(MatchGQL),
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) => {
            let ms = MatchScore[season as Season];
            if (!ms) throw "Use a valid season";

            let match = await DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .leftJoin(
                    `match_score_${season}`,
                    "s",
                    "s.season = m.event_season AND s.event_code = m.event_code AND s.match_id = m.id"
                )
                .leftJoin(Event, "e", "e.season = m.event_season AND e.code = m.event_code")
                .orderBy(
                    DESCRIPTORS[season as Season].pensSubtract
                        ? "s.total_points"
                        : "s.total_points_np",
                    "DESC"
                )
                .where("m.has_been_played")
                .andWhere("NOT e.remote")
                .andWhere("e.type <> 'OffSeason'")
                .andWhere("NOT e.modified_rules")
                .andWhere('m."event_season" = :season', { season })
                .limit(1)
                .getOne();

            return DATA_SOURCE.getRepository(Match)
                .createQueryBuilder("m")
                .where("m.event_season = :season", { season: match?.eventSeason })
                .andWhere("m.event_code = :code", { code: match?.eventCode })
                .andWhere("m.id = :id", { id: match?.id })
                .leftJoinAndMapMany(
                    "m.scores",
                    `match_score_${season}`,
                    "ms",
                    "m.event_season = ms.season AND m.event_code = ms.event_code AND m.id = ms.match_id"
                )
                .leftJoinAndMapMany(
                    "m.teams",
                    "team_match_participation",
                    "tmp",
                    "m.event_season = tmp.season AND m.event_code = tmp.event_code AND m.id = tmp.match_id"
                )
                .getOne();
        },
    },
};
