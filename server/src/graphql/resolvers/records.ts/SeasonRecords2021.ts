import { Arg, Field, InputType, Int, Query, registerEnumType, Resolver } from "type-graphql";
import { DATA_SOURCE } from "../../../db/data-source";
import { TeamEventParticipation2021 } from "../../../db/entities/team-event-participation/TeamEventParticipation2021";
import { TepStats2021 } from "../../../db/entities/team-event-participation/TepStats2021";
import { EventTypes } from "./EventTypes";
import { Event } from "../../../db/entities/Event";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";
import { TeamEventParticipation } from "../../../graphql/objects/TeamEventParticipation";
import { TepCondition, TepField, TepOrdering, TepRecordRow, TepRecords, TepValue } from "./TepObjects";
import { Brackets } from "typeorm";

enum Tep2021Group {
    TOTAL,
    AVG,
    OPR,
    MIN,
    MAX,
    DEV,
}

function getGroupName(group: Tep2021Group): string {
    return {
        [Tep2021Group.TOTAL]: "tot",
        [Tep2021Group.AVG]: "avg",
        [Tep2021Group.OPR]: "opr",
        [Tep2021Group.MIN]: "min",
        [Tep2021Group.MAX]: "max",
        [Tep2021Group.DEV]: "dev",
    }[group];
}

registerEnumType(Tep2021Group, { name: "TEP2021Group" });

