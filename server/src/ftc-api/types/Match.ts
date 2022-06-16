export interface MatchFTCAPI {
    actualStartTime: string | null;
    description: string | null;
    tournamentLevel: string | null;
    series: number;
    matchNumber: number;
    scoreRedFinal: number;
    scoreRedFoul: number;
    scoreRedAuto: number;
    scoreBlueFinal: number;
    scoreBlueFoul: number;
    scoreBlueAuto: number;
    postResultTime: string | null;
    teams: TeamFTCAPI[];
    modifiedOn: string | null;
}

export interface TeamFTCAPI {
    teamNumber: number;
    station: string | null;
    dq: boolean;
    onField: boolean;
}
