import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Award } from "../../db/entities/Award";
import { Event } from "../../db/entities/Event";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { Season } from "../../ftc-api/types/Season";
import DataLoader from "dataloader";
import { DateTime } from "luxon";
import { TeamEventParticipation } from "../objects/TeamEventParticipation";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TeamEventParticipation2019 } from "../../db/entities/team-event-participation/TeamEventParticipation2019";
import { DATA_SOURCE } from "../../db/data-source";
import { Brackets } from "typeorm";
import { EventTypes } from "./records.ts/EventTypes";
import { getRegionCodes, Region } from "../../db/entities/types/Region";

@Resolver(Event)
export class EventResolver {
    @Query(() => Event, { nullable: true })
    eventByCode(
        @Arg("season", () => Int) season: number,
        @Arg("code", () => String) code: string
    ): Promise<Event | null> {
        return Event.findOneBy({
            season,
            code,
        });
    }

    @Query(() => [Event])
    eventsSearch(
        @Arg("season", () => Int) season: number,
        @Arg("eventTypes", () => EventTypes) eventTypes: EventTypes,
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("onlyWithMatches", () => Boolean) onlyWithMatches: boolean,
        @Arg("limit", () => Int) limit: number
    ): Promise<Event[]> {
        let query = DATA_SOURCE.getRepository(Event)
            .createQueryBuilder("e")
            .where("e.season = :season", { season })
            .orderBy("e.start", "ASC")
            .addOrderBy("e.name", "DESC")
            .limit(limit);

        let regionCodes = getRegionCodes(region);
        query.andWhere('e."regionCode" IN (:...regionCodes)', { regionCodes });

        if (eventTypes == EventTypes.REMOTE) {
            query = query.andWhere("e.remote");
        } else if (eventTypes == EventTypes.TRAD) {
            query = query.andWhere("NOT e.remote");
        }

        if (start) query = query.andWhere("e.end >= :start", { start });
        if (end) query = query.andWhere("e.end <= :end", { end });

        if (onlyWithMatches) {
            query.andWhere(
                'EXISTS (SELECT * FROM match WHERE "hasBeenPlayed" AND season = :season AND "eventCode" = e.code)'
            );
        }

        return query.getMany();
    }

    @FieldResolver(() => [TeamMatchParticipation])
    matchesForTeam(
        @Root() event: Event,
        @Arg("teamNumber", () => Int) teamNumber: number
    ): Promise<TeamMatchParticipation[]> {
        return TeamMatchParticipation.findBy({
            season: event.season,
            eventCode: event.code,
            teamNumber,
        });
    }

    @FieldResolver(() => [Award])
    @Loader<{ season: number; eventCode: string }, Award[]>(async (ids, _) => {
        let awards = await Award.find({
            where: ids as { season: number; eventCode: string }[],
        });

        let groups: Award[][] = ids.map((_) => []);

        for (let a of awards) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == a.season && id.eventCode == a.eventCode) {
                    groups[i].push(a);
                }
            }
        }
        return groups;
    })
    awards(@Root() event: Event) {
        return async (dl: DataLoader<{ season: Season; eventCode: string }, Award[]>) => {
            return dl.load({ season: event.season, eventCode: event.code });
        };
    }

    @FieldResolver(() => [TeamEventParticipation])
    @Loader<{ eventSeason: number; eventCode: string }, TeamEventParticipation[]>(async (ids, _) => {
        let ids2021 = ids.filter((id) => id.eventSeason == 2021);
        let ids2019 = ids.filter((id) => id.eventSeason == 2019);

        let teps2021P = ids2021.length
            ? TeamEventParticipation2021.find({
                  where: ids2021 as { eventSeason: number; eventCode: string }[],
              })
            : [];
        let teps2019P = ids2019.length
            ? TeamEventParticipation2019.find({
                  where: ids2019 as { eventSeason: number; eventCode: string }[],
              })
            : [];

        let [teps2021, teps2019] = await Promise.all([teps2021P, teps2019P]);
        let teps = [...teps2021, ...teps2019];

        let groups: TeamEventParticipation[][] = ids.map((_) => []);

        for (let tep of teps) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.eventSeason == tep.eventSeason && id.eventCode == tep.eventCode) {
                    groups[i].push(new TeamEventParticipation(tep));
                }
            }
        }
        return groups;
    })
    teams(@Root() event: Event) {
        return async (dl: DataLoader<{ eventSeason: number; eventCode: string }, TeamEventParticipation[]>) => {
            return dl.load({ eventSeason: event.season, eventCode: event.code });
        };
    }

    @FieldResolver(() => Boolean)
    hasStarted(@Root() event: Event): boolean {
        let eventStart = DateTime.fromSQL(event.start as string, { zone: event.timezone ?? undefined });
        let now = DateTime.now();
        return now > eventStart;
    }

    // TODO make a batch loader
    @FieldResolver(() => [Event])
    async relatedEvents(@Root() event: Event): Promise<Event[]> {
        return DATA_SOURCE.getRepository(Event)
            .createQueryBuilder("e")
            .where("e.season = :season", { season: event.season })
            .andWhere("e.code <> :code4", { code4: event.code })
            .andWhere(
                new Brackets((qb) => {
                    if (event.divisionCode) {
                        qb = qb.orWhere("e.code = :code1", { code1: event.divisionCode });
                        qb = qb.orWhere('e."divisionCode" = :code2', { code2: event.divisionCode });
                    }
                    qb = qb.orWhere('e."divisionCode" = :code3', { code3: event.code });
                    return qb;
                })
            )
            .getMany();
    }
}
