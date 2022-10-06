import { ClassType, InputType, Field, Float, ObjectType, Int } from "type-graphql";
import { SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { TeamEventParticipation } from "../../objects/TeamEventParticipation";
import { CompareOperator, compareOpToSql } from "./CompareOperator";
import { Order } from "./Order";

export function TepField<G extends object, FN extends object, TG, TFN>(
    Group: G,
    FieldName: FN,
    getFieldNameGroup: (_: TFN, postfix: string, group: TG) => string | null,
    getFieldNameSingular: (_: TFN, postfix: string) => string | null,
    isStringIn: (_1: TG | null, _2: TFN) => boolean
) {
    @InputType()
    abstract class TepField {
        @Field(() => Group, { nullable: true })
        group!: TG | null;

        @Field(() => FieldName)
        fieldName!: TFN;

        toSqlName(postfix: string): string | null {
            if (this.group != null) {
                return getFieldNameGroup(this.fieldName, postfix, this.group);
            } else {
                return getFieldNameSingular(this.fieldName, postfix);
            }
        }

        isString(): boolean {
            return isStringIn(this.group, this.fieldName);
        }
    }

    return TepField;
}

interface TTepField {
    toSqlName(postfix: string): string | null;

    isString(): boolean;
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

            return query.addOrderBy(sqlName, direction, "NULLS LAST");
        }

        toRawSql(postfix: string): string | null {
            let direction: "ASC" | "DESC" = this.order == Order.ASC ? "ASC" : "DESC";
            let sqlName = this.field.toSqlName(postfix);

            if (!sqlName) return null;

            return `${sqlName} ${direction} NULLS LAST`;
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
            return (this.value == null && this.field == null) || this.field?.isString() == true;
        }

        toSql(prefix: string): string {
            if (this.value != null) {
                return "" + this.value;
            } else {
                return this.field!.toSqlName(prefix)!;
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
                `${this.lhs.toSql("")} ${compareOpToSql(this.compareOperator)} ${this.rhs.toSql("")}`
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
