import { BoolTy, IntTy, StrTy, list, nn, nullTy } from "@ftc-scout/common";
import { GraphQLObjectType } from "graphql";
import { dataLoaderResolverSingle } from "../utils";
import { Team } from "../../db/entities/Team";
import { TeamGQL } from "./Team";
import type { LeagueRanking as LeagueRankingRow } from "../../db/entities/dyn/league-ranking";
import { TepStatsUnionGQL } from "../dyn/dyn-types-schema";
import { addTypename } from "../dyn/tep";
import { In } from "typeorm";

export const LeagueGQL = new GraphQLObjectType({
    name: "League",
    fields: {
        season: IntTy,
        code: StrTy,
        name: StrTy,
        remote: BoolTy,
        regionCode: nullTy(StrTy),
        parentLeagueCode: nullTy(StrTy),
        parentLeagueName: nullTy(StrTy),
        location: nullTy(StrTy),
    },
});

export const LeagueRankingEntryGQL = new GraphQLObjectType({
    name: "LeagueRankingEntry",
    fields: () => ({
        season: IntTy,
        leagueCode: StrTy,
        regionCode: StrTy,
        teamNumber: IntTy,
        stats: {
            type: TepStatsUnionGQL,
            resolve: (entry: LeagueRankingRow) => (entry.hasStats ? addTypename(entry) : null),
        },
        team: {
            type: nn(TeamGQL),
            resolve: dataLoaderResolverSingle<LeagueRankingRow, Team, number>(
                (entry) => entry.teamNumber,
                (keys) => Team.find({ where: { number: In(keys) } }),
                (k, team) => k == team.number
            ),
        },
    }),
});

export const LeagueRankingGroupGQL = new GraphQLObjectType({
    name: "LeagueRankingGroup",
    fields: () => ({
        league: { type: nn(LeagueGQL) },
        teams: { type: list(nn(LeagueRankingEntryGQL)) },
    }),
});
