import { MatchScores2021RemoteFtcApi } from "./MatchScores2021Remote";
import { MatchScores2021TradFtcApi } from "./MatchScores2021Trad";

export type MatchScoresFtcApi = MatchScores2021TradFtcApi | MatchScores2021RemoteFtcApi;

export function isMatchScores2021Trad(ms: any): ms is MatchScores2021TradFtcApi {
    return ms.alliances != undefined;
}

export function isMatchScores2021Remote(ms: any): ms is MatchScores2021RemoteFtcApi {
    return ms.teamNumber != undefined;
}
