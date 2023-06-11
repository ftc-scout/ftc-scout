import { Season } from "../../Season";
import { SeasonDescriptor } from "../SeasonDescriptor";

export const SkystoneDescriptor = {
    season: Season.Skystone,
    columns: [
        {
            name: "bricks" as const,
            type: "int",
        },
    ],
} satisfies SeasonDescriptor;
