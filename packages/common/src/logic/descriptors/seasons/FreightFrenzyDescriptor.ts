import { Season } from "../../Season";
import { inferDescriptor } from "../descriptor";

export const Descriptor2021 = inferDescriptor({
    season: Season.FreightFrenzy,
    hasRemote: true,
    rankings: {
        rp: "TotalPoints",
        tb: "AutoEndgameTot",
    },
    columns: [],
});
