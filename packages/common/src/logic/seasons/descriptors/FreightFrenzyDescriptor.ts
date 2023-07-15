import { Season } from "../../Season";
import { type SeasonDescriptor, inferMSTD } from "../descriptor_types";

export const SeasonDescriptor2021: SeasonDescriptor = {
    season: Season.FreightFrenzy,
    hasRemote: true,
};

export const MatchScoreTD2021 = inferMSTD({
    ...SeasonDescriptor2021,
    gqlTys: [],
    columns: [],
});
