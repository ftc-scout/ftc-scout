import { GraphQLObjectType } from "graphql";
import {
    BoolTy,
    IntTy,
    StrTy,
    nullTy,
    AdvancementEligibility,
    makeGQLEnum,
} from "@ftc-scout/common";
import { TeamGQL } from "./Team";
import { dataLoaderResolverSingle } from "../utils";
import { Team } from "../../db/entities/Team";
import { In } from "typeorm";
import { AdvancementScore } from "../../db/entities/AdvancementScore";

const AdvancementEligibilityGQL = makeGQLEnum(AdvancementEligibility, "AdvancementEligibility");

export const AdvancementScoreGQL = new GraphQLObjectType({
    name: "AdvancementScore",
    fields: () => ({
        season: IntTy,
        eventCode: StrTy,
        teamNumber: IntTy,
        qualPoints: nullTy(IntTy),
        isQualFinal: BoolTy,
        allianceSelectionPoints: nullTy(IntTy),
        isAllianceSelectionFinal: BoolTy,
        playoffPoints: nullTy(IntTy),
        isPlayoffPointsFinal: BoolTy,
        awardPoints: nullTy(IntTy),
        totalPoints: nullTy(IntTy),
        rank: nullTy(IntTy),
        advancementRank: nullTy(IntTy),
        advanced: BoolTy,
        eligibility: { type: AdvancementEligibilityGQL },
        team: {
            type: TeamGQL,
            resolve: dataLoaderResolverSingle<AdvancementScore, Team, number, { number: number }>(
                (s) => s.teamNumber,
                (keys) => Team.find({ where: { number: In(keys) } }),
                (k, r) => k == r.number
            ),
        },
    }),
});
