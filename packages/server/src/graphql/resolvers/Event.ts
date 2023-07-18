import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { dataLoaderResolverList, dataLoaderResolverSingle } from "../utils";
import { EventTypeGQL } from "./enums";
import { AwardGQL, teamAwareAwardLoader } from "./Award";
import { Event } from "../../db/entities/Event";
import { Award } from "../../db/entities/Award";
import {
    BoolTy,
    DateTimeTy,
    DateTy,
    IntTy,
    Season,
    StrTy,
    groupBy,
    list,
    listTy,
    nn,
    nullTy,
} from "@ftc-scout/common";
import { TeamMatchParticipationGQL } from "./TeamMatchParticipation";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { MatchGQL, scoreAwareMatchLoader } from "./Match";
import { Match } from "../../db/entities/Match";
import { TeamEventParticipationGQL } from "./TeamEventParticipation";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { LocationGQL } from "../objs/Location";
import { DateTime } from "luxon";

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
        address: StrTy,
        location: {
            type: nn(LocationGQL),
            resolve: (e) => ({ venue: e.venue, city: e.city, state: e.state, country: e.country }),
        },
        website: nullTy(StrTy),
        livestreamURL: nullTy(StrTy),
        webcasts: listTy(StrTy),
        timezone: nullTy(StrTy),
        start: DateTy,
        end: DateTy,
        createdAt: DateTimeTy,
        updatedAt: DateTimeTy,

        started: {
            ...BoolTy,
            resolve: (e) =>
                DateTime.fromISO(e.start as any, { zone: e.timezone ?? undefined }) <
                DateTime.now(),
        },
        ongoing: {
            ...BoolTy,
            resolve: (e) =>
                DateTime.fromISO(e.start as any, { zone: e.timezone ?? undefined }) <
                    DateTime.now() &&
                DateTime.now() < DateTime.fromISO(e.end as any, { zone: e.timezone ?? undefined }),
        },
        finished: {
            ...BoolTy,
            resolve: (e) =>
                DateTime.fromISO(e.end as any, { zone: e.timezone ?? undefined }) < DateTime.now(),
        },

        awards: {
            type: list(nn(AwardGQL)),
            resolve: dataLoaderResolverList<Event, Award, { season: Season; eventCode: string }>(
                (event) => ({ season: event.season, eventCode: event.code }),
                teamAwareAwardLoader
            ),
        },
        teams: {
            type: list(nn(TeamEventParticipationGQL)),
            resolve: dataLoaderResolverList<
                Event,
                TeamEventParticipation,
                { season: Season; eventCode: string }
            >(
                (event) => ({ season: event.season, eventCode: event.code }),
                async (keys) => {
                    let groups = groupBy(keys, (k) => k.season);
                    let qs = Object.entries(groups).map(([season, k]) =>
                        TeamEventParticipation[+season as Season].find({ where: k })
                    );
                    return (await Promise.all(qs)).flat();
                }
            ),
        },
        teamMatches: {
            type: list(nn(TeamMatchParticipationGQL)),
            args: { teamNumber: nullTy(IntTy) },
            resolve: dataLoaderResolverList<
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
            resolve: dataLoaderResolverList<
                Event,
                Match,
                { eventSeason: Season; eventCode: string; id?: number },
                { id: number | null }
            >(
                (e, { id }) =>
                    id != null
                        ? { eventSeason: e.season, eventCode: e.code, id }
                        : { eventSeason: e.season, eventCode: e.code },
                scoreAwareMatchLoader
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
