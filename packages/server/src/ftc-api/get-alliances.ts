import { Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export type AllianceApi = {
    number: number;
    captain: number | null;
    round1: number | null;
    round2: number | null;
    round3: number | null;
    backup: number | null;
    backupReplaced: number | null;
};

export async function getAlliances(
    season: Season,
    eventCode: string
): Promise<AllianceApi[] | null> {
    let resp = await getFromFtcApi(`${season}/alliances/${eventCode}`);
    let alliances = resp?.["alliances"];
    if (!Array.isArray(alliances)) return null;
    return alliances as AllianceApi[];
}
