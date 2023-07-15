import { GraphQLObjectType } from "graphql";
import { BoolTy, DateTy, IntTy, StrTy, dataLoaderResolverSingle, nn } from "../utils";
import { AllianceGQL, AllianceRoleGQL, StationGQL } from "./enums";
import { TeamGQL } from "./Team";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { Team } from "../../db/entities/Team";
import { In } from "typeorm";
import { EventGQL } from "./Event";
import { Event } from "../../db/entities/Event";
import { Season } from "@ftc-scout/common";
import { MatchGQL, scoreAwareMatchLoader } from "./Match";
import { Match } from "../../db/entities/Match";

export const TeamMatchParticipationGQL: GraphQLObjectType = new GraphQLObjectType({
    name: "TeamMatchParticipation",
    fields: () => ({
        season: IntTy,
        eventCode: StrTy,
        matchId: IntTy,
        alliance: { type: nn(AllianceGQL) },
        station: { type: nn(StationGQL) },
        teamNumber: IntTy,
        allianceRole: { type: nn(AllianceRoleGQL) },
        surrogate: BoolTy,
        noShow: BoolTy,
        dq: BoolTy,
        onField: BoolTy,
        createdAt: DateTy,
        updatedAt: DateTy,

        team: {
            type: nn(TeamGQL),
            resolve: dataLoaderResolverSingle<TeamMatchParticipation, Team, number>(
                (tmp) => tmp.teamNumber,
                (keys) => Team.find({ where: { number: In(keys) } }),
                (k, r) => k == r.number
            ),
        },
        match: {
            type: nn(MatchGQL),
            resolve: dataLoaderResolverSingle<
                TeamMatchParticipation,
                Match,
                { eventSeason: Season; eventCode: string; id: number }
            >(
                (tmp) => ({ eventSeason: tmp.season, eventCode: tmp.eventCode, id: tmp.matchId }),
                scoreAwareMatchLoader
            ),
        },
        event: {
            type: nn(EventGQL),
            resolve: dataLoaderResolverSingle<
                TeamMatchParticipation,
                Event,
                { season: Season; code: string }
            >(
                (tmp) => ({ season: tmp.season, code: tmp.eventCode }),
                (keys) => Event.find({ where: keys })
            ),
        },
    }),
});
