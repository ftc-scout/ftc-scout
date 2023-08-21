import { notEmpty } from "../../utils/filter";

export type Filter =
    | { ty: "group"; id?: number; group: FilterGroup }
    | { ty: "cond"; id?: number; cond: FilterCondition };

let i = 0;
export function getFilterId() {
    return i++;
}

export type FilterVal = { ty: "lit"; lit: number | null } | { ty: "var"; id: string };
export const FilterOp = {
    Eq: "Eq",
    Neq: "Neq",
    Gt: "Gt",
    Gte: "Gte",
    Lt: "Lt",
    Lte: "Lte",
} as const;
export type FilterOp = (typeof FilterOp)[keyof typeof FilterOp];
export const ALL_OPS = [
    FilterOp.Eq,
    FilterOp.Neq,
    FilterOp.Gt,
    FilterOp.Gte,
    FilterOp.Lt,
    FilterOp.Lte,
];

export const FILTER_OP_SYMBOLS = {
    [FilterOp.Eq]: "=",
    [FilterOp.Neq]: "≠",
    [FilterOp.Gt]: ">",
    [FilterOp.Gte]: "≥",
    [FilterOp.Lt]: "<",
    [FilterOp.Lte]: "≤",
} as const;

export type FilterCondition = {
    lhs: FilterVal;
    op: FilterOp;
    rhs: FilterVal;
};

export const FilterGroupTy = {
    And: "and",
    Or: "or",
} as const;
export type FilterGroupTy = (typeof FilterGroupTy)[keyof typeof FilterGroupTy];

export type FilterGroup = {
    ty: FilterGroupTy;
    children: Filter[];
};

export function emptyGroup(): Filter {
    return {
        ty: "group",
        id: getFilterId(),
        group: { ty: "and", children: [] },
    };
}

export function emptyCondition(): Filter {
    return {
        ty: "cond",
        id: getFilterId(),
        cond: {
            lhs: { ty: "lit", lit: null },
            op: FilterOp.Eq,
            rhs: { ty: "lit", lit: null },
        },
    };
}

export function emptyFiler(): FilterGroup {
    return {
        ty: "and",
        children: [emptyCondition()],
    };
}

export function fullChildCount(group: FilterGroup): number {
    let tot = 0;
    for (let child of group.children) {
        if (child.ty == "cond") {
            tot += 1;
        } else {
            tot += 1 + fullChildCount(child.group);
        }
    }
    return tot;
}

export function countChildrenForSidebar(group: FilterGroup): number {
    let tot = 0;
    for (let i = 0; i < group.children.length; i++) {
        let child = group.children[i];
        if (child.ty == "cond" || i == group.children.length - 1) {
            tot += 1;
        } else {
            tot += 1 + fullChildCount(child.group);
        }
    }
    return tot;
}

export function trimFilterGroup(group: FilterGroup): FilterGroup | null {
    let newChildren = group.children.map((c) => trimFilter(c)).filter(notEmpty);
    return newChildren.length == 0 ? null : { ty: group.ty, children: newChildren };
}

export function trimFilter(filter: Filter): Filter | null {
    if (filter.ty == "group") {
        let group = trimFilterGroup(filter.group);
        return group
            ? {
                  ty: "group",
                  id: getFilterId(),
                  group,
              }
            : null;
    } else {
        if (filter.cond.lhs.ty == "lit" && filter.cond.lhs.lit == null) return null;
        if (filter.cond.rhs.ty == "lit" && filter.cond.rhs.lit == null) return null;
        return filter;
    }
}
