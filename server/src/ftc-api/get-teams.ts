import { makeRequest } from "./make-request";
import { Season } from "./types/Season";
import { TeamFTCAPI } from "./types/Team";

export async function getAllTeams(
    season: Season,
    since: Date | null
): Promise<TeamFTCAPI[]> {
    let teams: TeamFTCAPI[] = [];

    let currentPage: number | null = 1;
    while (currentPage !== null) {
        let {
            pageTeams,
            nextPage,
        }: { pageTeams: TeamFTCAPI[]; nextPage: number | null } =
            await getOneTeamsPage(season, currentPage, since);
        teams = teams.concat(pageTeams);
        currentPage = nextPage;
    }

    return teams;
}

async function getOneTeamsPage(
    season: Season,
    page: number,
    since: Date | null
): Promise<{ pageTeams: TeamFTCAPI[]; nextPage: number | null }> {
    let resp = await makeRequest(`${season}/teams`, { page }, since);
    if (resp) {
        let teams: TeamFTCAPI[] = resp["teams"];
        let maxPage = resp["pageTotal"];

        return {
            pageTeams: teams,
            nextPage: page === maxPage ? null : page + 1,
        };
    } else {
        return {
            pageTeams: [],
            nextPage: null,
        };
    }
}
