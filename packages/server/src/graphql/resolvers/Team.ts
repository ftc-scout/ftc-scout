import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { dataLoaderResolverList, dataLoaderResolverSingle } from "../utils";
import {
    DateTimeTy,
    IntTy,
    RegionOption,
    StrTy,
    fuzzySearch,
    getRegionCodes,
    groupBy,
    list,
    listTy,
    nn,
    nullTy,
} from "@ftc-scout/common";
import { Team } from "../../db/entities/Team";
import { In } from "typeorm";
import { AwardGQL, teamAwareAwardLoader } from "./Award";
import { Award } from "../../db/entities/Award";
import { Season } from "@ftc-scout/common";
import { TeamMatchParticipationGQL } from "./TeamMatchParticipation";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";
import { LocationGQL } from "../objs/Location";
import { TeamEventParticipation } from "../../db/entities/dyn/team-event-participation";
import { TeamEventParticipationGQL } from "./TeamEventParticipation";
import { RegionOptionGQL } from "./enums";
import { DATA_SOURCE } from "../../db/data-source";
import { Event } from "../../db/entities/Event";

export const TeamGQL: GraphQLObjectType = new GraphQLObjectType({
    name: "Team",
    fields: () => ({
        number: IntTy,
        name: StrTy,
        schoolName: StrTy,
        sponsors: listTy(StrTy),
        location: {
            type: nn(LocationGQL),
            resolve: (t) => ({ city: t.city, state: t.state, country: t.country }),
        },
        rookieYear: IntTy,
        website: nullTy(StrTy),
        createdAt: DateTimeTy,
        updatedAt: DateTimeTy,

        awards: {
            type: list(nn(AwardGQL)),
            args: { season: nullTy(IntTy) },
            resolve: dataLoaderResolverList<
                Team,
                Award,
                { season?: Season; teamNumber: number },
                { season: Season | null }
            >(
                (team, a) =>
                    a.season != null
                        ? { season: a.season, teamNumber: team.number }
                        : { teamNumber: team.number },
                teamAwareAwardLoader
            ),
        },
        matches: {
            type: list(nn(TeamMatchParticipationGQL)),
            args: { season: nullTy(IntTy), eventCode: nullTy(StrTy) },
            resolve: dataLoaderResolverList<
                Team,
                TeamMatchParticipation,
                { season?: Season; eventCode?: string; teamNumber: number },
                { season: Season | null; eventCode: string | null }
            >(
                (t, { season, eventCode }) => ({
                    teamNumber: t.number,
                    ...(season != null ? { season } : {}),
                    ...(eventCode != null ? { eventCode } : {}),
                }),
                (keys) => TeamMatchParticipation.find({ where: keys })
            ),
        },
        events: {
            type: list(nn(TeamEventParticipationGQL)),
            args: { season: IntTy },
            resolve: dataLoaderResolverList<
                Team,
                TeamEventParticipation,
                { season: Season; teamNumber: number },
                { season: Season }
            >(
                (t, { season }) => ({ season, teamNumber: t.number }),
                async (keys) => {
                    let groups = groupBy(keys, (k) => k.season);
                    let qs = Object.entries(groups).map(([season, k]) =>
                        TeamEventParticipation[+season as Season].find({ where: k })
                    );
                    return (await Promise.all(qs)).flat();
                }
            ),
        },
    }),
});

export const TeamQueries: Record<string, GraphQLFieldConfig<any, any>> = {
    teamByNumber: {
        type: TeamGQL,
        args: { number: IntTy },
        resolve: dataLoaderResolverSingle<{}, Team, number, { number: number }>(
            (_, a) => a.number,
            (keys) => Team.find({ where: { number: In(keys) } }),
            (k, r) => k == r.number
        ),
    },
    teamByName: {
        type: TeamGQL,
        args: { name: StrTy },
        resolve: dataLoaderResolverSingle<{}, Team, string, { name: string }>(
            (_, a) => a.name,
            (keys) => Team.find({ where: { name: In(keys) } }),
            (k, r) => k == r.name
        ),
    },

    teamsSearch: {
        type: list(nn(TeamGQL)),
        args: {
            region: { type: RegionOptionGQL },
            limit: nullTy(IntTy),
            searchText: nullTy(StrTy),
        },
        resolve: async (
            _,
            {
                region,
                limit,
                searchText,
            }: {
                region: RegionOption | null;
                limit: number | null;
                searchText: string | null;
            }
        ) => {
            let q = DATA_SOURCE.getRepository(Team).createQueryBuilder("t").distinctOn(["number"]);

            if (region && region != RegionOption.All) {
                q.andWhere("e.region_code IN (:...regions)", { regions: getRegionCodes(region) })
                    .leftJoin(TeamMatchParticipation, "m", "t.number = m.team_number")
                    .leftJoin(Event, "e", "e.season = m.season AND e.code = m.event_code");
            }

            if (limit && (!searchText || searchText.trim() == "")) {
                q.limit(limit);
            }

            let entities = await q.getMany();

            if (searchText && searchText.trim() != "") {
                let res = fuzzySearch(entities, searchText, limit ?? undefined, "name", true);
                entities = res.map((d) => d.document);
            }

            return entities;
        },
    },
};
