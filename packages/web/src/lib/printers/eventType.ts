import type { EventType } from "@ftc-scout/common";

export function prettyPrintEventTypeShort(ty: EventType): string {
    switch (ty) {
        case "Scrimmage":
            return "SC";
        case "LeagueMeet":
            return "LM";
        case "Qualifier":
            return "QT";
        case "LeagueTournament":
            return "LT";
        case "Championship":
        case "FIRSTChampionship":
            return "CH";
        case "Other":
            return "OT";
        case "SuperQualifier":
            return "SQ";
        case "InnovationChallenge":
            return "IC";
        case "OffSeason":
            return "OS";
        case "Kickoff":
            return "KO";
        case "Workshop":
            return "WS";
        case "DemoExhibition":
            return "DE";
        case "VolunteerSignup":
            return "VS";
        case "PracticeDay":
            return "PD";
        default:
            return "";
    }
}

export function prettyPrintEventTypeLong(ty: EventType): string {
    switch (ty) {
        case "Scrimmage":
            return "Scrimmage";
        case "LeagueMeet":
            return "League Meet";
        case "Qualifier":
            return "Qualifier";
        case "LeagueTournament":
            return "League Tournament";
        case "Championship":
            return "Championship";
        case "Other":
            return "Other Event Type";
        case "FIRSTChampionship":
            return "FIRST Championship";
        case "SuperQualifier":
            return "Super Qualifier";
        case "InnovationChallenge":
            return "Innovation Challenge";
        case "OffSeason":
            return "Off Season Event";
        case "Kickoff":
            return "Kickoff";
        case "Workshop":
            return "Workshop";
        case "DemoExhibition":
            return "Demo Exhibition";
        case "VolunteerSignup":
            return "Volunteer Signup";
        case "PracticeDay":
            return "Practice Day";
        default:
            return "";
    }
}
