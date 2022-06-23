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
        await new Promise((r) => setTimeout(r, 500));
    }

    return teams;
}

async function getOneTeamsPage(
    season: Season,
    page: number,
    since: Date | null
): Promise<{ pageTeams: TeamFtcApi[]; nextPage: number | null }> {
    console.log("fetching page ", page);
    let resp = await makeRequest(`${season}/teams`, { page }, since);
    if (resp) {
        let teams: TeamFtcApi[] = resp["teams"];
        let maxPage = resp["pageTotal"];

        console.log("got ", teams.length, " teams out of ", maxPage, " pages ");

        return {
            pageTeams: teams,
            nextPage: page === maxPage ? null : page + 1,
        };
    } else {
        console.log("got nothing");
        return {
            pageTeams: [],
            nextPage: null,
        };
    }
}
