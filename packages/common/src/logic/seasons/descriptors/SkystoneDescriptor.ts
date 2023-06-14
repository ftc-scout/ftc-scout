import { AllianceScores2019TradFtcApi } from "packages/common/src/ftc-api-types/match-scores/MatchScores2019Trad";
import { Season } from "../../Season";
import { SpecificSeasonDescriptor } from "../SeasonDescriptor";

export const SkystoneDescriptor = {
    season: Season.Skystone,
    hasRemote: false,
    columns: [],
} satisfies SpecificSeasonDescriptor<AllianceScores2019TradFtcApi, never>;
