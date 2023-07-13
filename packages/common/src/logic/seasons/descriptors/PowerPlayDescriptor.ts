import { AllianceScores2022TradFtcApi } from "../../../ftc-api-types/match-scores/MatchScores2022Trad";
import { Season } from "../../Season";
import { type SeasonDescriptor, inferMSTD } from "../descriptor_types";

export const SeasonDescriptor2022: SeasonDescriptor = {
    season: Season.PowerPlay,
    hasRemote: true,
};

export const MatchScoreTD2022 = inferMSTD({
    season: Season.PowerPlay,
    columns: [
        {
            name: "autoTerminalCones" as const,
            ty: "int8",
            fromApi: (api: AllianceScores2022TradFtcApi) => api.autoTerminal,
        },
    ],
});
