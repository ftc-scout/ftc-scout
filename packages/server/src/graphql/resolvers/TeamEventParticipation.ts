import { IntTy, Season, StrTy, list, nn } from "@ftc-scout/common";
import { GraphQLObjectType } from "graphql";
import { EventTypeGQL } from "./enums";
import { dataLoaderResolverList, dataLoaderResolverSingle } from "../utils";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { Event } from "../../db/entities/Event";
import { TeamGQL } from "./Team";
import { Team } from "../../db/entities/Team";
import { In } from "typeorm";
import { AwardGQL, teamAwareAwardLoader } from "./Award";
import { Award } from "../../db/entities/Award";
import { MatchGQL } from "./Match";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { TepStatsUnionGQL } from "../dyn/dyn-types-schema";
import { addTypename } from "../dyn/tep";

export const TeamEventParticipationGQL = new GraphQLObjectType({
    name: "TeamEventParticipation",
    fields: () => ({
        season: IntTy,
        eventCode: StrTy,
        teamNumber: IntTy,
        stats: {
            type: TepStatsUnionGQL,
            resolve: (tep) => (tep.hasStats ? addTypename(tep) : null),
        },

        event: {
            type: nn(EventTypeGQL),
            resolve: dataLoaderResolverSingle<
                TeamEventParticipation,
                Event,
                { season: Season; code: string }
            >(
                (tep) => ({ season: tep.eventSeason, code: tep.eventCode }),
                (keys) => Event.find({ where: keys })
            ),
        },
        team: {
            type: nn(TeamGQL),
            resolve: dataLoaderResolverSingle<TeamEventParticipation, Team, number>(
                (tep) => tep.teamNumber,
                (keys) => Team.find({ where: { number: In(keys) } }),
                (k, t) => k == t.number
            ),
        },
        awards: {
            type: list(nn(AwardGQL)),
            resolve: dataLoaderResolverList<
                TeamEventParticipation,
                Award,
                { season: Season; eventCode: string; teamNumber: number }
            >(
                (tep) => ({
                    season: tep.season,
                    eventCode: tep.eventCode,
                    teamNumber: tep.teamNumber,
                }),
                teamAwareAwardLoader
            ),
        },
        match: {
            type: list(nn(MatchGQL)),
            resolve: dataLoaderResolverList<
                TeamEventParticipation,
                TeamMatchParticipation,
                { season: Season; eventCode: string; teamNumber: number }
            >(
                (tep) => ({
                    season: tep.season,
                    eventCode: tep.eventCode,
                    teamNumber: tep.teamNumber,
                }),
                (keys) => TeamMatchParticipation.find({ where: keys })
            ),
        },
    }),
});
