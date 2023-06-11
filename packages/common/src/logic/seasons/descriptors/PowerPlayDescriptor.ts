import { Season } from "../../Season";
import { SeasonDescriptor } from "../SeasonDescriptor";

export const PowerPlayDescriptor = {
    season: Season.PowerPlay,
    columns: [
        {
            name: "highCones" as const,
            type: "int",
        },
    ],
} satisfies SeasonDescriptor;
