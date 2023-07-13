import { Season } from "@ftc-scout/common";
import { GraphQLSchema } from "graphql";
import { makeMatchScoreTys } from "./match-score";

export const dynTypesSchema = new GraphQLSchema({
    types: [
        // HELP: Season Specific
        ...makeMatchScoreTys(Season.Skystone),
        ...makeMatchScoreTys(Season.UltimateGoal),
        ...makeMatchScoreTys(Season.FreightFrenzy),
        ...makeMatchScoreTys(Season.PowerPlay),
    ],
});
