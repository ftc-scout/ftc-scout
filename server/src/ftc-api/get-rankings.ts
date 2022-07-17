import { makeRequest } from "./make-request";
import { Season } from "./types/Season";
import { RankingFtcApi } from "./types/TeamRanking";

export async function getEventRankings(season: Season, eventCode: string): Promise<RankingFtcApi[]> {
    let res = await makeRequest(`${season}/rankings/${eventCode}`, undefined, null);

    if (res) {
        return res["Rankings"];
    } else {
        return [];
    }
}
