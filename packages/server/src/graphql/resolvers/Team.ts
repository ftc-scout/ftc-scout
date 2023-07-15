import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import {
    DateTy,
    IntTy,
    StrTy,
    dataLoaderResolverList,
    dataLoaderResolverSingle,
    list,
    listTy,
    nullTy,
} from "../utils";
import { Team } from "../../db/entities/Team";
import { In } from "typeorm";
import { AwardGQL } from "./Award";
import { Award } from "../../db/entities/Award";
import { Season } from "@ftc-scout/common";
import { TeamMatchParticipationGQL } from "./TeamMatchParticipation";
import { TeamMatchParticipation } from "../../db/entities/TeamMatchParticipation";

export const TeamGQL: GraphQLObjectType = new GraphQLObjectType({
    name: "Team",
    fields: () => ({
        number: IntTy,
        name: StrTy,
        schoolName: StrTy,
        sponsors: listTy(StrTy),
        country: StrTy,
        state: StrTy,
        city: StrTy,
        rookieYear: IntTy,
        website: nullTy(StrTy),
        createdAt: DateTy,
        updatedAt: DateTy,

        awards: {
            type: list(AwardGQL),
            args: { season: nullTy(IntTy) },
            resolver: dataLoaderResolverList<
                Team,
                Award,
                { season?: Season; teamNumber: number },
                { season: Season | null }
            >(
                (team, a) =>
                    a.season != null
                        ? { season: a.season, teamNumber: team.number }
                        : { teamNumber: team.number },
                (keys) => Award.find({ where: keys })
            ),
        },
        matches: {
            type: list(TeamMatchParticipationGQL),
            args: { season: nullTy(IntTy), eventCode: nullTy(StrTy) },
            resolver: dataLoaderResolverList<
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
};
