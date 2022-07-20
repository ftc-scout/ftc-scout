export interface AwardFtcApi {
    awardId: number;
    teamId: number;
    eventId: number;
    eventDivisionId: number | null;
    eventCode: string;
    name: string;
    series: number;
    teamNumber: number;
    schoolName: string | null;
    fullTeamName: string;
    person: string | null;
}

export let JUDGES_CHOICE_ID_FTC_API = 1;
