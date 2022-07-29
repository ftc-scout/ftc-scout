import type { Stat } from "./Stat";

export enum StatFilterType {
    LT,
    LTE,
    GT,
    GTE,
    EQ,
    NEQ,
}

export function statFilterTypeFromString(string: string): StatFilterType | undefined {
    return {
        "=": StatFilterType.EQ,
        "≠": StatFilterType.NEQ,
        ">": StatFilterType.GT,
        "≥": StatFilterType.GTE,
        "<": StatFilterType.LT,
        "≤": StatFilterType.LTE,
    }[string];
}

export function statFilterTypeToString(type: StatFilterType): string {
    return {
        [StatFilterType.EQ]: "=",
        [StatFilterType.NEQ]: "≠",
        [StatFilterType.GT]: ">",
        [StatFilterType.GTE]: "≥",
        [StatFilterType.LT]: "<",
        [StatFilterType.LTE]: "≤",
    }[type];
}

export interface StatFilter<T> {
    type: StatFilterType;
    lhs: Stat<T> | number | null;
    rhs: Stat<T> | number | null;
}

export type StatFilterAndGroup<T> = StatFilter<T>[];
export type StatFilterOrGroup<T> = StatFilterAndGroup<T>[];

function read<T>(data: T, val: Stat<T> | number): number {
    if (typeof val == "number") {
        return val;
    } else {
        let read = val.read(data);
        if (typeof read == "number") {
            return read;
        } else {
            return read.number;
        }
    }
}

export function statDataMatchesSingleFilter<T>(data: T, filter: StatFilter<T>): boolean {
    if (filter.lhs == null || filter.rhs == null) return true;

    let lhsValue = read(data, filter.lhs);
    let rhsValue = read(data, filter.rhs);

    switch (filter.type) {
        case StatFilterType.LT:
            return lhsValue < rhsValue;
        case StatFilterType.LTE:
            return lhsValue <= rhsValue;
        case StatFilterType.GT:
            return lhsValue > rhsValue;
        case StatFilterType.GTE:
            return lhsValue >= rhsValue;
        case StatFilterType.EQ:
            return lhsValue == rhsValue;
        case StatFilterType.NEQ:
            return lhsValue != rhsValue;
    }
}

export function statDataMatchesFilterGroup<T>(data: T, filter: StatFilterOrGroup<T>): boolean {
    if (filter.length == 0) return true;

    or: for (let andGroup of filter) {
        for (let condition of andGroup) {
            if (!statDataMatchesSingleFilter(data, condition)) continue or;
        }
        return true;
    }
    return false;
}

export function filterStatDataList<T>(data: T[], filter: StatFilterOrGroup<T>): T[] {
    return data.filter((d) => statDataMatchesFilterGroup(d, filter));
}
