import { LeagueApi, Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export async function getLeagues(season: Season): Promise<LeagueApi[]> {
    let resp = await getFromFtcApi(`${season}/leagues`);
    return resp?.["leagues"] ?? [];
}
