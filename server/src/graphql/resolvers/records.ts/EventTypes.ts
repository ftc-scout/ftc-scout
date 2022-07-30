import { registerEnumType } from "type-graphql";

export enum EventTypes {
    TRAD,
    REMOTE,
    TRAD_AND_REMOTE,
}

export function getWhereClauseForEventTypes(eventTypes: EventTypes): { remote: boolean } | undefined {
    switch (eventTypes) {
        case EventTypes.TRAD:
            return {
                remote: false,
            };
        case EventTypes.REMOTE:
            return {
                remote: true,
            };
        default:
            return undefined;
    }
}

registerEnumType(EventTypes, {
    name: "EventTypes",
});
