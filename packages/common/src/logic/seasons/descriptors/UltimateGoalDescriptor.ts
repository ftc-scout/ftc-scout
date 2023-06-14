import { AllianceScores2020TradFtcApi } from "packages/common/src/ftc-api-types/match-scores/MatchScores2020Trad";
import { Season } from "../../Season";
import { SpecificSeasonDescriptor } from "../SeasonDescriptor";
import { Scores2020RemoteFtcApi } from "packages/common/src/ftc-api-types/match-scores/MatchScores2020Remote";

export const UltimateGoalDescriptor = {
    season: Season.UltimateGoal,
    hasRemote: true,
    columns: [],
} satisfies SpecificSeasonDescriptor<AllianceScores2020TradFtcApi, Scores2020RemoteFtcApi>;
