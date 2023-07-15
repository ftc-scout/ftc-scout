import { GraphQLObjectType } from "graphql";
import {
    BoolTy,
    DateTy,
    IntTy,
    StrTy,
    dataLoaderResolverList,
    dataLoaderResolverSingle,
    list,
    nn,
    nullTy,
} from "../utils";
import { Match } from "../../db/entities/Match";
import { Event } from "../../db/entities/Event";
import { EventTypeGQL, TournamentLevelGQL } from "./enums";
import { TeamGQL } from "./Team";
import { Season } from "@ftc-scout/common";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";

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
        scheduledStartTime: nullTy(DateTy),
        actualStartTime: nullTy(DateTy),
        postResultTime: nullTy(DateTy),
        tournamentLevel: { type: nn(TournamentLevelGQL) },
        createdAt: DateTy,
        updatedAt: DateTy,

        event: {
            type: nn(EventTypeGQL),
            resolver: dataLoaderResolverSingle<Match, Event, { season: Season; code: string }>(
                (m) => ({ season: m.eventSeason, code: m.eventCode }),
                (keys) => Event.find({ where: keys })
            ),
        },
        teams: {
            type: list(nn(TeamGQL)),
            resolver: dataLoaderResolverList<
                Match,
                TeamMatchParticipation,
                { season: Season; eventCode: string; matchId: number }
            >(
                (m) => ({ season: m.eventSeason, eventCode: m.eventCode, matchId: m.id }),
                (keys) => TeamMatchParticipation.find({ where: keys })
            ),
        },
    }),
});
