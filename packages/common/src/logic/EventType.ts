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

export const EventTypeOption = {
    All: "All",
    Competition: "Competition",
    Official: "Official",
    NonCompetition: "NonCompetition",
    ...EventType,
} as const;
export type EventTypeOption = (typeof EventTypeOption)[keyof typeof EventTypeOption];

export function getEventTypes(option: EventTypeOption): EventType[] {
    switch (option) {
        case EventTypeOption.All:
            return Object.values(EventType);
        case EventTypeOption.Competition:
            return COMPETITION_EVENT_TYPES;
        case EventTypeOption.Official:
            return OFFICIAL_EVENT_TYPES;
        case EventTypeOption.NonCompetition:
            return NON_COMPETITION_EVENT_TYPES;
        default:
            return [option];
    }
}

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

export const OFFICIAL_EVENT_TYPES = [
    EventType.LeagueMeet,
    EventType.Qualifier,
    EventType.LeagueTournament,
    EventType.Championship,
    EventType.FIRSTChampionship,
    EventType.SuperQualifier,
];

export const NON_COMPETITION_EVENT_TYPES = [
    EventType.Kickoff,
    EventType.Workshop,
    EventType.DemoExhibition,
    EventType.VolunteerSignup,
    EventType.PracticeDay,
    EventType.InnovationChallenge,
    EventType.Other,
];

export const RemoteOption = {
    All: "All",
    Trad: "Trad",
    Remote: "Remote",
} as const;
export type RemoteOption = (typeof RemoteOption)[keyof typeof RemoteOption];
