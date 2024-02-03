import { AllianceScores2019TradFtcApi } from "./MatchScores2019Trad";
import { Scores2020RemoteFtcApi } from "./MatchScores2020Remote";
import { AllianceScores2020TradFtcApi } from "./MatchScores2020Trad";
import { Scores2021RemoteFtcApi } from "./MatchScores2021Remote";
import { AllianceScores2021TradFtcApi } from "./MatchScores2021Trad";
import { AllianceScores2022TradFtcApi } from "./MatchScores2022Trad";
import { AllianceScores2023TradFtcApi } from "./MatchScores2023Trad";

export interface TradTopLevel<AllianceScore> {
    matchLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
    matchSeries: number;
    matchNumber: number;
    Alliances: AllianceScore[];
}

export interface RemoteTopLevel<Score> {
    matchLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
    matchNumber: number;
    teamNumber: number;
    scores: Score;
}

// HELP: Season Specific
export type MatchScoresFtcApi =
    | TradTopLevel<AllianceScores2023TradFtcApi>
    | TradTopLevel<AllianceScores2022TradFtcApi>
    | TradTopLevel<AllianceScores2021TradFtcApi>
    | RemoteTopLevel<Scores2021RemoteFtcApi>
    | TradTopLevel<AllianceScores2020TradFtcApi>
    | RemoteTopLevel<Scores2020RemoteFtcApi>
    | TradTopLevel<AllianceScores2019TradFtcApi>;
