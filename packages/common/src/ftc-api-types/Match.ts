export interface MatchFtcApi {
    description: string;
    tournamentLevel: "OTHER" | "QUALIFICATION" | "SEMIFINAL" | "FINAL" | "PLAYOFF";
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
    Teams: TeamMatchParticipationFtcApi[];
}

export interface TeamMatchParticipationFtcApi {
    teamNumber: number;
    station: "Red1" | "Red2" | "Red3" | "Blue1" | "Blue2" | "Blue3" | "1";
    surrogate: boolean;
    noShow: boolean | null;
    dq: boolean | null;
    onField: boolean | null;
}
