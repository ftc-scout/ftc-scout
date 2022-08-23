import { registerEnumType } from "type-graphql";

export enum EventType {
    SCRIMMAGE = 0,
    LEAGUE_MEET = 1,
    QUALIFIER = 2,
    LEAGUE_TOURNAMENT,
    CHAMPIONSHIP = 4,
    OTHER = 5,
    FIRST_CHAMPIONSHIP = 6,
    SUPER_QUALIFIER = 7,
    INNOVATION_CHALLENGE = 9,
    OFF_SEASON = 10,
    KICKOFF = 12,
    WORKSHOP = 13,
    DEMO_EXHIBITION = 14,
    VOLUNTEER_SIGNUP = 15,
    PRACTICE_DAY = 16,
}

registerEnumType(EventType, {
    name: "EventType",
});
