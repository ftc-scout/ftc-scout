import { MatchFtcApi, Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export async function getMatches(season: Season, eventCode: string): Promise<MatchFtcApi[]> {
    let [qual, playoff] = await Promise.all([
        getFromFtcApi(`${season}/schedule/${eventCode}/qual/hybrid`),
        getFromFtcApi(`${season}/schedule/${eventCode}/playoff/hybrid`),
    ]);

    return [...(qual?.["schedule"] ?? []), ...(playoff?.["schedule"] ?? [])];
}
