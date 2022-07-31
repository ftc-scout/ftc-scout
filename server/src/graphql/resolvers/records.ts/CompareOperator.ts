import { registerEnumType } from "type-graphql";

export enum CompareOperator {
    LT,
    LTE,
    GT,
    GTE,
    EQ,
    NEQ,
}

export function compareOpToSql(compareOp: CompareOperator): string {
    switch (compareOp) {
        case CompareOperator.EQ:
            return "=";
        case CompareOperator.NEQ:
            return "<>";
        case CompareOperator.GT:
            return ">";
        case CompareOperator.GTE:
            return ">=";
        case CompareOperator.LT:
            return "<";
        case CompareOperator.LTE:
            return "<=";
    }
}

registerEnumType(CompareOperator, {
    name: "CompareOperator",
});
