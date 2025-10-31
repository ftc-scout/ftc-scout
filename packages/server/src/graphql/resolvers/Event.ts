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
    FloatTy,
    IntTy,
    RegionOption,
    Season,
    StrTy,
    DESCRIPTORS,
    fuzzySearch,
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
import { newMatchesKey, pubsub } from "./pubsub";

const EventPreviewStatGQL = new GraphQLObjectType({
    name: "EventPreviewStat",
    fields: {
        teamNumber: IntTy,
        npOpr: nullTy(FloatTy),
    },
});

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
        address: nullTy(StrTy),
        location: {
            type: nn(LocationGQL),
            resolve: (e) =>
                !!e ? { venue: e.venue, city: e.city, state: e.state, country: e.country } : null,
        },
        website: nullTy(StrTy),
        liveStreamURL: nullTy(StrTy),
        webcasts: listTy(StrTy),
        timezone: StrTy,
        start: DateTy,
        end: DateTy,
        createdAt: DateTimeTy,
        updatedAt: DateTimeTy,

        started: {
            ...BoolTy,
            resolve: (e) => DateTime.fromISO(e.start as any, { zone: e.timezone }) < DateTime.now(),
        },
        ongoing: {
            ...BoolTy,
            resolve: (e) =>
                DateTime.fromISO(e.start as any, { zone: e.timezone }) < DateTime.now() &&
                DateTime.now() < DateTime.fromISO(e.end as any, { zone: e.timezone }).endOf("day"),
        },
        finished: {
            ...BoolTy,
            resolve: (e) =>
                DateTime.fromISO(e.end as any, { zone: e.timezone }).endOf("day") < DateTime.now(),
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
        previewStats: {
            type: list(nn(EventPreviewStatGQL)),
            resolve: async (event) => {
                let roster = await TeamEventParticipation[event.season].find({
                    where: { season: event.season, eventCode: event.code },
                    select: ["teamNumber"],
                });
                let teamNumbers = roster.map((r) => r.teamNumber);
                if (!teamNumbers.length) return [];

                let descriptor = DESCRIPTORS[event.season];
                let totalColumn = descriptor.pensSubtract
                    ? "opr_total_points"
                    : "opr_total_points_np";

                let rows = await DATA_SOURCE.createQueryBuilder(`tep_${event.season}`, "t")
                    .leftJoin("event", "e", "e.season = t.season AND e.code = t.event_code")
                    .select("team_number", "teamNumber")
                    .addSelect(`max(${totalColumn})`, "npOpr")
                    .where("team_number IN (:...teamNumbers)", { teamNumbers })
                    .andWhere("NOT is_remote")
                    .andWhere("has_stats")
                    .andWhere("NOT e.modified_rules")
                    .groupBy("team_number")
                    .getRawMany();

                let values = new Map<number, number | null>();
                for (let row of rows) {
                    let number = +row.teamNumber;
                    let value = row.npOpr == null ? null : +row.npOpr;
                    values.set(number, value);
                }

                return teamNumbers.map((teamNumber) => ({
                    teamNumber,
                    npOpr: values.get(teamNumber) ?? null,
                }));
            },
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

    eventsSearch: {
        type: list(nn(EventGQL)),
        args: {
            season: IntTy,
            region: { type: RegionOptionGQL },
            type: { type: EventTypeOptionGQL },
            hasMatches: nullTy(BoolTy),
            start: nullTy(DateTy),
            end: nullTy(DateTy),
            limit: nullTy(IntTy),
            searchText: nullTy(StrTy),
        },
        resolve: async (
            _,
            {
                season,
                region,
                type,
                hasMatches,
                start,
                end,
                limit,
                searchText,
            }: {
                season: Season;
                region: RegionOption | null;
                type: EventTypeOption | null;
                hasMatches: boolean | null;
                start: Date | null;
                end: Date | null;
                limit: number | null;
                searchText: string | null;
            }
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

            if (start) {
                q.andWhere('"start" >= :start', { start: start.toISOString().split("T")[0] });
            }

            if (end) {
                q.andWhere('"end" <= :end', { end: end.toISOString().split("T")[0] });
            }

            if (limit && (!searchText || searchText.trim() == "")) {
                q.limit(limit);
            }

            let { entities, raw } = await q
                .leftJoin(Match, "m", "e.season = m.event_season AND e.code = m.event_code")
                .getRawAndEntities();

            for (let i = 0; i < entities.length; i++) {
                (entities[i] as any).hasMatches = raw[i].has_matches;
            }

            if (hasMatches != null) {
                entities = entities.filter((e) => (e as any).hasMatches == hasMatches);
            }

            if (searchText && searchText.trim() != "") {
                let res = fuzzySearch(entities, searchText, limit ?? undefined, "name", true);
                entities = res.map((d) => d.document);
            }

            return entities;
        },
    },
};

export const EventSubscriptions: Record<string, GraphQLFieldConfig<any, any>> = {
    newMatches: {
        type: list(nn(MatchGQL)).ofType,
        args: { season: IntTy, code: StrTy },
        subscribe: (_, { season, code }: { season: Season; code: string }) =>
            pubsub.asyncIterator(newMatchesKey(season, code)),
    },
};
