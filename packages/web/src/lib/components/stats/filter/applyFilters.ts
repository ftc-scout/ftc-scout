import type { StatData, StatSet } from "../stat-table";
import {
    FilterOp,
    type Filter,
    type FilterCondition,
    type FilterGroup,
    type FilterVal,
} from "./filter";

export function applyFilter<T>(
    data: StatData<T>[],
    stats: StatSet<T>,
    filter: FilterGroup | null
): StatData<T>[] {
    if (filter == null) return data;

    let asFilter = { ty: "group" as const, group: filter };
    return data.filter((d) => evalFilter(d.data, stats, asFilter) ?? false);
}

function evalFilter<T>(data: T, stats: StatSet<T>, filter: Filter): boolean | null {
    return filter.ty == "group"
        ? evalFilterGroup(data, stats, filter.group)
        : evalFilterCond(data, stats, filter.cond);
}

function evalFilterGroup<T>(data: T, stats: StatSet<T>, group: FilterGroup): boolean | null {
    let base = group.ty == "and" ? true : false;
    for (let child of group.children) {
        let val = evalFilter(data, stats, child);
        if (val == null) continue;

        if (group.ty == "and") base &&= val;
        if (group.ty == "or") base ||= val;
    }
    return base;
}

function evalFilterCond<T>(data: T, stats: StatSet<T>, cond: FilterCondition): boolean | null {
    let lhs = evalFilterVal(data, stats, cond.lhs);
    let rhs = evalFilterVal(data, stats, cond.rhs);

    if (lhs == null || rhs == null) return null;

    switch (cond.op) {
        case FilterOp.Eq:
            return lhs == rhs;
        case FilterOp.Neq:
            return lhs != rhs;
        case FilterOp.Gt:
            return lhs > rhs;
        case FilterOp.Gte:
            return lhs >= rhs;
        case FilterOp.Lt:
            return lhs < rhs;
        case FilterOp.Lte:
            return lhs <= rhs;
    }
}

function evalFilterVal<T>(data: T, stats: StatSet<T>, val: FilterVal): number | string | null {
    return val.ty == "lit" ? val.lit : stats.getStat(val.id).getNonRankValueDistilled(data);
}
