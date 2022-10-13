import { Arg, Field, InputType, Int, Query, registerEnumType, Resolver } from "type-graphql";
import { DATA_SOURCE } from "../../../db/data-source";
import { EventTypes } from "./EventTypes";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";
import { TeamEventParticipation } from "../../objects/TeamEventParticipation";
import { TepCondition, TepField, TepOrdering, TepRecordRow, TepRecords, TepValue } from "./TepObjects";
import { Brackets } from "typeorm";
import { TeamEventParticipation2020 } from "../../../db/entities/team-event-participation/TeamEventParticipation2020";

enum Tep2020Group {
    TOTAL,
    AVG,
    OPR,
    MIN,
    MAX,
    DEV,
}

function getGroupName(group: Tep2020Group): string {
    return {
        [Tep2020Group.TOTAL]: "tot",
        [Tep2020Group.AVG]: "avg",
        [Tep2020Group.OPR]: "opr",
        [Tep2020Group.MIN]: "min",
        [Tep2020Group.MAX]: "max",
        [Tep2020Group.DEV]: "dev",
    }[group];
}

registerEnumType(Tep2020Group, { name: "Tep2020Group" });

enum Tep2020FieldName {
    AUTO_NAVIGATION_POINTS,
    AUTO_NAVIGATION_POINTS_INDIVIDUAL,
    AUTO_GOAL_POINTS,
    AUTO_GOAL_POINTS_LOW,
    AUTO_GOAL_POINTS_MID,
    AUTO_GOAL_POINTS_HIGH,
    AUTO_WOBBLE_POINTS,
    AUTO_POWERSHOT_POINTS,
    DC_GOAL_POINTS_LOW,
    DC_GOAL_POINTS_MID,
    DC_GOAL_POINTS_HIGH,
    ENDGAME_WOBBLE_POINTS,
    ENDGAME_WOBBLE_RING_POINTS,
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

registerEnumType(Tep2020FieldName, { name: "TEP2020FieldName" });

function getFieldNameSingular(fn: Tep2020FieldName, postfix: string): string | null {
    let map: Partial<Record<Tep2020FieldName, string>> = {
        [Tep2020FieldName.RP]: `tep${postfix}.rp`,
        [Tep2020FieldName.TB1]: `tep${postfix}.tb1`,
        [Tep2020FieldName.TB2]: `tep${postfix}.tb2`,
        [Tep2020FieldName.RANK]: `tep${postfix}.rank`,
        [Tep2020FieldName.WINS]: `tep${postfix}.wins`,
        [Tep2020FieldName.LOSSES]: `tep${postfix}.losses`,
        [Tep2020FieldName.TIES]: `tep${postfix}.ties`,
        [Tep2020FieldName.DQ]: `tep${postfix}.dq`,
        [Tep2020FieldName.QUAL_MATCHES_PLAYED]: `tep${postfix}."qualMatchesPlayed"`,
        [Tep2020FieldName.TEAM_NUMBER]: `tep${postfix}."teamNumber"`,
        [Tep2020FieldName.EVENT_NAME]: `e${postfix}.name`,
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: Tep2020FieldName, postfix: string, group: Tep2020Group): string | null {
    let g = getGroupName(group);

    let map: Partial<Record<Tep2020FieldName, string>> = {
        [Tep2020FieldName.AUTO_NAVIGATION_POINTS]: `tep${postfix}."${g}Autonavigationpoints"`,
        [Tep2020FieldName.AUTO_NAVIGATION_POINTS_INDIVIDUAL]: `tep${postfix}."${g}Autonavigationpointsindividual"`,
        [Tep2020FieldName.AUTO_GOAL_POINTS]: `tep${postfix}."${g}Autogoalpoints"`,
        [Tep2020FieldName.AUTO_GOAL_POINTS_LOW]: `tep${postfix}."${g}Autogoalpointslow"`,
        [Tep2020FieldName.AUTO_GOAL_POINTS_MID]: `tep${postfix}."${g}Autogoalpointsmid"`,
        [Tep2020FieldName.AUTO_GOAL_POINTS_HIGH]: `tep${postfix}."${g}Autogoalpointshigh"`,
        [Tep2020FieldName.AUTO_WOBBLE_POINTS]: `tep${postfix}."${g}Autowobblepoints"`,
        [Tep2020FieldName.AUTO_POWERSHOT_POINTS]: `tep${postfix}."${g}Autopowershotpoints"`,
        [Tep2020FieldName.DC_GOAL_POINTS_LOW]: `tep${postfix}."${g}Drivercontrolledpointslow"`,
        [Tep2020FieldName.DC_GOAL_POINTS_MID]: `tep${postfix}."${g}Drivercontrolledpointsmid"`,
        [Tep2020FieldName.DC_GOAL_POINTS_HIGH]: `tep${postfix}."${g}Drivercontrolledpointshigh"`,
        [Tep2020FieldName.ENDGAME_WOBBLE_POINTS]: `tep${postfix}."${g}Endgamewobblepoints"`,
        [Tep2020FieldName.ENDGAME_WOBBLE_RING_POINTS]: `tep${postfix}."${g}Endgamewobbleringpoints"`,
        [Tep2020FieldName.MAJOR_PENALTY_POINTS]: `tep${postfix}."${g}Majorpenaltypoints"`,
        [Tep2020FieldName.MINOR_PENALTY_POINTS]: `tep${postfix}."${g}Minorpenaltypoints"`,
        [Tep2020FieldName.AUTO_POINTS]: `tep${postfix}."${g}Autopoints"`,
        [Tep2020FieldName.DRIVER_CONTROLLED_POINTS]: `tep${postfix}."${g}Drivercontrolledpoints"`,
        [Tep2020FieldName.ENDGAME_POINTS]: `tep${postfix}."${g}Endgamepoints"`,
        [Tep2020FieldName.PENALTY_POINTS]: `tep${postfix}."${g}Penaltypoints"`,
        [Tep2020FieldName.TOTAL_POINTS]: `tep${postfix}."${g}Totalpoints"`,
        [Tep2020FieldName.TOTAL_POINTS_NP]: `tep${postfix}."${g}Totalpointsnp"`,
    };

    return map[fn] ?? null;
}

registerEnumType(Tep2020FieldName, { name: "Tep2020FieldName" });

@InputType()
class Tep2020Field extends TepField(
    Tep2020Group,
    Tep2020FieldName,
    getFieldNameGroup,
    getFieldNameSingular,
    (_, fn) => fn == Tep2020FieldName.EVENT_NAME
) {}

@InputType()
class Tep2020Ordering extends TepOrdering<Tep2020Field, TeamEventParticipation2020>(Tep2020Field) {}

@InputType()
class Tep2020Value extends TepValue(Tep2020Field) {}

@InputType()
class Tep2020Condition extends TepCondition(Tep2020Value) {}

@InputType()
abstract class Tep2020Filter {
    @Field(() => [Tep2020Filter], { nullable: true })
    any!: Tep2020Filter[] | null;

    @Field(() => [Tep2020Filter], { nullable: true })
    all!: Tep2020Filter[] | null;

    @Field(() => Tep2020Condition, { nullable: true })
    condition!: Tep2020Condition | null;

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
export class TeamSeasonRecords2020Resolver {
    @Query(() => TepRecords)
    async teamRecords2020(
        @Arg("eventTypes", () => EventTypes) eventTypes: EventTypes,
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [Tep2020Ordering]) orderIn: Tep2020Ordering[],
        @Arg("filter", () => Tep2020Filter, { nullable: true }) filter: Tep2020Filter | null,
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

        let preFilterQuery = DATA_SOURCE.getRepository(TeamEventParticipation2020)
            .createQueryBuilder("tep2")
            .leftJoin("event", "e2", 'e2.season = 2020 AND e2.code = tep2."eventCode"')
            .select([`RANK() OVER (ORDER BY ${orderByRaw2}) as pre_filter_rank`, '"eventCode"', '"teamNumber"'])
            .where("tep2.hasStats")
            .andWhere("e2.season = 2020");

        if (region != Region.ALL) {
            preFilterQuery = preFilterQuery.andWhere('e2."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) preFilterQuery = preFilterQuery.andWhere("e2.end >= :start", { start });
        if (end) preFilterQuery = preFilterQuery.andWhere("e2.end <= :end", { end });

        if (eventTypes == EventTypes.REMOTE) {
            preFilterQuery = preFilterQuery.andWhere("e2.remote");
        } else if (eventTypes == EventTypes.TRAD) {
            preFilterQuery = preFilterQuery.andWhere("NOT e2.remote");
        }

        let query = DATA_SOURCE.getRepository(TeamEventParticipation2020)
            .createQueryBuilder("tep")
            .leftJoinAndSelect("event", "e", 'e.season = 2020 AND e.code = tep."eventCode"')
            .addSelect(`RANK() OVER (ORDER BY ${orderByRaw}) as post_filter_rank`)
            .leftJoin(
                "(" + preFilterQuery.getSql() + ")",
                "pre_rank",
                'pre_rank."eventCode" = tep."eventCode" AND pre_rank."teamNumber" = tep."teamNumber"'
            )
            .addSelect("pre_rank.pre_filter_rank", "pre_filter_rank")
            .where("tep.hasStats")
            .andWhere("e.season = 2020")
            .limit(limit)
            .offset(skip);

        if (region != Region.ALL) {
            query = query.andWhere('e."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) query = query.andWhere("e.end >= :start", { start });
        if (end) query = query.andWhere("e.end <= :end", { end });

        if (orderIn.length == 0) {
            // In case they didn't provide an order
            query = query.orderBy('tep."oprTotalpoints"', "DESC", "NULLS LAST");
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
