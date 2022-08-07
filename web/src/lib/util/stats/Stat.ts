import type { Tep2021Field, Tep2021FieldName, Tep2021Group } from "$lib/graphql/generated/graphql-operations";
import { StatColor } from "./stat-color";
import { StatDisplayType } from "./stat-display-type";

export interface Stat<T> {
    displayType: StatDisplayType;
    color: StatColor;
    columnName: string;
    listName: string;
    identifierName: string;
    read(
        _: T
    ):
        | number
        | { number: number; name: string }
        | { name: string; start: string; end: string; code: string; season: number }
        | string;
    apiField: Tep2021Field;
}

export function statFromGroup<U, T>(
    displayType: StatDisplayType,
    color: StatColor,
    columnName: string,
    listName: string,
    identifierName: string,
    group: keyof U,
    read: (_: T) => number,
    apiFieldName: Tep2021FieldName,
    apiGroupName: Tep2021Group
): Stat<U> {
    return {
        displayType,
        color,
        columnName,
        listName,
        identifierName,
        read: (u: U) => read(u[group] as unknown as T),
        apiField: {
            fieldName: apiFieldName,
            group: apiGroupName,
        },
    };
}

export function makeStat<T>(
    key: keyof T,
    listName: string,
    columnName: string,
    identifierName: string,
    apiFieldName: Tep2021FieldName,
    apiGroupName: Tep2021Group | null = null,
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
        apiField: {
            fieldName: apiFieldName,
            group: apiGroupName,
        },
    };
}
