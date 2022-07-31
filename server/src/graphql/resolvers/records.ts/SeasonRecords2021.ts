import { Arg, Field, Float, InputType, Int, ObjectType, Query, registerEnumType, Resolver } from "type-graphql";
import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Raw } from "typeorm";
import { TeamEventParticipation2021 } from "../../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TepStats2021 } from "../../../db/entities/team-event-participation/TepStats2021";
import { CompareOperator, compareOpToSql } from "./CompareOperator";
import { EventTypes, getWhereClauseForEventTypes } from "./EventTypes";
import { Order } from "./Order";

// I hate everything in this file

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

    toSingleFindOptions(): FindOptionsOrder<TeamEventParticipation2021> | undefined {
        let direction: "asc" | "desc" = this.order == Order.ASC ? "asc" : "desc";

        if (this.field.group == null) {
            let fn = getFieldNameSingular(this.field.fieldName);
            return fn ? { [fn]: direction } : undefined;
        } else {
            let group = getGroupName(this.field.group);
            let fn = getFieldNameGroup(this.field.fieldName);
            return fn ? { [group]: { [fn]: direction } } : undefined;
        }
    }

    static toFindOptions(orders: TEP2021Ordering[]): FindOptionsOrder<TeamEventParticipation2021> | undefined {
        let x = orders.reduce((a, b) => {
            return {
                ...a,
                ...b.toSingleFindOptions(),
            };
        }, {} as FindOptionsOrder<TeamEventParticipation2021>);
        return x;
    }
}

@InputType()
class TEP2021Value {
    @Field(() => Float, { nullable: true })
    value!: number | null;

    @Field(() => TEP2021Field, { nullable: true })
    field!: TEP2021Field | null;
}

@InputType()
class TEP2021Condition {
    @Field(() => TEP2021Value)
    lhs!: TEP2021Value;

    @Field(() => CompareOperator)
    compareOperator!: CompareOperator;

    @Field(() => TEP2021Value)
    rhs!: TEP2021Value;

    toWhereClause(): FindOptionsWhere<TeamEventParticipation2021> {
        if (this.lhs.value == null && this.lhs.field == null && this.rhs.value == null && this.rhs.field == null)
            return {};

        let lhs: TEP2021Field;
        let rhs: string;

        let opSql = compareOpToSql(this.compareOperator);

        if (typeof this.rhs.value == "number" && typeof this.lhs.value == "number") {
            return {
                rp: Raw((_) => `${this.lhs.value} ${opSql} ${this.rhs.value}`),
            };
        } else if (typeof this.lhs.value == "number") {
            lhs = this.rhs.field as TEP2021Field;
            rhs = "" + this.lhs.value;
        } else if (typeof this.rhs.value == "number") {
            lhs = this.lhs.field as TEP2021Field;
            rhs = "" + this.rhs.value;
        } else {
            lhs = this.lhs.field as TEP2021Field;
            let temp = this.rhs.field!.toSqlName();
            if (temp == null) return {};
            rhs = temp;
        }

        if (lhs.group == null) {
            let fn = getFieldNameSingular(lhs.fieldName);
            return fn ? { [fn]: Raw((a) => `${a} ${opSql} ${rhs}`) } : {};
        } else {
            let group = getGroupName(lhs.group);
            let fn = getFieldNameGroup(lhs.fieldName);
            return fn ? { [group]: { [fn]: Raw((a) => `${a} ${opSql} ${rhs}`) } } : {};
        }
    }
}

@InputType()
class TEP2021AndGroup {
    @Field(() => [TEP2021Condition])
    conditions!: TEP2021Condition[];

    toWhereClause(eventTypes: EventTypes): FindOptionsWhere<TeamEventParticipation2021> {
        let ret = this.conditions.slice(0, 10).reduce(
            (a, b) => ({
                ...a,
                ...b.toWhereClause(),
            }),
            { hasStats: true } as FindOptionsWhere<TeamEventParticipation2021>
        );

        let event = getWhereClauseForEventTypes(eventTypes);
        if (event) ret.event = event;

        return ret;
    }
}

@InputType()
class TEP2021OrGroup {
    @Field(() => [TEP2021AndGroup])
    andGroups!: TEP2021AndGroup[];

    toWhereClause(eventTypes: EventTypes): FindOptionsWhere<TeamEventParticipation2021>[] {
        return this.andGroups.slice(0, 10).map((g) => g.toWhereClause(eventTypes));
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
        try {
            let take = Math.min(takeIn, 50);

            let options: FindManyOptions<TeamEventParticipation2021> = {
                relations: {
                    event: true,
                },
                where: filters.toWhereClause(eventTypes),
                take,
                skip,
            };

            let order = TEP2021Ordering.toFindOptions(orderIn.slice(0, 5));
            if (order) {
                options.order = order;
            }

            let [teps, count] = await TeamEventParticipation2021.findAndCount(options);

            return {
                teps,
                offset: skip,
                count,
            };
        } catch (e) {
            return {
                teps: [],
                offset: skip,
                count: 0,
            };
        }
    }
}
