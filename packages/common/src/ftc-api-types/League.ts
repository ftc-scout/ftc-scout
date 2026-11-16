export type LeagueMembershipFtcApi = {
    members: number[];
};

export type LeagueApi = {
    region: string | null;
    code: string | null;
    name: string | null;
    remote: boolean | null;
    parentLeagueCode: string | null;
    parentLeagueName: string | null;
    location: string | null;
};
