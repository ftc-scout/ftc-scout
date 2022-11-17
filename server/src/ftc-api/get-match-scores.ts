import { makeRequest } from "./make-request";
import { MatchScoresFtcApi } from "./types/match-scores/MatchScores";
import { Season } from "./types/Season";

export async function getMatchScores(season: Season, eventCode: string): Promise<MatchScoresFtcApi[]> {
    let [qual, playoff] = await Promise.all([
        makeRequest(`${season}/scores/${eventCode}/qual`, undefined, null),
        makeRequest(`${season}/scores/${eventCode}/playoff`, undefined, null),
    ]);

    try {
        return [...(!!qual ? qual["MatchScores"] : []), ...(!!playoff ? playoff["MatchScores"] : [])];
    } catch {
        console.error("!!! Couldn't get match scores !!!");
        console.error(qual, season, eventCode);
        return [];
    }
}
