import { makeRequest } from "./make-request";
import { MatchScoresFtcApi } from "./types/match-scores/MatchScores";
import { Season } from "./types/Season";

export async function getMatchScores(
    season: Season,
    eventCode: string
): Promise<MatchScoresFtcApi[]> {
    let [qual, playoff] = await Promise.all([
        makeRequest(`${season}/scores/${eventCode}/qual`, undefined, null),
        makeRequest(`${season}/scores/${eventCode}/playoff`, undefined, null),
    ]);

    return [
        ...(qual ? qual["schedule"] : []),
        ...(playoff ? playoff["schedule"] : []),
    ];
}
