import { Season } from "../../Season";
import { SeasonDescriptor } from "../SeasonDescriptor";

export const UltimateGoalDescriptor = {
    season: Season.UltimateGoal,
    columns: [
        {
            name: "rings" as const,
            type: "int",
        },
    ],
} satisfies SeasonDescriptor;
