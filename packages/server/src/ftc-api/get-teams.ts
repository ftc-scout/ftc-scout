import { Season, TeamFtcApi } from "@ftc-scout/common";
import { getFromFtcApi } from "./get-from-ftc-api";

export async function getTeams(
    season: Season,
    eventCode: string | null = null
): Promise<TeamFtcApi[]> {
    let teams: TeamFtcApi[] = [];

    let currentPage: number | null = 1;
    while (currentPage != null) {
        let [pageTeams, nextPage] = await oneTeamPage(season, eventCode, currentPage);
        teams = teams.concat(pageTeams);
        currentPage = nextPage;
    }

    return teams;
}

async function oneTeamPage(
    season: Season,
    eventCode: string | null,
    page: number
): Promise<[TeamFtcApi[], number | null]> {
    let args = eventCode ? { eventCode, page } : { page };
    let resp = await getFromFtcApi(`${season}/teams`, args);

    let teams = resp?.["teams"] ?? [];
    let maxPage = resp?.["pageTotal"] ?? 0;
    let nextPage = page >= maxPage ? null : page + 1;

    return [teams, nextPage];
}
