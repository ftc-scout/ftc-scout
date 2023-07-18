import { Season } from "../../Season";
import { inferDescriptor } from "../descriptor";

export const Descriptor2019 = inferDescriptor({
    season: Season.Skystone,
    hasRemote: false,
    penaltiesSubtract: false,
    rankings: {
        rp: "Record",
        tb: "LosingScore",
    },
    columns: [],
});
