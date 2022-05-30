import { CURRENT_SEASON } from "../constants";
import { makeRequest } from "./make-request";
import { TeamFTCAPI } from "./types/Team";

export async function getAllTeams(): Promise<TeamFTCAPI[]> {
    let teams: TeamFTCAPI[] = [];

    let currentPage: number | null = 1;
    while (currentPage !== null) {
        let {
            pageTeams,
            nextPage,
        }: { pageTeams: TeamFTCAPI[]; nextPage: number | null } =
            await getOneTeamsPage(currentPage);
        teams = teams.concat(pageTeams);
        currentPage = nextPage;
    }

    return teams;
}

async function getOneTeamsPage(
    page: number
): Promise<{ pageTeams: TeamFTCAPI[]; nextPage: number | null }> {
    let resp = await makeRequest(`${CURRENT_SEASON}/teams`, { page });
    let teams: TeamFTCAPI[] = resp["teams"];
    let maxPage = resp["pageTotal"];

    return {
        pageTeams: teams,
        nextPage: page === maxPage ? null : page + 1,
    };
}
