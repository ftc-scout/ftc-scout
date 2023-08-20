import {
    COMPETITION_EVENT_TYPES,
    EventType,
    EventTypeOption,
    NON_COMPETITION_EVENT_TYPES,
} from "@ftc-scout/common";
import { prettyPrintEventTypeLong } from "../printers/eventType";

export function eventTyNames(ty: EventTypeOption): string {
    switch (ty) {
        case EventTypeOption.All:
            return "All";
        case EventTypeOption.Competition:
            return "Competition";
        case EventTypeOption.NonCompetition:
            return "Non Competition";
        default:
            return prettyPrintEventTypeLong(ty);
    }
}

export function eventTyMatches(option: EventTypeOption, ty: EventType): boolean {
    switch (option) {
        case EventTypeOption.All:
            return true;
        case EventTypeOption.Competition:
            return (COMPETITION_EVENT_TYPES as string[]).indexOf(ty) != -1;
        case EventTypeOption.NonCompetition:
            return (NON_COMPETITION_EVENT_TYPES as string[]).indexOf(ty) != -1;
        default:
            return option == ty;
    }
}

export function isNonCompetition(ty: EventType): boolean {
    return (NON_COMPETITION_EVENT_TYPES as string[]).indexOf(ty) != -1;
}

export function isCompetition(ty: EventType): boolean {
    return (COMPETITION_EVENT_TYPES as string[]).indexOf(ty) != -1;
}

export const EVENT_TY_GROUPS: EventTypeOption[][] = [
    [EventTypeOption.All, EventTypeOption.Competition, EventTypeOption.NonCompetition],
    COMPETITION_EVENT_TYPES,
    NON_COMPETITION_EVENT_TYPES,
];
