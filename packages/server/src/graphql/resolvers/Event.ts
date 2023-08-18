import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { dataLoaderResolverList, dataLoaderResolverSingle } from "../utils";
import { EventTypeGQL, EventTypeOptionGQL, RegionOptionGQL } from "./enums";
import { AwardGQL, teamAwareAwardLoader } from "./Award";
import { Event } from "../../db/entities/Event";
import { Award } from "../../db/entities/Award";
import {
    BoolTy,
    DateTimeTy,
    DateTy,
    EventTypeOption,
    IntTy,
    RegionOption,
    Season,
    StrTy,
    getEventTypes,
    getRegionCodes,
    groupBy,
    list,
    listTy,
    nn,
    nullTy,
} from "@ftc-scout/common";
import { TeamMatchParticipationGQL } from "./TeamMatchParticipation";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { MatchGQL, singleSeasonScoreAwareMatchLoader } from "./Match";
import { Match } from "../../db/entities/Match";
import { TeamEventParticipationGQL } from "./TeamEventParticipation";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { LocationGQL } from "../objs/Location";
import { DateTime } from "luxon";
import { DATA_SOURCE } from "../../db/data-source";
import { Brackets } from "typeorm";

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

        relatedEvents: {
            type: list(nn(EventGQL)),
            resolve: (e) =>
                DATA_SOURCE.getRepository(Event)
                    .createQueryBuilder("e")
                    .where("e.season = :season", { season: e.season })
                    .andWhere("e.code <> :code", { code: e.code })
                    .andWhere(
                        new Brackets((qb) => {
                            if (e.divisionCode) {
                                qb.orWhere("e.code = :divCode", {
                                    divCode: e.divisionCode,
                                }).orWhere("e.divisionCode = :divCode");
                            }
                            qb.orWhere("e.divisionCode = :code");
                        })
                    )
                    .getMany(),
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
        hasMatches: {
            ...BoolTy,
            resolve: async (
                e //("hasMatches" in e ? e.hasMatches : false),
            ) =>
                "hasMatches" in e
                    ? e.hasMatches
                    : (
                          await DATA_SOURCE.getRepository(Event)
                              .createQueryBuilder("e")
                              .distinctOn(["code"])
                              .addSelect("coalesce(m.has_been_played, false)", "has_matches")
                              .leftJoin(
                                  Match,
                                  "m",
                                  "e.season = m.event_season AND e.code = m.event_code"
                              )
                              .where("season = :season", { season: e.season })
                              .andWhere("code = :code", { code: e.code })
                              .getRawOne()
                      ).has_matches,
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
                singleSeasonScoreAwareMatchLoader
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

    eventSearch: {
        type: list(nn(EventGQL)),
        args: {
            season: IntTy,
            region: { type: RegionOptionGQL },
            type: { type: EventTypeOptionGQL },
        },
        resolve: async (
            _,
            {
                season,
                region,
                type,
            }: { season: Season; region: RegionOption | null; type: EventTypeOption | null }
        ) => {
            let q = DATA_SOURCE.getRepository(Event)
                .createQueryBuilder("e")
                .distinctOn(["code"])
                .addSelect("coalesce(m.has_been_played, false)", "has_matches")
                .where("season = :season", { season });

            if (region && region != RegionOption.All) {
                q.andWhere("region_code IN (:...regions)", { regions: getRegionCodes(region) });
            }

            if (type && type != EventTypeOption.All) {
                q.andWhere("type IN (:...types)", { types: getEventTypes(type) });
            }

            let { entities, raw } = await q
                .leftJoin(Match, "m", "e.season = m.event_season AND e.code = m.event_code")
                .getRawAndEntities();

            for (let i = 0; i < entities.length; i++) {
                (entities[i] as any).hasMatches = raw[i].has_matches;
            }

            return entities;
        },
    },
};
