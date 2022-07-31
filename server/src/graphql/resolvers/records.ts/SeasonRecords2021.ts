import { Arg, Field, Float, InputType, Int, ObjectType, Query, registerEnumType, Resolver } from "type-graphql";
import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { DATA_SOURCE } from "../../../db/data-source";
import { TeamEventParticipation2021 } from "../../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TepStats2021 } from "../../../db/entities/team-event-participation/TepStats2021";
import { CompareOperator, compareOpToSql } from "./CompareOperator";
import { EventTypes } from "./EventTypes";
import { Order } from "./Order";

@ObjectType()
class TEP2021Records {
    @Field(() => [TeamEventParticipation2021])
    teps!: TeamEventParticipation2021[];

    @Field(() => Int)
    offset!: number;

    @Field(() => Int)
    count!: number;
}

enum TEP2021Group {
    TOTAL,
    AVG,
    OPR,
    MIN,
    MAX,
    DEV,
}

function getGroupName(group: TEP2021Group): string {
    return {
        [TEP2021Group.TOTAL]: "tot",
        [TEP2021Group.AVG]: "avg",
        [TEP2021Group.OPR]: "opr",
        [TEP2021Group.MIN]: "min",
        [TEP2021Group.MAX]: "max",
        [TEP2021Group.DEV]: "dev",
    }[group];
}

registerEnumType(TEP2021Group, { name: "TEP2021Group" });

enum TEP2021FieldName {
    AUTO_CAROUSEL_POINTS,
    AUTO_NAVIGATION_POINTS,
    AUTO_NAVIGATION_POINTS_INDIVIDUAL,
    AUTO_FREIGHT_POINTS,
    AUTO_FREIGHT_POINTS_LEVEL_1,
    AUTO_FREIGHT_POINTS_LEVEL_2,
    AUTO_FREIGHT_POINTS_LEVEL_3,
    AUTO_FREIGHT_POINTS_STORAGE,
    AUTO_BONUS_POINTS,
    AUTO_BONUS_POINTS_INDIVIDUAL,
    DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS,
    DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_1,
    DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_2,
    DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_3,
    DRIVER_CONTROLLED_SHARED_HUB_POINTS,
    DRIVER_CONTROLLED_STORAGE_POINTS,
    ENDGAME_DELIVERY_POINTS,
    ALLIANCE_BALANCED_POINTS,
    SHARED_UNBALANCED_POINTS,
    ENDGAME_PARKING_POINTS,
    ENDGAME_PARKING_POINTS_INDIVIDUAL,
    CAPPING_POINTS,
    MAJOR_PENALTY_POINTS,
    MINOR_PENALTY_POINTS,
    AUTO_POINTS,
    DRIVER_CONTROLLED_POINTS,
    ENDGAME_POINTS,
    PENALTY_POINTS,
    TOTAL_POINTS,
    TOTAL_POINTS_NP,
    //
    RP,
    TB1,
    TB2,
    RANK,
    WINS,
    LOSSES,
    TIES,
    DQ,
    QUAL_MATCHES_PLAYED,
}

registerEnumType(TEP2021FieldName, { name: "TEP2021FieldName" });

