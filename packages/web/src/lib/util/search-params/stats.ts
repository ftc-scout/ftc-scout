import {
    SortDir,
    notEmpty,
    type StatSet,
    NonRankStatColumn,
    type FilterGroup,
    type Filter,
    type FilterVal,
    type FilterCondition,
    FilterOp,
    getFilterId,
    FilterGroupTy,
} from "@ftc-scout/common";
import type { EcDc } from "./search-params";
import { arrayEq } from "../array";

export const SORT_DIR_EC_DC = {
    encode: (dir) => (dir == SortDir.Desc ? null : "asc"),
    decode: (dir) => (dir == "asc" ? SortDir.Asc : SortDir.Desc),
} satisfies EcDc<SortDir>;

export function STAT_EC_DC<T>(set: StatSet<T>, defId: string) {
    return {
        encode: (id: string) => (id == defId ? null : id),
        decode: (id: string | null) => (id && set.getStat(id) ? id : defId),
    };
}

export function STATS_EC_DC<T>(set: StatSet<T>, defIds: string[]) {
    return {
        encode: (stats: NonRankStatColumn<T>[]) => {
            let ids = stats.map((s) => s.id);
            return arrayEq(ids, defIds) ? null : ids.join("_");
        },
        decode: (s: string | null) => {
            if (s == null) return defIds.map((id) => set.getStat(id));
            let stats = s
                .split("_")
                .map((id) => set.getStat(id))
                .filter(notEmpty);
            return stats.length ? stats : defIds.map((id) => set.getStat(id));
        },
    };
}

export function FILTER_EC_DC<T>(set: StatSet<T>) {
    return {
        encode: (f: FilterGroup | null) => (f == null ? null : encodeFilterGroup(f)),
        decode: (s: string | null) => {
            if (s == null) return null;
            let decoded = decodeFilter({ str: s, idx: 0 }, set);
            if (decoded == null || decoded.ty == "cond") return null;
            return decoded.group;
        },
    };
}

const L_PAREN = "-";
const R_PAREN = "-";
const SPACE = ".";
const COMMA = " ";

function encodeFilter(filter: Filter): string {
    return filter.ty == "group" ? encodeFilterGroup(filter.group) : encodeFilterCond(filter.cond);
}

function encodeFilterGroup(group: FilterGroup): string {
    return group.ty + L_PAREN + group.children.map(encodeFilter).join(COMMA) + R_PAREN;
}

function encodeFilterCond(cond: FilterCondition): string {
    let lhs = encodeFilterVal(cond.lhs);
    let rhs = encodeFilterVal(cond.rhs);
    return lhs + SPACE + cond.op.toLowerCase() + SPACE + rhs;
}

function encodeFilterVal(val: FilterVal): string {
    return val.ty == "lit" ? val.lit + "" : val.id;
}

function popWord(s: { str: string; idx: number }): string | null {
    let ret = "";

    while (true) {
        let c = s.str[s.idx];
        if (c == L_PAREN || c == R_PAREN || c == COMMA || c == SPACE) break;
        ret += c;
        s.idx++;
    }

    return ret == "" ? null : ret;
}

function expectChar(s: { str: string; idx: number }, c: string): boolean {
    return s.str[s.idx++] == c;
}

function decodeFilter<T>(s: { str: string; idx: number }, set: StatSet<T>): Filter | null {
    let firstWord = popWord(s);
    if (!firstWord) return null;

    if (firstWord == "and" || firstWord == "or") {
        if (!expectChar(s, L_PAREN)) return null;

        let children = [];
        while (true) {
            let child = decodeFilter(s, set);
            if (!child) return null;
            children.push(child);

            let c = s.str[s.idx++];
            if (c == R_PAREN) {
                return {
                    ty: "group",
                    id: getFilterId(),
                    group: {
                        ty: firstWord == "and" ? FilterGroupTy.And : FilterGroupTy.Or,
                        children,
                    },
                };
            } else if (c != COMMA) {
                return null;
            }
        }
    } else {
        if (!expectChar(s, SPACE)) return null;

        let opStr = popWord(s);
        if (!opStr) return null;

        if (!expectChar(s, SPACE)) return null;

        let secondWord = popWord(s);
        if (secondWord == null) return null;

        let lhs = decodeFilterVal(firstWord, set);
        let op = decodeFilterOp(opStr);
        let rhs = decodeFilterVal(secondWord, set);

        return lhs && op && rhs ? { ty: "cond", id: getFilterId(), cond: { lhs, op, rhs } } : null;
    }
}

function decodeFilterVal<T>(s: string, set: StatSet<T>): FilterVal | null {
    if (!isNaN(+s)) {
        return { ty: "lit", lit: +s };
    } else if (set.getStat(s)) {
        return { ty: "var", id: s };
    } else {
        return null;
    }
}

function decodeFilterOp(op: string): FilterOp | null {
    switch (op) {
        case "eq":
            return FilterOp.Eq;
        case "neq":
            return FilterOp.Neq;
        case "lt":
            return FilterOp.Lt;
        case "lte":
            return FilterOp.Lte;
        case "gt":
            return FilterOp.Gt;
        case "gte":
            return FilterOp.Gte;
        default:
            return null;
    }
}
