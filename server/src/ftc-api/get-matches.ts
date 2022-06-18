import { makeRequest } from "./make-request";
import { MatchFTCAPI } from "./types/Match";
import { Season } from "./types/Season";

export async function getMatches(
    season: Season,
    eventCode: string
): Promise<MatchFTCAPI[]> {
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

    if (typeof qual == "string" || typeof playoff == "string") {
        console.log(qual, playoff);
    }

    return [
        ...(qual ? qual["schedule"] : []),
        ...(playoff ? playoff["schedule"] : []),
    ];
}
