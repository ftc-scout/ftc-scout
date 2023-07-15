import { Season } from "../../Season";
import { type SeasonDescriptor, inferMSTD } from "../descriptor_types";

export const SeasonDescriptor2020: SeasonDescriptor = {
    season: Season.UltimateGoal,
    hasRemote: true,
};

export const MatchScoreTD2020 = inferMSTD({
    ...SeasonDescriptor2020,
    gqlTys: [],
    columns: [],
});
