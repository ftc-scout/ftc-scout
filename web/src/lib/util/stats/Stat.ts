import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";

export interface Stat<T> {
    displayType: StatDisplayType;
    color: StatColor;
    shortName: string;
    longName: string;
    read(_: T): number | { number: number; name: string };
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

export function makeStat<T>(
    key: keyof T,
    longName: string,
    shortName: string,
    color: StatColor = StatColor.PURPLE,
    displayType: StatDisplayType = StatDisplayType.INTEGER
): Stat<T> {
    return {
        color,
        displayType,
        longName,
        shortName,
        read: (s) => s[key] as any,
    };
}
