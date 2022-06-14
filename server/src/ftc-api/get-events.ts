import { makeRequest } from "./make-request";
import { EventFTCAPI } from "./types/Event";
import { Season } from "./types/Season";

export async function getAllEvents(
    season: Season,
    since: Date | null
): Promise<EventFTCAPI[]> {
    let resp = await makeRequest(`${season}/events`, undefined, since);

    if (resp) {
        return resp["events"];
    } else {
        return [];
    }
}
