import { makeRequest } from "./make-request";
import { EventFtcApi } from "./types/Event";
import { Season } from "./types/Season";

export async function getAllEvents(season: Season): Promise<EventFtcApi[]> {
    let resp = await makeRequest(`${season}/events`, undefined, null);

    if (resp) {
        return resp["events"];
    } else {
        return [];
    }
}
