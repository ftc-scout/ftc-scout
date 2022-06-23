import { makeRequest } from "./make-request";
import { MatchFtcApi } from "./types/Match";
import { Season } from "./types/Season";

export async function getMatches(
    season: Season,
    eventCode: string
): Promise<MatchFtcApi[]> {
    console.log(`Requesting matches from ${season}/${eventCode}`);
    let [qual, playoff] = await Promise.all([
        makeRequest(
            `${season}/schedule/${eventCode}/qual/hybrid`,
            undefined,
            null
        ),
        makeRequest(
            `${season}/schedule/${eventCode}/playoff/hybrid`,
            undefined,
            null
        ),
    ]);

    return [
        ...(qual ? qual["schedule"] : []),
        ...(playoff ? playoff["schedule"] : []),
    ];
}
