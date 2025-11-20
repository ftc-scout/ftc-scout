import { GraphQLObjectType } from "graphql";
import { BoolTy, IntTy, StrTy, nullTy } from "@ftc-scout/common";

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
        awardPoints: nullTy(IntTy),
        totalPoints: nullTy(IntTy),
        rank: nullTy(IntTy),
    }),
});
