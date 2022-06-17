export interface MatchFTCAPI {
    description: string;
    tournamentLevel: string;
    series: number;
    matchNumber: number;
    startTime: string;
    actualStartTime: string | null;
    postResultTime: string | null;
    scoreRedFinal: number | null;
    scoreRedFoul: number | null;
    scoreRedAuto: number | null;
    scoreBlueFinal: number | null;
    scoreBlueFoul: number | null;
    scoreBlueAuto: number | null;
    teams: TeamMatchParticipationFTCAPI[];
}

export interface TeamMatchParticipationFTCAPI {
    teamNumber: number;
    station: string;
    surrogate: boolean;
    noShow: boolean | null;
    dq: boolean | null;
    onField: boolean | null;
}
