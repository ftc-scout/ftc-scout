import { GraphQLObjectType, GraphQLResolveInfo } from "graphql";
import { dataLoaderResolverSingle, keyListToWhereClause } from "../utils";
import { AwardTypeGQL } from "./enums";
import { TeamGQL } from "./Team";
import { Award } from "../../db/entities/Award";
import { FindOptionsWhere } from "typeorm";
import { EventGQL } from "./Event";
import { Event } from "../../db/entities/Event";
import { DateTy, IntTy, Season, StrTy, nn, nullTy } from "@ftc-scout/common";
import graphqlFields from "graphql-fields";
import { DATA_SOURCE } from "../../db/data-source";

export const AwardGQL: GraphQLObjectType = new GraphQLObjectType({
    name: "Award",
    fields: () => ({
        season: IntTy,
        eventCode: StrTy,
        teamNumber: IntTy,
        personName: nullTy(StrTy),
        type: { type: nn(AwardTypeGQL) },
        placement: IntTy,
        createdAt: DateTy,
        updatedAt: DateTy,

        // Must use aware loader
        team: { type: nn(TeamGQL) },

        event: {
            type: nn(EventGQL),
            resolve: dataLoaderResolverSingle<Award, Event, { season: Season; code: string }>(
                (a) => ({ season: a.season, code: a.eventCode }),
                (keys) => Event.find({ where: keys })
            ),
        },
    }),
});

export function teamAwareAwardLoader<K extends FindOptionsWhere<Award>>(
    keys: K[],
    info: GraphQLResolveInfo[]
) {
    let includeTeam = info.some((i) => "team" in graphqlFields(i));

    let q = DATA_SOURCE.getRepository(Award)
        .createQueryBuilder("a")
        .where(keyListToWhereClause("a", keys));

    if (includeTeam) {
        q.leftJoinAndMapOne("a.team", "team", "t", "a.team_number = t.number");
    }

    return q.getMany();
}
