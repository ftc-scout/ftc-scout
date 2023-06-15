import { MatchScoresFtcApi, Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export async function getMatchScores(
    season: Season,
    eventCode: string
): Promise<MatchScoresFtcApi[]> {
    let [qual, playoff] = await Promise.all([
        getFromFtcApi(`${season}/scores/${eventCode}/qual`),
        getFromFtcApi(`${season}/scores/${eventCode}/playoff`),
    ]);

    return [...(qual?.["MatchScores"] ?? []), ...(playoff?.["MatchScores"] ?? [])];
}
