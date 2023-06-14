import { AllianceScores2022TradFtcApi } from "packages/common/src/ftc-api-types/match-scores/MatchScores2022Trad";
import { Season } from "../../Season";
import { SpecificSeasonDescriptor } from "../SeasonDescriptor";

export const PowerPlayDescriptor = {
    season: Season.PowerPlay,
    hasRemote: false,
    columns: [
        {
            name: "autoTerminalCones" as const,
            type: "int8",
            fromTradApi: (api) => api.autoTerminal,
        },
    ],
} satisfies SpecificSeasonDescriptor<AllianceScores2022TradFtcApi, never>;
