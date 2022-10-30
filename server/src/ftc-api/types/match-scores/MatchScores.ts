import { MatchScores2021RemoteFtcApi } from "./MatchScores2021Remote";
import { MatchScores2021TradFtcApi } from "./MatchScores2021Trad";
import { MatchScores2020RemoteFtcApi } from "./MatchScores2020Remote";
import { MatchScores2020TradFtcApi } from "./MatchScores2020Trad";
import { MatchScores2019FtcApi } from "./MatchScores2019";
import { MatchScores2022TradFtcApi } from "./MatchScores2022Trad";

export type MatchScoresFtcApi =
    | MatchScores2022TradFtcApi
    // | MatchScores2022RemoteFtcApi
    | MatchScores2021TradFtcApi
    | MatchScores2021RemoteFtcApi
    | MatchScores2020TradFtcApi
    | MatchScores2020RemoteFtcApi
    | MatchScores2019FtcApi;
