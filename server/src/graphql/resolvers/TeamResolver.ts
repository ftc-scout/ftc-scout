import { Arg, FieldResolver, Int, Query, Resolver, Root } from "type-graphql";
import { Loader } from "type-graphql-dataloader";
import { Award } from "../../db/entities/Award";
import { Team } from "../../db/entities/Team";
import DataLoader from "dataloader";
import { TeamEventParticipation } from "../objects/TeamEventParticipation";
import { TeamEventParticipation2021 } from "../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TeamEventParticipation2019 } from "../../db/entities/team-event-participation/TeamEventParticipation2019";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { DATA_SOURCE } from "../../db/data-source";
import fuzzysort from "fuzzysort";
import { getRegionCodes, Region } from "../../db/entities/types/Region";
import { TeamEventParticipation2020 } from "../../db/entities/team-event-participation/TeamEventParticipation2020";

@Resolver(Team)
export class TeamResolver {
    @Query(() => Team, { nullable: true })
    teamByNumber(@Arg("number", () => Int) number: number): Promise<Team | null> {
        return Team.findOneBy({ number });
    }

    @Query(() => Team, { nullable: true })
    teamByName(@Arg("name", () => String) name: string): Promise<Team | null> {
        return Team.findOneBy({ name });
    }

    @FieldResolver(() => [TeamEventParticipation])
    @Loader<{ eventSeason: number; teamNumber: number }, TeamEventParticipation[]>(async (ids, _) => {
        let ids2021 = ids.filter((id) => id.eventSeason == 2021);
        let ids2020 = ids.filter((id) => id.eventSeason == 2020);
        let ids2019 = ids.filter((id) => id.eventSeason == 2019);

        let teps2021P = ids2021.length
            ? TeamEventParticipation2021.find({
                  where: ids2021 as { eventSeason: number; teamNumber: number }[],
              })
            : [];
        let teps2020P = ids2020.length
            ? TeamEventParticipation2020.find({
                  where: ids2020 as { eventSeason: number; teamNumber: number }[],
              })
            : [];
        let teps2019P = ids2019.length
            ? TeamEventParticipation2019.find({
                  where: ids2019 as { eventSeason: number; teamNumber: number }[],
              })
            : [];

        let [teps2021, teps2020, teps2019] = await Promise.all([teps2021P, teps2020P, teps2019P]);
        let teps = [...teps2021, ...teps2020, ...teps2019];

        let groups: TeamEventParticipation[][] = ids.map((_) => []);

        for (let tep of teps) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.eventSeason == tep.eventSeason && id.teamNumber == tep.teamNumber) {
                    groups[i].push(new TeamEventParticipation(tep));
                }
            }
        }
        return groups;
    })
    events(@Root() team: Team, @Arg("season", () => Int) season: number) {
        return async (dl: DataLoader<{ eventSeason: number; teamNumber: number }, TeamEventParticipation[]>) => {
            return dl.load({ eventSeason: season, teamNumber: team.number });
        };
    }

    @FieldResolver(() => [TeamMatchParticipation])
    @Loader<{ season: number; teamNumber: number }, TeamMatchParticipation[]>(async (ids, _) => {
        let tmps = await TeamMatchParticipation.find({
            where: ids as { season: number; teamNumber: number }[],
        });

        let groups: TeamMatchParticipation[][] = ids.map((_) => []);

        for (let tmp of tmps) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == tmp.season && id.teamNumber == tmp.teamNumber) {
                    groups[i].push(tmp);
                }
            }
        }
        return groups;
    })
    matches(@Root() team: Team, @Arg("season") season: number) {
        return async (dl: DataLoader<{ season: number; teamNumber: number }, TeamMatchParticipation[]>) => {
            return dl.load({ season, teamNumber: team.number });
        };
    }

    @FieldResolver(() => [Award])
    @Loader<{ season: number; teamNumber: number }, Award[]>(async (ids, _) => {
        let awards = await Award.find({
            where: ids as { season: number; teamNumber: number }[],
        });

        let groups: Award[][] = ids.map((_) => []);

        for (let a of awards) {
            for (let i = 0; i < ids.length; i++) {
                let id = ids[i];
                if (id.season == a.season && id.teamNumber == a.teamNumber) {
                    groups[i].push(a);
                }
            }
        }
        return groups;
    })
    awards(@Root() team: Team, @Arg("season") season: number) {
        return async (dl: DataLoader<{ season: number; teamNumber: number }, Award[]>) => {
            return dl.load({ season, teamNumber: team.number });
        };
    }

    @Query(() => [Team])
    async teamsSearch(
        @Arg("limit", () => Int) limit: number,
        @Arg("region", () => Region, { nullable: true }) region: Region | null,
        @Arg("searchText", () => String, { nullable: true }) searchText: string | null
    ): Promise<Team[]> {
        let query = DATA_SOURCE.getRepository(Team).createQueryBuilder("t").orderBy("t.number", "ASC");

        if (region && region != Region.ALL) {
            let regionCodes = getRegionCodes(region);
            query.andWhere(
                `
                (exists(SELECT *
                    FROM team_event_participation2021 tep2021
                    JOIN event e on tep2021."eventSeason" = e.season and
                    tep2021."eventCode" = e.code
                    WHERE tep2021."teamNumber" = t.number
                    AND e."regionCode" in (:...regionCodes))
                    OR exists (SELECT *
                    FROM team_event_participation2019 tep2019
                    JOIN event e on tep2019."eventSeason" = e.season and
                    tep2019."eventCode" = e.code
                    WHERE tep2019."teamNumber" = t.number
                    AND e."regionCode" in (:...regionCodes))
                    OR exists (SELECT *
                    FROM team_event_participation2019 tep2019
                    JOIN event e on tep2019."eventSeason" = e.season and
                    tep2019."eventCode" = e.code
                    WHERE tep2019."teamNumber" = t.number
                    AND e."regionCode" in (:...regionCodes)))`,
                { regionCodes }
            );
        }

        if (!searchText) {
            query.limit(limit);
        }

        let teams = await query.getMany();

        if (searchText) {
            teams.forEach((t) => (t.number = ("" + t.number) as any));

            teams = fuzzysort
                .go(searchText, teams, {
                    limit,
                    keys: ["number", "name"],
                    // bias older events with same search score.
                    scoreFn: (a_) => {
                        let a = a_ as Fuzzysort.KeyResult<Team>[] & { obj: Team };

                        return a[0] || a[1]
                            ? Math.max(
                                  a[0] && a.obj ? a[0].score - a.obj.number / 1000000000000 : -10000000,
                                  a[1] && a.obj ? a[1].score - a.obj.number / 1000000000000 : -10000000
                              )
                            : (null as any);
                    },
                })
                .map((t) => t.obj);
        }

        return teams;
    }
}
