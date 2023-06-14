import { AllianceScores2021TradFtcApi } from "packages/common/src/ftc-api-types/match-scores/MatchScores2021Trad";
import { Season } from "../../Season";
import { SpecificSeasonDescriptor } from "../SeasonDescriptor";
import { Scores2021RemoteFtcApi } from "packages/common/src/ftc-api-types/match-scores/MatchScores2021Remote";

export const FreightFrenzyDescriptor = {
    season: Season.FreightFrenzy,
    hasRemote: true,
    columns: [],
} satisfies SpecificSeasonDescriptor<AllianceScores2021TradFtcApi, Scores2021RemoteFtcApi>;
