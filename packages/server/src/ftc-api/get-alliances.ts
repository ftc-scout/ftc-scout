import { Season } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export type TeamInAllianceApi = {
    teamNumber: number;
    displayTeamNumber: string;
    teamName: string;
};

export type AllianceApi = {
    number: number;
    captain: TeamInAllianceApi | null;
    round1: TeamInAllianceApi | null;
    round2: TeamInAllianceApi | null;
    round3: TeamInAllianceApi | null;
    backup: TeamInAllianceApi | null;
    backupReplaced: TeamInAllianceApi | null;
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
