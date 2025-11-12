import {
    DateTimeTy,
    EventTypeOption,
    IntTy,
    Season,
    getEventTypes,
    list,
    nn,
    nullTy,
} from "@ftc-scout/common";
import { GraphQLFieldConfig } from "graphql";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { DATA_SOURCE } from "../../db/data-source";
import { Match } from "../../db/entities/Match";
import { EventGQL } from "./Event";
import { Event } from "../../db/entities/Event";
import { MatchGQL } from "./Match";
import { MatchScore } from "../../db/entities/dyn/match-score";
import { EventTypeOptionGQL } from "./enums";

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
        args: { date: nullTy(DateTimeTy), type: { type: EventTypeOptionGQL } },
        resolve: async (_, { date, type }: { date: Date; type: EventTypeOption }) => {
            let q = DATA_SOURCE.getRepository(Event)
                .createQueryBuilder("e")
                .where("e.start <= (:e at time zone timezone)::date", { e: date ?? "NOW()" })
                .andWhere("e.end >= (:e at time zone timezone)::date")
                .orderBy("e.start", "ASC")
                .addOrderBy("e.name", "DESC");

            if (type && type != EventTypeOption.All) {
                q.andWhere("type IN (:...types)", { types: getEventTypes(type) });
            }

            return q.getMany();
        },
    },

    tradWorldRecord: {
        type: nn(MatchGQL),
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) =>
            getWorldRecordMatch(season, "s.total_points_np"),
    },

    tradWorldRecordWithPenalties: {
        type: nn(MatchGQL),
        args: { season: IntTy },
        resolve: async (_, { season }: { season: number }) =>
            getWorldRecordMatch(season, "s.total_points"),
    },
};

async function getWorldRecordMatch(
    season: number,
    orderColumn: "s.total_points" | "s.total_points_np"
) {
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
        .orderBy(orderColumn, "DESC")
        .where("m.has_been_played")
        .andWhere("NOT e.remote")
        .andWhere("e.type <> 'OffSeason'")
        .andWhere("NOT e.modified_rules")
        .andWhere('m."event_season" = :season', { season })
        .limit(1)
        .getOne();

    if (!match) throw "No match found for world record";

    return DATA_SOURCE.getRepository(Match)
        .createQueryBuilder("m")
        .where("m.event_season = :season", { season: match.eventSeason })
        .andWhere("m.event_code = :code", { code: match.eventCode })
        .andWhere("m.id = :id", { id: match.id })
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
}
