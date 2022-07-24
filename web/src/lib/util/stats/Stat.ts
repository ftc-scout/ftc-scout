import type { StatColor } from "./stat-color";
import type { StatDisplayType } from "./stat-display-type";

export type StatList<T> = (Stat<T> | "team")[];

export interface Stat<T> {
    displayType: StatDisplayType;
    color: StatColor;
    shortName: string;
    longName: string;
    read(_: T): number;
}

export function statFromGroup<U, T>(
    displayType: StatDisplayType,
    color: StatColor,
    shortName: string,
    longName: string,
    group: keyof U,
    read: (_: T) => number
): Stat<U> {
    return {
        displayType,
        color,
        shortName,
        longName,
        read: (u: U) => read(u[group] as unknown as T),
    };
}
