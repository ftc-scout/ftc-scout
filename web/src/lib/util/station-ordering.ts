import type { Station } from "../graphql/generated/graphql-operations";

export function sortStation(a: Station, b: Station): number {
    if (a.startsWith("R") && b.startsWith("B")) {
        return -1;
    } else if (a.startsWith("B") && b.startsWith("R")) {
        return 1;
    } else {
        return a < b ? -1 : 1;
    }
}
