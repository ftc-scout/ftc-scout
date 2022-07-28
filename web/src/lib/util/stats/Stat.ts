import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";

export interface Stat<T> {
    displayType: StatDisplayType;
    color: StatColor;
    columnName: string;
    listName: string;
    identifierName: string;
    read(_: T): number | { number: number; name: string };
}

export function statFromGroup<U, T>(
    displayType: StatDisplayType,
    color: StatColor,
    columnName: string,
    listName: string,
    identifierName: string,
    group: keyof U,
    read: (_: T) => number
): Stat<U> {
    return {
        displayType,
        color,
        columnName,
        listName,
        identifierName,
        read: (u: U) => read(u[group] as unknown as T),
    };
}

export function makeStat<T>(
    key: keyof T,
    listName: string,
    columnName: string,
    identifierName: string,
    color: StatColor = StatColor.PURPLE,
    displayType: StatDisplayType = StatDisplayType.INTEGER
): Stat<T> {
    return {
        color,
        displayType,
        listName,
        columnName,
        identifierName,
        read: (s) => s[key] as any,
    };
}
