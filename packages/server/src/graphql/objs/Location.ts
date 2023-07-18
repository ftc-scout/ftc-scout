import { StrTy, nullTy } from "@ftc-scout/common";
import { GraphQLObjectType } from "graphql";

export const LocationGQL = new GraphQLObjectType({
    name: "Location",
    fields: {
        venue: nullTy(StrTy),
        city: StrTy,
        state: StrTy,
        country: StrTy,
    },
});
