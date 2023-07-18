import { GraphQLObjectType, GraphQLResolveInfo } from "graphql";
import { dataLoaderResolverSingle, keyListToWhereClause } from "../utils";
import { BoolTy, DateTimeTy, IntTy, StrTy, list, nn, nullTy } from "@ftc-scout/common";
import { Match } from "../../db/entities/Match";
import { Event } from "../../db/entities/Event";
import { EventTypeGQL, TournamentLevelGQL } from "./enums";
import { Season } from "@ftc-scout/common";
import { MatchScoresUnionGQL } from "../dyn/dyn-types-schema";
import { frontendMSFromDB } from "../dyn/match-score";
import { DATA_SOURCE } from "../../db/data-source";
import graphqlFields from "graphql-fields";
import { FindOptionsWhere } from "typeorm";
import { TeamMatchParticipationGQL } from "./TeamMatchParticipation";

export const MatchGQL: GraphQLObjectType = new GraphQLObjectType({
    name: "Match",
    fields: () => ({
        season: {
            ...IntTy,
            resolve: (m: Match) => m.eventSeason,
        },
        eventCode: StrTy,
        id: IntTy,
        hasBeenPlayed: BoolTy,
        scheduledStartTime: nullTy(DateTimeTy),
        actualStartTime: nullTy(DateTimeTy),
        postResultTime: nullTy(DateTimeTy),
        tournamentLevel: { type: nn(TournamentLevelGQL) },
        series: IntTy,
        matchNum: IntTy,
        description: StrTy,
        createdAt: DateTimeTy,
        updatedAt: DateTimeTy,

        // Must use aware loader
        scores: {
            type: MatchScoresUnionGQL,
            resolve: (m) => frontendMSFromDB(m.scores),
        },
        teams: { type: list(nn(TeamMatchParticipationGQL)) },

        event: {
            type: nn(EventTypeGQL),
            resolve: dataLoaderResolverSingle<Match, Event, { season: Season; code: string }>(
                (m) => ({ season: m.eventSeason, code: m.eventCode }),
                (keys) => Event.find({ where: keys })
            ),
        },
    }),
});

export function scoreAwareMatchLoader<K extends FindOptionsWhere<Match>>(
    keys: K[],
    info: GraphQLResolveInfo[]
) {
    let includeScores = info.some((i) => "scores" in graphqlFields(i));
    let includeTeams = info.some((i) => "teams" in graphqlFields(i));

    let q = DATA_SOURCE.getRepository(Match)
        .createQueryBuilder("m")
        .where(keyListToWhereClause("m", keys));

    if (includeScores) {
        q.leftJoinAndMapMany(
            "m.scores",
            "match_score_2022",
            "ms",
            "m.event_season = ms.season AND m.event_code = ms.event_code AND m.id = ms.match_id"
        );
    }
    if (includeTeams) {
        q.leftJoinAndMapMany(
            "m.teams",
            "team_match_participation",
            "tmp",
            "m.event_season = tmp.season AND m.event_code = tmp.event_code AND m.id = tmp.match_id"
        );
    }

    return q.getMany();
}
