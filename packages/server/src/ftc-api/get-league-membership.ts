import { LeagueMembershipFtcApi, Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export async function getLeagueMembership(
    season: Season,
    leagueCode: string,
    regionCode: string
): Promise<LeagueMembershipFtcApi | null> {
    return await getFromFtcApi(`${season}/leagues/members/${regionCode}/${leagueCode}`);
}
