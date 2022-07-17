import { makeRequest } from "./make-request";
import { EventFtcApi } from "./types/Event";
import { Season } from "./types/Season";

export async function getAllEvents(season: Season, since: Date | null): Promise<EventFtcApi[]> {
    let resp = await makeRequest(`${season}/events`, undefined, since);

    if (resp) {
        return resp["events"];
    } else {
        return [];
    }
}
