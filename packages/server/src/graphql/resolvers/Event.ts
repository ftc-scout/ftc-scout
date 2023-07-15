import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import {
    BoolTy,
    DateTy,
    IntTy,
    StrTy,
    dataLoaderResolverList,
    dataLoaderResolverSingle,
    list,
    listTy,
    nn,
    nullTy,
} from "../utils";
import { EventTypeGQL } from "./enums";
import { AwardGQL } from "./Award";
import { Event } from "../../db/entities/Event";
import { Award } from "../../db/entities/Award";
import { Season } from "@ftc-scout/common";
import { TeamMatchParticipationGQL } from "./TeamMatchParticipation";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { MatchGQL } from "./Match";
import { Match } from "../../db/entities/Match";

export const EventGQL: GraphQLObjectType = new GraphQLObjectType({
    name: "Event",
    fields: () => ({
        season: IntTy,
        code: StrTy,
        divisionCode: nullTy(StrTy),
        name: StrTy,
        remote: BoolTy,
        hybrid: BoolTy,
        fieldCount: IntTy,
        published: BoolTy,
        type: { type: nn(EventTypeGQL) },
        regionCode: nullTy(StrTy),
        leagueCode: nullTy(StrTy),
        districtCode: nullTy(StrTy),
        venue: StrTy,
        address: StrTy,
        country: StrTy,
        state: StrTy,
        city: StrTy,
        website: nullTy(StrTy),
        livestreamURL: nullTy(StrTy),
        webcasts: listTy(StrTy),
        timezone: nullTy(StrTy),
        start: DateTy,
        end: DateTy,
        createdAt: DateTy,
        updatedAt: DateTy,

        awards: {
            type: list(nn(AwardGQL)),
            resolver: dataLoaderResolverList<Event, Award, { season: Season; eventCode: string }>(
                (event) => ({ season: event.season, eventCode: event.code }),
                (keys) => Award.find({ where: keys })
            ),
        },
        teamMatches: {
            type: list(nn(TeamMatchParticipationGQL)),
            args: { teamNumber: nullTy(IntTy) },
            resolver: dataLoaderResolverList<
                Event,
                TeamMatchParticipation,
                { season: Season; eventCode: string; teamNumber?: number },
                { teamNumber: number }
            >(
                (e, { teamNumber }) =>
                    teamNumber != null
                        ? { season: e.season, eventCode: e.code, teamNumber }
                        : { season: e.season, eventCode: e.code },
                (keys) => TeamMatchParticipation.find({ where: keys })
            ),
        },
        matches: {
            type: list(nn(MatchGQL)),
            resolver: dataLoaderResolverList<
                Event,
                Match,
                { season: Season; eventCode: string; id?: number },
                { id: number | null }
            >(
                (e, { id }) =>
                    id != null
                        ? { season: e.season, eventCode: e.code, id }
                        : { season: e.season, eventCode: e.code },
                (keys) => Match.find({ where: keys })
            ),
        },
    }),
});

export const EventQueries: Record<string, GraphQLFieldConfig<any, any>> = {
    eventByCode: {
        type: EventGQL,
        args: { season: IntTy, code: StrTy },
        resolve: dataLoaderResolverSingle<
            {},
            Event,
            { season: Season; code: string },
            { season: Season; code: string }
        >(
            (_, a) => a,
            (keys) => Event.find({ where: keys })
        ),
    },
};
