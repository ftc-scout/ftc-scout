import { GraphQLObjectType } from "graphql";
import { DateTy, IntTy, StrTy, dataLoaderResolverSingle, nn, nullTy } from "../utils";
import { AwardTypeGQL } from "./enums";
import { TeamGQL } from "./Team";
import { Award } from "../../db/entities/Award";
import { Team } from "../../db/entities/Team";
import { In } from "typeorm";
import { EventGQL } from "./Event";
import { Event } from "../../db/entities/Event";
import { Season } from "@ftc-scout/common";

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

        team: {
            type: nn(TeamGQL),
            resolver: dataLoaderResolverSingle<Award, Team, number>(
                (award) => award.teamNumber,
                (keys) => Team.find({ where: { number: In(keys) } })
            ),
        },
        event: {
            type: nn(EventGQL),
            resolver: dataLoaderResolverSingle<Award, Event, { season: Season; code: string }>(
                (a) => ({ season: a.season, code: a.eventCode }),
                (keys) => Event.find({ where: keys })
            ),
        },
    }),
});
