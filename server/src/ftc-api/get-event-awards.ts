import { makeRequest } from "./make-request";
import { EventAward } from "./types/EventAward";
import { Season } from "./types/Season";

export async function getEventAwards(
    season: Season,
    eventCode: string
): Promise<EventAward[]> {
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
