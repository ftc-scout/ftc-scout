import type { Stat } from "./Stat";

let filterId = 0;

export function getFilterId(): number {
    return filterId++;
}

export enum StatFilterType {
    LT,
    LTE,
    GT,
    GTE,
    EQ,
    NEQ,
}

export type Filter<T> =
    | {
          id?: number;
          type: "ALL" | "ANY";
          conditions: Filter<T>[];
      }
    | {
          id?: number;
          type: "compare";
          lhs: Stat<T> | number | null;
          operator: StatFilterType;
          rhs: Stat<T> | number | null;
      };

export function emptyFilter<T>(): Filter<T> {
    return {
        id: getFilterId(),
        type: "ALL",
        conditions: [
            {
                type: "compare",
                lhs: 0,
                operator: StatFilterType.EQ,
                rhs: 0,
            },
        ],
    };
}

export function statFilterTypeFromString(string: "=" | "≠" | ">" | "≥" | "<" | "≤"): StatFilterType | undefined {
    return {
        "=": StatFilterType.EQ,
        "≠": StatFilterType.NEQ,
        ">": StatFilterType.GT,
        "≥": StatFilterType.GTE,
        "<": StatFilterType.LT,
        "≤": StatFilterType.LTE,
    }[string];
}

export function statFilterTypeToString(type: StatFilterType): "=" | "≠" | ">" | "≥" | "<" | "≤" {
    return {
        [StatFilterType.EQ]: "=",
        [StatFilterType.NEQ]: "≠",
        [StatFilterType.GT]: ">",
        [StatFilterType.GTE]: "≥",
        [StatFilterType.LT]: "<",
        [StatFilterType.LTE]: "≤",
    }[type] as "=" | "≠" | ">" | "≥" | "<" | "≤";
}

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

export function statDataMatchesSingleFilter<T>(
    data: T,
    filter: {
        id?: number;
        type: "compare";
        lhs: Stat<T> | number | null;
        operator: StatFilterType;
        rhs: Stat<T> | number | null;
    }
): boolean {
    if (filter.lhs == null || filter.rhs == null) return true;

    let lhsValue = read(data, filter.lhs);
    let rhsValue = read(data, filter.rhs);

    switch (filter.operator) {
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

export function statDataMatchesFilter<T>(data: T, filter: Filter<T>): boolean {
    switch (filter.type) {
        case "compare":
            return statDataMatchesSingleFilter(data, filter);
        case "ALL":
            return filter.conditions.length == 0 || filter.conditions.every((c) => statDataMatchesFilter(data, c));
        case "ANY":
            return filter.conditions.length == 0 || filter.conditions.some((c) => statDataMatchesFilter(data, c));
    }
}

export function filterStatDataList<T>(data: T[], filter: Filter<T>): T[] {
    return data.filter((d) => statDataMatchesFilter(d, filter));
}
