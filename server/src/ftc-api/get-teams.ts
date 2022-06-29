import { makeRequest } from "./make-request";
import { Season } from "./types/Season";
import { TeamFtcApi } from "./types/Team";

export async function getAllTeams(
    season: Season,
    since: Date | null
): Promise<TeamFtcApi[]> {
    let teams: TeamFtcApi[] = [];

    let currentPage: number | null = 1;
    while (currentPage !== null) {
        let {
            pageTeams,
            nextPage,
        }: { pageTeams: TeamFtcApi[]; nextPage: number | null } =
            await getOneTeamsPage(season, currentPage, since);
        teams = teams.concat(pageTeams);
        currentPage = nextPage;
    }

    return teams;
}

export async function getTeamsAtEvent(
    season: Season,
    eventCode: string
): Promise<number[]> {
    let teams: number[] = [];

    let currentPage: number | null = 1;
    while (currentPage !== null) {
        let {
            pageTeams,
            nextPage,
        }: { pageTeams: TeamFtcApi[]; nextPage: number | null } =
            await getOneTeamsPage(season, currentPage, null, eventCode);
        teams = teams.concat(pageTeams.map((t) => t.teamNumber));
        currentPage = nextPage;
    }

    return teams;
}

async function getOneTeamsPage(
    season: Season,
    page: number,
    since: Date | null,
    eventCode: string | null = null
): Promise<{ pageTeams: TeamFtcApi[]; nextPage: number | null }> {
    let args = eventCode ? { page, eventCode } : { page };
    let resp = await makeRequest(`${season}/teams`, args, since);
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
