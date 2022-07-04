import { makeRequest } from "./make-request";
import { AwardFtcApi } from "./types/Award";
import { Season } from "./types/Season";

export async function getEventAwards(
    season: Season,
    eventCode: string
): Promise<AwardFtcApi[]> {
    let resp = await makeRequest(
        `${season}/awards/${eventCode}`,
        undefined,
        null
    );

    if (resp) {
        return resp["awards"];
    } else {
        return [];
    }
}
