export const EventType = {
    Scrimmage: "Scrimmage",
    LeagueMeet: "LeagueMeet",
    Qualifier: "Qualifier",
    LeagueTournament: "LeagueTournament",
    Championship: "Championship",
    Other: "Other",
    FIRSTChampionship: "FIRSTChampionship",
    SuperQualifier: "SuperQualifier",
    InnovationChallenge: "InnovationChallenge",
    OffSeason: "OffSeason",
    Kickoff: "Kickoff",
    Workshop: "Workshop",
    DemoExhibition: "DemoExhibition",
    VolunteerSignup: "VolunteerSignup",
    PracticeDay: "PracticeDay",
} as const;

export function eventTypeFromFtcApi(str: string): EventType | null {
    let trimmed = str.replace(/[\s\-/]/g, "");
    return Object.keys(EventType).indexOf(trimmed) != -1 ? (trimmed as EventType) : null;
}

export type EventType = (typeof EventType)[keyof typeof EventType];

export const COMPETITION_EVENT_TYPES = [
    EventType.Scrimmage,
    EventType.LeagueMeet,
    EventType.Qualifier,
    EventType.LeagueTournament,
    EventType.Championship,
    EventType.FIRSTChampionship,
    EventType.SuperQualifier,
    EventType.OffSeason,
];
