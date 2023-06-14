import { EventFtcApi, Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export async function getAllEvents(season: Season): Promise<EventFtcApi[]> {
    let resp = await getFromFtcApi(`${season}/events`);
    return resp?.["events"] ?? [];
}
