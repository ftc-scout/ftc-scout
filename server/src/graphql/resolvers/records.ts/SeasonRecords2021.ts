import { Arg, Field, Float, InputType, Int, ObjectType, Query, registerEnumType, Resolver } from "type-graphql";
import { Brackets, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { DATA_SOURCE } from "../../../db/data-source";
import { TeamEventParticipation2021 } from "../../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TepStats2021 } from "../../../db/entities/team-event-participation/TepStats2021";
import { CompareOperator, compareOpToSql } from "./CompareOperator";
import { EventTypes } from "./EventTypes";
import { Order } from "./Order";
import { Event } from "src/db/entities/Event";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";

@ObjectType()
class TEP2021RecordRow {
    @Field(() => TeamEventParticipation2021)
    tep!: TeamEventParticipation2021;

    @Field(() => Int)
    rank!: number;

    @Field(() => Int)
    preFilterRank!: number;
}

@ObjectType()
class TEP2021Records {
    @Field(() => [TEP2021RecordRow])
    teps!: TEP2021RecordRow[];

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
    TEAM_NUMBER,
    RP,
    TB1,
    TB2,
    RANK,
    WINS,
    LOSSES,
    TIES,
    DQ,
    QUAL_MATCHES_PLAYED,
    //
    EVENT_NAME,
}

registerEnumType(TEP2021FieldName, { name: "TEP2021FieldName" });

function getFieldNameSingular(fn: TEP2021FieldName, postfix: string): string | null {
    let map: Partial<Record<TEP2021FieldName, keyof TeamEventParticipation2021 | `e.${keyof Event}` | string>> = {
        [TEP2021FieldName.RP]: "rp",
        [TEP2021FieldName.TB1]: "tb1",
        [TEP2021FieldName.TB2]: "tb2",
        [TEP2021FieldName.RANK]: "rank",
        [TEP2021FieldName.WINS]: "wins",
        [TEP2021FieldName.LOSSES]: "losses",
        [TEP2021FieldName.TIES]: "ties",
        [TEP2021FieldName.DQ]: "dq",
        [TEP2021FieldName.QUAL_MATCHES_PLAYED]: "qualMatchesPlayed",
        [TEP2021FieldName.TEAM_NUMBER]: "teamNumber",
        [TEP2021FieldName.EVENT_NAME]: `e${postfix}"."name`,
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
        if (this.value != null) {
            return "" + this.value;
        } else {
            return `${prefix}${this.field!.toSqlName("")}`;
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
class TEP2021Filter {
    @Field(() => [TEP2021Filter], { nullable: true })
    any!: TEP2021Filter[] | null;

    @Field(() => [TEP2021Filter], { nullable: true })
    all!: TEP2021Filter[] | null;

    @Field(() => TEP2021Condition, { nullable: true })
    condition!: TEP2021Condition | null;

    toBrackets(): Brackets {
        let any = this.any;
        let all = this.all;
        let condition = this.condition;

        if (any != null && all == null && condition == null) {
            return new Brackets((qb) => {
                let query = qb;
                for (let sub of any!) {
                    query = query.orWhere(sub.toBrackets());
                }
                return query;
            });
        } else if (this.any == null && this.all != null && this.condition == null) {
            return new Brackets((qb) => {
                let query = qb;
                for (let sub of all!) {
                    query = query.andWhere(sub.toBrackets());
                }
                return query;
            });
        } else if (this.any == null && this.all == null && this.condition != null) {
            return new Brackets((qb) => {
                condition!.addSelfToQuery(qb);
            });
        } else {
            throw "Invalid filter. Only one field may be set.";
        }
    }
}

@Resolver()
export class SeasonRecords2021Resolver {
    @Query(() => TEP2021Records)
    async teamRecords2021(
        @Arg("eventTypes", () => EventTypes) eventTypes: EventTypes,
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [TEP2021Ordering]) orderIn: TEP2021Ordering[],
        @Arg("filter", () => TEP2021Filter, { nullable: true }) filter: TEP2021Filter | null,
        @Arg("take", () => Int) takeIn: number,
        @Arg("skip", () => Int) skip: number
    ): Promise<TEP2021Records> {
        let limit = Math.min(takeIn, 50);

        let regionCodes = getRegionCodes(region);

        let orderByRaw = orderIn
            .slice(0, 1)
            .map((o) => o.toRawSql(""))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw.length == 0) orderByRaw = 'tep."oprTotalpoints" DESC';

        let orderByRaw2 = orderIn
            .slice(0, 1)
            .map((o) => o.toRawSql("2"))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw2.length == 0) orderByRaw = 'tep2."oprTotalpoints" DESC';

        let preFilterQuery = DATA_SOURCE.getRepository(TeamEventParticipation2021)
            .createQueryBuilder("tep2")
            .leftJoin("tep2.event", "e2")
            .select([`RANK() OVER (ORDER BY ${orderByRaw2}) as pre_filter_rank`, '"eventCode"', '"teamNumber"'])
            .where("tep2.hasStats")
            .andWhere("e2.season = 2021")
            .andWhere('e2."regionCode" IN (:...regionCodes)', { regionCodes });

        if (start) preFilterQuery = preFilterQuery.andWhere("e2.end >= :start", { start });
        if (end) preFilterQuery = preFilterQuery.andWhere("e2.end <= :end", { end });

        if (eventTypes == EventTypes.REMOTE) {
            preFilterQuery = preFilterQuery.andWhere("e2.remote");
        } else if (eventTypes == EventTypes.TRAD) {
            preFilterQuery = preFilterQuery.andWhere("NOT e2.remote");
        }

        let query = DATA_SOURCE.getRepository(TeamEventParticipation2021)
            .createQueryBuilder("tep")
            .leftJoinAndSelect("tep.event", "e")
            .addSelect(`RANK() OVER (ORDER BY ${orderByRaw}) as post_filter_rank`)
            .leftJoin(
                "(" + preFilterQuery.getSql() + ")",
                "pre_rank",
                'pre_rank."eventCode" = tep."eventCode" AND pre_rank."teamNumber" = tep."teamNumber"'
            )
            .addSelect("pre_rank.pre_filter_rank", "pre_filter_rank")
            .where("tep.hasStats")
            .andWhere("e.season = 2021")
            .andWhere('e."regionCode" IN (:...regionCodes)', { regionCodes })
            .limit(limit)
            .offset(skip);

        if (start) query = query.andWhere("e.end >= :start", { start });
        if (end) query = query.andWhere("e.end <= :end", { end });

        if (orderIn.length == 0) {
            // In case they didn't provide an order
            query = query.orderBy('tep."oprTotalpoints"', "DESC");
        }

        if (eventTypes == EventTypes.REMOTE) {
            query = query.andWhere("e.remote");
        } else if (eventTypes == EventTypes.TRAD) {
            query = query.andWhere("NOT e.remote");
        }

        for (let order of orderIn.slice(0, 5)) {
            query = order.addSelfToQuery(query);
        }

        if (filter != null) {
            query = query.andWhere(filter.toBrackets());
        }

        let [{ entities, raw }, count] = await Promise.all([await query.getRawAndEntities(), await query.getCount()]);

        let teps: TEP2021RecordRow[] = entities.map((e) => {
            let rawRow = raw.find((r) => r.tep_eventCode == e.eventCode && r.tep_teamNumber == e.teamNumber);
            return {
                tep: e,
                rank: rawRow.post_filter_rank as number,
                preFilterRank: rawRow.pre_filter_rank as number,
            };
        });

        return {
            teps,
            count,
            offset: skip,
        };
    }
}
