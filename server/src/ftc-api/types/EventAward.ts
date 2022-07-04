export interface EventAward {
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
