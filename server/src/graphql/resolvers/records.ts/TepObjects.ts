import { ClassType, InputType, Field, Float, ObjectType, Int } from "type-graphql";
import { SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { TeamEventParticipation } from "../../objects/TeamEventParticipation";
import { CompareOperator, compareOpToSql } from "./CompareOperator";
import { Order } from "./Order";

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function TepField<G extends object, FN extends object, TG, TFN>(
    Group: G,
    FieldName: FN,
    getGroupName: (_: TG) => string,
    getFieldNameGroup: (_: TFN) => string | null,
    getFieldNameSingular: (_: TFN, postfix: string) => string | null
) {
    @InputType()
    abstract class TepField {
        @Field(() => Group, { nullable: true })
        group!: TG | null;

        @Field(() => FieldName)
        fieldName!: TFN;

        toSqlName(postfix: string): string | null {
            if (this.group != null) {
                let groupName = getGroupName(this.group);
                let fieldName = getFieldNameGroup(this.fieldName);

                if (!groupName || !fieldName) return null;

                return groupName + capitalizeFirstLetter(fieldName.toLowerCase());
            } else {
                return getFieldNameSingular(this.fieldName, postfix);
            }
        }
    }

    return TepField;
}

interface TTepField {
    toSqlName(postfix: string): string | null;
}

export function TepOrdering<F extends TTepField, TEP>(TepField: ClassType<F>) {
    @InputType()
    abstract class TepOrdering {
        @Field(() => TepField)
        field!: F;

        @Field(() => Order)
        order!: Order;

        addSelfToQuery(query: SelectQueryBuilder<TEP>): SelectQueryBuilder<TEP> {
            let direction: "ASC" | "DESC" = this.order == Order.ASC ? "ASC" : "DESC";
            let sqlName = this.field.toSqlName("");

            if (!sqlName) return query;

            if (sqlName.includes(".")) {
                return query.addOrderBy('"' + sqlName + '"', direction);
            } else {
                return query.addOrderBy(`tep.${sqlName}`, direction);
            }
        }

        toRawSql(postfix: string): string | null {
            let direction: "ASC" | "DESC" = this.order == Order.ASC ? "ASC" : "DESC";
            let sqlName = this.field.toSqlName(postfix);

            if (!sqlName) return null;

            if (sqlName.includes(".")) {
                return '"' + sqlName + '" ' + direction;
            } else {
                return `tep${postfix}.\"${sqlName}\" ${direction}`;
            }
        }
    }

    return TepOrdering;
}

export function TepValue<F extends TTepField>(TepField: ClassType<F>) {
    @InputType()
    abstract class TepValue {
        @Field(() => Float, { nullable: true })
        value!: number | null;

        @Field(() => TepField, { nullable: true })
        field!: F | null;

        isInvalid(): boolean {
            return this.value == null && this.field == null;
        }

        toSql(prefix: string): string {
            if (this.value != null) {
                return "" + this.value;
            } else {
                return `${prefix}${this.field!.toSqlName("")}`;
            }
        }
    }

    return TepValue;
}

interface TTepValue {
    isInvalid(): boolean;

    toSql(prefix: string): string;
}

export function TepCondition<V extends TTepValue>(TepValue: ClassType<V>) {
    @InputType()
    abstract class TepCondition {
        @Field(() => TepValue)
        lhs!: V;

        @Field(() => CompareOperator)
        compareOperator!: CompareOperator;

        @Field(() => TepValue)
        rhs!: V;

        addSelfToQuery(query: WhereExpressionBuilder): WhereExpressionBuilder {
            if (this.lhs.isInvalid() || this.rhs.isInvalid()) return query;

            return query.andWhere(
                `${this.lhs.toSql("tep.")} ${compareOpToSql(this.compareOperator)} ${this.rhs.toSql("tep.")}`
            );
        }
    }

    return TepCondition;
}

@ObjectType()
export class TepRecordRow {
    @Field(() => TeamEventParticipation)
    tep!: TeamEventParticipation;

    @Field(() => Int)
    rank!: number;

    @Field(() => Int)
    preFilterRank!: number;
}

@ObjectType()
export class TepRecords {
    @Field(() => [TepRecordRow])
    teps!: TepRecordRow[];

    @Field(() => Int)
    offset!: number;

    @Field(() => Int)
    count!: number;
}
