import {
    CompareOperator,
    type Tep2019Filter,
    type Tep2019Value,
    type Tep2021Filter,
    type Tep2021Value,
} from "$lib/graphql/generated/graphql-operations";
import { distillStatRead, type Stat, type StatData } from "./Stat";
import { findInStatSet, type StatSet } from "./StatSet";

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
        conditions: [],
    };
}

export function statFilterTypeFromString(string: "=" | "≠" | ">" | "≥" | "<" | "≤"): StatFilterType | null {
    return (
        {
            "=": StatFilterType.EQ,
            "≠": StatFilterType.NEQ,
            ">": StatFilterType.GT,
            "≥": StatFilterType.GTE,
            "<": StatFilterType.LT,
            "≤": StatFilterType.LTE,
        }[string] ?? null
    );
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

function statFilterTypeToApi(type: StatFilterType): CompareOperator {
    return {
        [StatFilterType.EQ]: CompareOperator.Eq,
        [StatFilterType.NEQ]: CompareOperator.Neq,
        [StatFilterType.GT]: CompareOperator.Gt,
        [StatFilterType.GTE]: CompareOperator.Gte,
        [StatFilterType.LT]: CompareOperator.Lt,
        [StatFilterType.LTE]: CompareOperator.Lte,
    }[type];
}

function read<T>(data: StatData<T>, val: Stat<T> | number): number | string | null {
    if (typeof val == "number") {
        return val;
    } else {
        let read = val.read(data);
        return distillStatRead(read);
    }
}

export function statDataMatchesSingleFilter<T>(
    data: StatData<T>,
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

    if (lhsValue == null || rhsValue == null) return false;

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

export function statDataMatchesFilter<T>(data: StatData<T>, filter: Filter<T>): boolean {
    switch (filter.type) {
        case "compare":
            return statDataMatchesSingleFilter(data, filter);
        case "ALL":
            return filter.conditions.length == 0 || filter.conditions.every((c) => statDataMatchesFilter(data, c));
        case "ANY":
            return filter.conditions.length == 0 || filter.conditions.some((c) => statDataMatchesFilter(data, c));
    }
}

export function filterStatDataList<T>(data: StatData<T>[], filter: Filter<T>): StatData<T>[] {
    return data.filter((d) => statDataMatchesFilter(d, filter));
}

function sideToJson<T>(side: Stat<T> | number | null): any {
    if (side == null || typeof side == "number") {
        return side;
    } else {
        return side.identifierName;
    }
}

export function filterToSimpleJson<T>(filter: Filter<T>): any {
    if (filter.type == "compare") {
        return {
            lhs: sideToJson(filter.lhs),
            op: statFilterTypeToString(filter.operator),
            rhs: sideToJson(filter.rhs),
        };
    } else {
        let key = filter.type.toLowerCase();
        return {
            [key]: filter.conditions.map(filterToSimpleJson),
        };
    }
}

function jsonToSide<T>(json: any, statSet: StatSet<T, unknown>): number | Stat<T> | null {
    if (typeof json == "number") {
        return json;
    } else if (typeof json == "string") {
        return findInStatSet(statSet, json);
    } else {
        return null;
    }
}

export function simpleJsonToFilter<T>(json: any, statSet: StatSet<T, unknown>): Filter<T> | null {
    if ("all" in json && Array.isArray(json.all)) {
        return {
            id: getFilterId(),
            type: "ALL",
            conditions: (json.all as any[])
                .map((c) => simpleJsonToFilter(c, statSet))
                .filter((c): c is Filter<T> => c != null),
        };
    } else if ("any" in json && Array.isArray(json.any)) {
        return {
            id: getFilterId(),
            type: "ANY",
            conditions: (json.any as any[])
                .map((c) => simpleJsonToFilter(c, statSet))
                .filter((c): c is Filter<T> => c != null),
        };
    } else if ("lhs" in json && "op" in json && "rhs" in json) {
        let lhs = jsonToSide(json.lhs, statSet);
        let op = typeof json.op == "string" ? statFilterTypeFromString(json.op) : null;
        let rhs = jsonToSide(json.rhs, statSet);

        if (lhs == null || op == null || rhs == null) {
            return null;
        } else {
            return {
                id: getFilterId(),
                type: "compare",
                lhs: lhs,
                operator: op,
                rhs: rhs,
            };
        }
    } else {
        return null;
    }
}

export function isEmpty(filter: Filter<unknown>): boolean {
    return (filter.type == "ALL" || filter.type == "ANY") && filter.conditions.length == 0;
}

function sideToValue<T>(side: Stat<T> | number | null): Tep2021Value | Tep2019Value | null {
    if (side == null) {
        return null;
    } else if (typeof side == "number") {
        return {
            value: side,
        };
    } else {
        return {
            field: side.apiField as any,
        };
    }
}

export function filterToApiFilter<T>(filter: Filter<T>): Tep2021Filter | Tep2019Filter {
    if (filter.type == "ALL") {
        return {
            all: filter.conditions.map(filterToApiFilter) as any,
        };
    } else if (filter.type == "ANY") {
        return {
            any: filter.conditions.map(filterToApiFilter) as any,
        };
    } else if (filter.type == "compare") {
        let lhs = sideToValue(filter.lhs);
        let rhs = sideToValue(filter.rhs);

        if (lhs == null || rhs == null) {
            return {
                condition: {
                    lhs: { value: 0 },
                    compareOperator: CompareOperator.Eq,
                    rhs: { value: 0 },
                },
            };
        } else {
            return {
                condition: {
                    lhs: lhs as any,
                    compareOperator: statFilterTypeToApi(filter.operator),
                    rhs: rhs as any,
                },
            };
        }
    } else {
        throw "Impossible";
    }
}
