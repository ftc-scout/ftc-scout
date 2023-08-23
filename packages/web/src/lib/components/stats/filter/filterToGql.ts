import {
    FilterGroupTy,
    type Filter,
    type FilterGroup,
    type FilterCondition,
    type FilterVal,
    FilterOp,
} from "@ftc-scout/common";
import {
    type FilterCond as FilterCondGql,
    type FilterValue as FilterValGql,
    type FilterGroup as FilterGroupGql,
    FilterGroupTy as FilterGroupTyGql,
    FilterOp as FilterOpGql,
    type Filter as FilterGql,
} from "../../../graphql/generated/graphql-operations";

function filterToGql(filter: Filter): FilterGql {
    return filter.ty == "group"
        ? { group: filterGroupToGql(filter.group) }
        : { cond: filterCondToGql(filter.cond) };
}

export function filterGroupToGql(filter: FilterGroup): FilterGroupGql {
    return {
        ty: filter.ty == FilterGroupTy.And ? FilterGroupTyGql.And : FilterGroupTyGql.Or,
        children: filter.children.map(filterToGql),
    };
}

function filterCondToGql(cond: FilterCondition): FilterCondGql {
    return {
        lhs: filterValToGql(cond.lhs),
        op: filterOpToGql(cond.op),
        rhs: filterValToGql(cond.rhs),
    };
}

function filterValToGql(val: FilterVal): FilterValGql {
    return val.ty == "lit" ? { lit: val.lit } : { var: val.id };
}

function filterOpToGql(op: FilterOp): FilterOpGql {
    switch (op) {
        case "Eq":
            return FilterOpGql.Eq;
        case "Neq":
            return FilterOpGql.Neq;
        case "Gt":
            return FilterOpGql.Gt;
        case "Gte":
            return FilterOpGql.Gte;
        case "Lt":
            return FilterOpGql.Lt;
        case "Lte":
            return FilterOpGql.Lte;
    }
}