function getFieldNameSingular(fn: TEP2021FieldName): string | null {
    let map: Partial<Record<TEP2021FieldName, keyof TeamEventParticipation2021>> = {
        [TEP2021FieldName.RP]: "rp",
        [TEP2021FieldName.TB1]: "tb1",
        [TEP2021FieldName.TB2]: "tb2",
        [TEP2021FieldName.RANK]: "rank",
        [TEP2021FieldName.WINS]: "wins",
        [TEP2021FieldName.LOSSES]: "losses",
        [TEP2021FieldName.TIES]: "ties",
        [TEP2021FieldName.DQ]: "dq",
        [TEP2021FieldName.QUAL_MATCHES_PLAYED]: "qualMatchesPlayed",
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: TEP2021FieldName): string | null {
    let map: Partial<Record<TEP2021FieldName, keyof TepStats2021>> = {
        [TEP2021FieldName.AUTO_CAROUSEL_POINTS]: "autoCarouselPoints",
        [TEP2021FieldName.AUTO_NAVIGATION_POINTS]: "autoNavigationPoints",
        [TEP2021FieldName.AUTO_NAVIGATION_POINTS_INDIVIDUAL]: "autoNavigationPointsIndividual",
        [TEP2021FieldName.AUTO_FREIGHT_POINTS]: "autoFreightPoints",
        [TEP2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_1]: "autoFreightPointsLevel1",
        [TEP2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_2]: "autoFreightPointsLevel2",
        [TEP2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_3]: "autoFreightPointsLevel3",
        [TEP2021FieldName.AUTO_FREIGHT_POINTS_STORAGE]: "autoFreightPointsStorage",
        [TEP2021FieldName.AUTO_BONUS_POINTS]: "autoBonusPoints",
        [TEP2021FieldName.AUTO_BONUS_POINTS_INDIVIDUAL]: "autoBonusPointsIndividual",
        [TEP2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS]: "driverControlledAllianceHubPoints",
        [TEP2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_1]: "driverControlledAllianceHubPointsLevel1",
        [TEP2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_2]: "driverControlledAllianceHubPointsLevel2",
        [TEP2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_3]: "driverControlledAllianceHubPointsLevel3",
        [TEP2021FieldName.DRIVER_CONTROLLED_SHARED_HUB_POINTS]: "driverControlledSharedHubPoints",
        [TEP2021FieldName.DRIVER_CONTROLLED_STORAGE_POINTS]: "driverControlledStoragePoints",
        [TEP2021FieldName.ENDGAME_DELIVERY_POINTS]: "endgameDeliveryPoints",
        [TEP2021FieldName.ALLIANCE_BALANCED_POINTS]: "allianceBalancedPoints",
        [TEP2021FieldName.SHARED_UNBALANCED_POINTS]: "sharedUnbalancedPoints",
        [TEP2021FieldName.ENDGAME_PARKING_POINTS]: "endgameParkingPoints",
        [TEP2021FieldName.ENDGAME_PARKING_POINTS_INDIVIDUAL]: "endgameParkingPoints",
        [TEP2021FieldName.CAPPING_POINTS]: "cappingPoints",
        [TEP2021FieldName.MAJOR_PENALTY_POINTS]: "majorPenaltyPoints",
        [TEP2021FieldName.MINOR_PENALTY_POINTS]: "minorPenaltyPoints",
        [TEP2021FieldName.AUTO_POINTS]: "autoPoints",
        [TEP2021FieldName.DRIVER_CONTROLLED_POINTS]: "driverControlledPoints",
        [TEP2021FieldName.ENDGAME_POINTS]: "endgamePoints",
        [TEP2021FieldName.PENALTY_POINTS]: "penaltyPoints",
        [TEP2021FieldName.TOTAL_POINTS]: "totalPoints",
        [TEP2021FieldName.TOTAL_POINTS_NP]: "totalPointsNp",
    };

    return map[fn] ?? null;
}

registerEnumType(TEP2021FieldName, { name: "TEP2021FieldName" });

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

@InputType()
class TEP2021Field {
    @Field(() => TEP2021Group, { nullable: true })
    group!: TEP2021Group | null;

    @Field(() => TEP2021FieldName)
    fieldName!: TEP2021FieldName;

    toSqlName(): string | null {
        if (this.group) {
            let groupName = getGroupName(this.group);
            let fieldName = getFieldNameGroup(this.fieldName);

            if (!groupName || !fieldName) return null;

            return groupName + capitalizeFirstLetter(fieldName.toLowerCase());
        } else {
            return getFieldNameSingular(this.fieldName);
        }
    }
}

@InputType()
class TEP2021Ordering {
    @Field(() => TEP2021Field)
    field!: TEP2021Field;

    @Field(() => Order)
    order!: Order;

    addSelfToQuery(
        query: SelectQueryBuilder<TeamEventParticipation2021>
    ): SelectQueryBuilder<TeamEventParticipation2021> {
        let direction: "ASC" | "DESC" = this.order == Order.ASC ? "ASC" : "DESC";
        let sqlName = this.field.toSqlName();

        if (!sqlName) return query;

        return query.addOrderBy(`tep.${sqlName}`, direction);
    }
}

@InputType()
class TEP2021Value {
    @Field(() => Float, { nullable: true })
    value!: number | null;

    @Field(() => TEP2021Field, { nullable: true })
    field!: TEP2021Field | null;

    isInvalid(): boolean {
        return this.value == null && this.field == null;
    }

    toSql(prefix: string): string {
        if (this.value) {
            return "" + this.value;
        } else {
            return `${prefix}${this.field!.toSqlName()}`;
        }
    }
}

@InputType()
class TEP2021Condition {
    @Field(() => TEP2021Value)
    lhs!: TEP2021Value;

    @Field(() => CompareOperator)
    compareOperator!: CompareOperator;

    @Field(() => TEP2021Value)
    rhs!: TEP2021Value;

    addSelfToQuery(query: WhereExpressionBuilder): WhereExpressionBuilder {
        if (this.lhs.isInvalid() || this.rhs.isInvalid()) return query;

        return query.andWhere(
            `${this.lhs.toSql("tep.")} ${compareOpToSql(this.compareOperator)} ${this.rhs.toSql("tep.")}`
        );
    }
}

@InputType()
class TEP2021AndGroup {
    @Field(() => [TEP2021Condition])
    conditions!: TEP2021Condition[];

    toQueryBrackets(): Brackets {
        return new Brackets((qb) => {
            let query = qb.where("TRUE");
            for (let condition of this.conditions.slice(0, 10)) {
                query = condition.addSelfToQuery(query);
            }
            return query;
        });
    }
}

@InputType()
class TEP2021OrGroup {
    @Field(() => [TEP2021AndGroup])
    andGroups!: TEP2021AndGroup[];

    addSelfToQuery(
        query: SelectQueryBuilder<TeamEventParticipation2021>
    ): SelectQueryBuilder<TeamEventParticipation2021> {
        return query.andWhere(
            new Brackets((qb) => {
                let query = qb.where("FALSE");
                for (let and of this.andGroups.slice(0, 10)) {
                    query = query.orWhere(and.toQueryBrackets());
                }
                return query;
            })
        );
    }
}

@Resolver()
export class SeasonRecords2021Resolver {
    @Query(() => TEP2021Records)
    async teamRecords2021(
        @Arg("eventTypes", () => EventTypes) eventTypes: EventTypes,
        @Arg("order", () => [TEP2021Ordering]) orderIn: TEP2021Ordering[],
        @Arg("filter", () => TEP2021OrGroup) filters: TEP2021OrGroup,
        @Arg("take", () => Int) takeIn: number,
        @Arg("skip", () => Int) skip: number
    ): Promise<TEP2021Records> {
        let limit = Math.min(takeIn, 50);

        let query = DATA_SOURCE.getRepository(TeamEventParticipation2021)
            .createQueryBuilder("tep")
            .leftJoinAndSelect("tep.event", "e")
            .where("tep.hasStats")
            .limit(limit)
            .offset(skip);

        if (eventTypes == EventTypes.REMOTE) {
            query = query.andWhere("e.remote");
        } else if (eventTypes == EventTypes.TRAD) {
            query = query.andWhere("NOT e.remote");
        }

        for (let order of orderIn.slice(0, 5)) {
            query = order.addSelfToQuery(query);
        }

        query = filters.addSelfToQuery(query as any);

        let [teps, count] = await query.getManyAndCount();

        return {
            teps,
            count,
            offset: skip,
        };
    }
}
