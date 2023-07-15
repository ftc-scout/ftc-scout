import { Season } from "../../Season";
import { type SeasonDescriptor, inferMSTD } from "../descriptor_types";

export const SeasonDescriptor2019: SeasonDescriptor = {
    season: Season.Skystone,
    hasRemote: false,
};

export const MatchScoreTD2019 = inferMSTD({
    ...SeasonDescriptor2019,
    gqlTys: [],
    columns: [],
});