enum Tep2021FieldName {
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

registerEnumType(Tep2021FieldName, { name: "TEP2021FieldName" });

function getFieldNameSingular(fn: Tep2021FieldName, postfix: string): string | null {
    let map: Partial<Record<Tep2021FieldName, keyof TeamEventParticipation2021 | `e.${keyof Event}` | string>> = {
        [Tep2021FieldName.RP]: "rp",
        [Tep2021FieldName.TB1]: "tb1",
        [Tep2021FieldName.TB2]: "tb2",
        [Tep2021FieldName.RANK]: "rank",
        [Tep2021FieldName.WINS]: "wins",
        [Tep2021FieldName.LOSSES]: "losses",
        [Tep2021FieldName.TIES]: "ties",
        [Tep2021FieldName.DQ]: "dq",
        [Tep2021FieldName.QUAL_MATCHES_PLAYED]: "qualMatchesPlayed",
        [Tep2021FieldName.TEAM_NUMBER]: "teamNumber",
        [Tep2021FieldName.EVENT_NAME]: `e${postfix}"."name`,
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: Tep2021FieldName): string | null {
    let map: Partial<Record<Tep2021FieldName, keyof TepStats2021>> = {
        [Tep2021FieldName.AUTO_CAROUSEL_POINTS]: "autoCarouselPoints",
        [Tep2021FieldName.AUTO_NAVIGATION_POINTS]: "autoNavigationPoints",
        [Tep2021FieldName.AUTO_NAVIGATION_POINTS_INDIVIDUAL]: "autoNavigationPointsIndividual",
        [Tep2021FieldName.AUTO_FREIGHT_POINTS]: "autoFreightPoints",
        [Tep2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_1]: "autoFreightPointsLevel1",
        [Tep2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_2]: "autoFreightPointsLevel2",
        [Tep2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_3]: "autoFreightPointsLevel3",
        [Tep2021FieldName.AUTO_FREIGHT_POINTS_STORAGE]: "autoFreightPointsStorage",
        [Tep2021FieldName.AUTO_BONUS_POINTS]: "autoBonusPoints",
        [Tep2021FieldName.AUTO_BONUS_POINTS_INDIVIDUAL]: "autoBonusPointsIndividual",
        [Tep2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS]: "driverControlledAllianceHubPoints",
        [Tep2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_1]: "driverControlledAllianceHubPointsLevel1",
        [Tep2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_2]: "driverControlledAllianceHubPointsLevel2",
        [Tep2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_3]: "driverControlledAllianceHubPointsLevel3",
        [Tep2021FieldName.DRIVER_CONTROLLED_SHARED_HUB_POINTS]: "driverControlledSharedHubPoints",
        [Tep2021FieldName.DRIVER_CONTROLLED_STORAGE_POINTS]: "driverControlledStoragePoints",
        [Tep2021FieldName.ENDGAME_DELIVERY_POINTS]: "endgameDeliveryPoints",
        [Tep2021FieldName.ALLIANCE_BALANCED_POINTS]: "allianceBalancedPoints",
        [Tep2021FieldName.SHARED_UNBALANCED_POINTS]: "sharedUnbalancedPoints",
        [Tep2021FieldName.ENDGAME_PARKING_POINTS]: "endgameParkingPoints",
        [Tep2021FieldName.ENDGAME_PARKING_POINTS_INDIVIDUAL]: "endgameParkingPoints",
        [Tep2021FieldName.CAPPING_POINTS]: "cappingPoints",
        [Tep2021FieldName.MAJOR_PENALTY_POINTS]: "majorPenaltyPoints",
        [Tep2021FieldName.MINOR_PENALTY_POINTS]: "minorPenaltyPoints",
        [Tep2021FieldName.AUTO_POINTS]: "autoPoints",
        [Tep2021FieldName.DRIVER_CONTROLLED_POINTS]: "driverControlledPoints",
        [Tep2021FieldName.ENDGAME_POINTS]: "endgamePoints",
        [Tep2021FieldName.PENALTY_POINTS]: "penaltyPoints",
        [Tep2021FieldName.TOTAL_POINTS]: "totalPoints",
        [Tep2021FieldName.TOTAL_POINTS_NP]: "totalPointsNp",
    };

    return map[fn] ?? null;
}

registerEnumType(Tep2021FieldName, { name: "TEP2021FieldName" });

@InputType()
class Tep2021Field extends TepField(
    Tep2021Group,
    Tep2021FieldName,
    getGroupName,
    getFieldNameGroup,
    getFieldNameSingular
) {}

@InputType()
class Tep2021Ordering extends TepOrdering<Tep2021Field, TeamEventParticipation2021>(Tep2021Field) {}

@InputType()
class Tep2021Value extends TepValue(Tep2021Field) {}

@InputType()
class Tep2021Condition extends TepCondition(Tep2021Value) {}

@InputType()
abstract class Tep2021Filter {
    @Field(() => [Tep2021Filter], { nullable: true })
    any!: Tep2021Filter[] | null;

    @Field(() => [Tep2021Filter], { nullable: true })
    all!: Tep2021Filter[] | null;

    @Field(() => Tep2021Condition, { nullable: true })
    condition!: Tep2021Condition | null;

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
    @Query(() => TepRecords)
    async teamRecords2021(
        @Arg("eventTypes", () => EventTypes) eventTypes: EventTypes,
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [Tep2021Ordering]) orderIn: Tep2021Ordering[],
        @Arg("filter", () => Tep2021Filter, { nullable: true }) filter: Tep2021Filter | null,
        @Arg("take", () => Int) takeIn: number,
        @Arg("skip", () => Int) skip: number
    ): Promise<TepRecords> {
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
        if (orderByRaw2.length == 0) orderByRaw2 = 'tep2."oprTotalpoints" DESC';

        let preFilterQuery = DATA_SOURCE.getRepository(TeamEventParticipation2021)
            .createQueryBuilder("tep2")
            .leftJoin("event", "e2", 'e2.season = 2021 AND e2.code = tep2."eventCode"')
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
            .leftJoinAndSelect("event", "e", 'e.season = 2021 AND e.code = tep."eventCode"')
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

        for (let i = 0; i < orderIn.length && i < 5; i++) {
            let o = orderIn[i];
            // Don't duplicate order clauses.
            if (
                orderIn
                    .slice(0, i)
                    .every((o2) => o2.field.fieldName != o.field.fieldName || o2.field.group != o.field.group)
            ) {
                query = o.addSelfToQuery(query);
            }
        }

        if (filter != null) {
            query = query.andWhere(filter.toBrackets());
        }

        let [{ entities, raw }, count] = await Promise.all([await query.getRawAndEntities(), await query.getCount()]);

        let teps: TepRecordRow[] = entities.map((e) => {
            let rawRow = raw.find((r) => r.tep_eventCode == e.eventCode && r.tep_teamNumber == e.teamNumber);
            return {
                tep: new TeamEventParticipation(e),
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
