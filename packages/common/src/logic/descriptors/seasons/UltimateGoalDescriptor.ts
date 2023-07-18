import { Season } from "../../Season";
import { inferDescriptor } from "../descriptor";

export const Descriptor2020 = inferDescriptor({
    season: Season.UltimateGoal,
    hasRemote: true,
    penaltiesSubtract: true,
    rankings: {
        rp: "TotalPoints",
        tb: "AutoEndgameTot",
    },
    columns: [],
});
