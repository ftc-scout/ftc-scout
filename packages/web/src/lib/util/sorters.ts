import type { FullMatchFragment } from "../graphql/generated/graphql-operations";

type E = { event: { start: any } };
export function eventSorter(a: E, b: E): number {
    return new Date(b.event.start).getTime() - new Date(a.event.start).getTime();
}

type M = { id: number };
export function matchSorter(a: M, b: M): number {
    return a.id - b.id;
}

function allianceRoleVal<C extends "Red" | "Blue">(a: T | C): number {
    if (a == "Red" || a == "Blue") return 3;

    switch (a.allianceRole) {
        case "Captain":
            return 0;
        case "FirstPick":
            return 1;
        case "SecondPick":
            return 2;
        default:
            return 0;
    }
}

type T = FullMatchFragment["teams"][number];
export function sortTeams<C extends "Red" | "Blue">(a: T | C, b: T | C): number {
    return allianceRoleVal(a) - allianceRoleVal(b);
}
