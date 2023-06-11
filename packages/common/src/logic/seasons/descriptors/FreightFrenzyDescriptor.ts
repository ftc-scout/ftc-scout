import { Season } from "../../Season";
import { SeasonDescriptor } from "../SeasonDescriptor";

export const FreightFrenzyDescriptor = {
    season: Season.FreightFrenzy,
    columns: [
        {
            name: "freight" as const,
            type: "int",
        },
    ],
} satisfies SeasonDescriptor;
