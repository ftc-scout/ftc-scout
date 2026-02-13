import { Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";
import { LeagueApi } from "../db/entities/League";

export async function getLeagues(season: Season): Promise<LeagueApi[]> {
    let resp = await getFromFtcApi(`${season}/leagues`);
    return resp?.["leagues"] ?? [];
}
