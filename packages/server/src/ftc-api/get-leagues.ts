import { LeagueApi, Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

// Null when the request failed, so callers don't mistake it for a season without leagues.
export async function getLeagues(season: Season): Promise<LeagueApi[] | null> {
    let resp = await getFromFtcApi(`${season}/leagues`);
    return resp?.["leagues"] ?? null;
}
