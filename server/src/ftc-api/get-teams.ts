import { makeRequest } from "./make-request";
import { Season } from "./types/Season";
import { TeamFtcApi } from "./types/Team";

export async function getAllTeams(season: Season): Promise<TeamFtcApi[]> {
    let teams: TeamFtcApi[] = [];

    let currentPage: number | null = 1;
    while (currentPage !== null) {
        let { pageTeams, nextPage }: { pageTeams: TeamFtcApi[]; nextPage: number | null } = await getOneTeamsPage(
            season,
            currentPage
        );
        teams = teams.concat(pageTeams);
        currentPage = nextPage;
    }

    return teams;
}

export async function getTeamsAtEvent(season: Season, eventCode: string): Promise<number[]> {
    let teams: number[] = [];

    let currentPage: number | null = 1;
    while (currentPage !== null) {
        let { pageTeams, nextPage }: { pageTeams: TeamFtcApi[]; nextPage: number | null } = await getOneTeamsPage(
            season,
            currentPage,
            eventCode
        );
        teams = teams.concat(pageTeams.map((t) => t.teamNumber));
        currentPage = nextPage;
    }

    return teams;
}

async function getOneTeamsPage(
    season: Season,
    page: number,
    eventCode: string | null = null
): Promise<{ pageTeams: TeamFtcApi[]; nextPage: number | null }> {
    let args = eventCode ? { page, eventCode } : { page };
    let resp = await makeRequest(`${season}/teams`, args, null);
    if (resp) {
        let teams: TeamFtcApi[] = resp["teams"];
        let maxPage = resp["pageTotal"];

        return {
            pageTeams: teams,
            nextPage: page >= maxPage ? null : page + 1,
        };
    } else {
        return {
            pageTeams: [],
            nextPage: null,
        };
    }
}
