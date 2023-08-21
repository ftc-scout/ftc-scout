import {
    FilterOp,
    IntTy,
    StrTy,
    listTy,
    nn,
    nullTy,
    wr,
    FilterGroupTy,
    StatSet,
} from "@ftc-scout/common";
import { GraphQLInputObjectType } from "graphql";
import { FilterGroupTyGQL, FilterOpGQL } from "../enums";

export const FilterGQL: GraphQLInputObjectType = new GraphQLInputObjectType({
    name: "Filter",
    fields: () => ({
        group: { type: FilterGroupGQL },
        cond: { type: FilterCondGQL },
    }),
});

export const FilterValueGQL = new GraphQLInputObjectType({
    name: "FilterValue",
    fields: {
        lit: nullTy(IntTy),
        var: nullTy(StrTy),
    },
});

export const FilterCondGQL = new GraphQLInputObjectType({
    name: "FilterCond",
    fields: {
        lhs: { type: nn(FilterValueGQL) },
        op: { type: nn(FilterOpGQL) },
        rhs: { type: nn(FilterValueGQL) },
    },
});

export const FilterGroupGQL = new GraphQLInputObjectType({
    name: "FilterGroup",
    fields: () => ({
        ty: { type: nn(FilterGroupTyGQL) },
        children: listTy(wr(nn(FilterGQL))),
    }),
});

export type TyFilterGQL = {
    cond: TyFilterCondGQL | null;
    group: TyFilterGroupGQL | null;
};

export type TyFilterValueGQL = {
    lit: number | null;
    var: string | null;
};

export type TyFilterCondGQL = {
    lhs: TyFilterValueGQL;
    op: FilterOp;
    rhs: TyFilterValueGQL;
};

export type TyFilterGroupGQL = {
    ty: FilterGroupTy;
    children: TyFilterGQL[];
};

export function filterGQLToSql(
    filter: TyFilterGQL,
    stats: StatSet<any>,
    name: (_: string) => string
): string {
    if (filter.cond == null && filter.group != null) {
        return filterGroupToSQL(filter.group, stats, name);
    } else if (filter.group == null && filter.cond != null) {
        return filterCondToSQL(filter.cond, stats, name);
    } else if (filter.group != null && filter.cond != null) {
        let g = filterGroupToSQL(filter.group, stats, name);
        let c = filterCondToSQL(filter.cond, stats, name);
        return `(${g} and ${c})`;
    } else {
        return "true";
    }
}

function filterGroupToSQL(
    group: TyFilterGroupGQL,
    stats: StatSet<any>,
    name: (_: string) => string
) {
    let baseCase = group.ty == FilterGroupTy.And ? "true" : "false";
    let sql = "(" + baseCase;

    for (let child of group.children) {
        sql += " " + group.ty + " " + filterGQLToSql(child, stats, name);
    }

    return sql + ")";
}

function filterCondToSQL(
    cond: TyFilterCondGQL,
    stats: StatSet<any>,
    name: (_: string) => string
): string {
    let lhs = filterValToSQL(cond.lhs, stats, name);
    let rhs = filterValToSQL(cond.rhs, stats, name);
    let op = opToSQL(cond.op);

    return `(${lhs} ${op} ${rhs})`;
}

function opToSQL(op: FilterOp): string {
    switch (op) {
        case "Eq":
            return "=";
        case "Neq":
            return "<>";
        case "Gt":
            return ">";
        case "Gte":
            return ">=";
        case "Lt":
            return "<";
        case "Lte":
            return "<=";
    }
}

function filterValToSQL(
    val: TyFilterValueGQL,
    stats: StatSet<any>,
    name: (_: string) => string
): string {
    if (val.lit) {
        return val.lit + "";
    } else if (val.var) {
        let sql = stats.getStat(val.var)?.sqlExpr ?? null;
        return sql ? name(sql) : "0";
    } else {
        return "0";
    }
}
