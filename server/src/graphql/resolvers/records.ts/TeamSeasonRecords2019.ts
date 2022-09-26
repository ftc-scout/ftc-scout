import { Arg, Field, InputType, Int, Query, registerEnumType, Resolver } from "type-graphql";
import { DATA_SOURCE } from "../../../db/data-source";
import { Event } from "../../../db/entities/Event";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";
import { TeamEventParticipation } from "../../objects/TeamEventParticipation";
import { TepCondition, TepField, TepOrdering, TepRecordRow, TepRecords, TepValue } from "./TepObjects";
import { TeamEventParticipation2019 } from "../../../db/entities/team-event-participation/TeamEventParticipation2019";
import { Brackets } from "typeorm";

enum Tep2019Group {
    TOTAL,
    AVG,
    OPR,
    MIN,
    MAX,
    DEV,
}

function getGroupName(group: Tep2019Group): string {
    return {
        [Tep2019Group.TOTAL]: "tot",
        [Tep2019Group.AVG]: "avg",
        [Tep2019Group.OPR]: "opr",
        [Tep2019Group.MIN]: "min",
        [Tep2019Group.MAX]: "max",
        [Tep2019Group.DEV]: "dev",
    }[group];
}

registerEnumType(Tep2019Group, { name: "Tep2019Group" });

enum Tep2019FieldName {
    AUTO_NAVIGATION_POINTS,
    AUTO_NAVIGATION_POINTS_INDIVIDUAL,
    AUTO_REPOSITIONING_POINTS,
    AUTO_DELIVERY_POINTS,
    AUTO_PLACEMENT_POINTS,
    DC_DELIVERY_POINTS,
    DC_PLACEMENT_POINTS,
    DC_SKYSCRAPER_POINTS,
    CAPPING_POINTS,
    CAPPING_POINTS_INDIVIDUAL,
    ENDGAME_PARKING_POINTS,
    ENDGAME_PARKING_POINTS_INDIVIDUAL,
    FOUNDATION_MOVED_POINTS,
    AUTO_POINTS,
    DRIVER_CONTROLLED_POINTS,
    ENDGAME_POINTS,
    TOTAL_POINTS,
    TOTAL_POINTS_NP,
    //
    TEAM_NUMBER,
    RP,
    TB,
    RANK,
    WINS,
    LOSSES,
    TIES,
    DQ,
    QUAL_MATCHES_PLAYED,
    //
    EVENT_NAME,
}

registerEnumType(Tep2019FieldName, { name: "TEP2019FieldName" });

function getFieldNameSingular(fn: Tep2019FieldName, postfix: string): string | null {
    let map: Partial<Record<Tep2019FieldName, keyof TeamEventParticipation2019 | `e.${keyof Event}` | string>> = {
        [Tep2019FieldName.RP]: `tep${postfix}.rp`,
        [Tep2019FieldName.TB]: `tep${postfix}.tb`,
        [Tep2019FieldName.RANK]: `tep${postfix}.rank`,
        [Tep2019FieldName.WINS]: `tep${postfix}.wins`,
        [Tep2019FieldName.LOSSES]: `tep${postfix}.losses`,
        [Tep2019FieldName.TIES]: `tep${postfix}.ties`,
        [Tep2019FieldName.DQ]: `tep${postfix}.dq`,
        [Tep2019FieldName.QUAL_MATCHES_PLAYED]: `tep${postfix}.qualMatchesPlayed`,
        [Tep2019FieldName.TEAM_NUMBER]: `tep${postfix}.teamNumber`,
        [Tep2019FieldName.EVENT_NAME]: `e${postfix}.name`,
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: Tep2019FieldName, postfix: string, group: Tep2019Group): string | null {
    let g = getGroupName(group);

    let map: Partial<Record<Tep2019FieldName, string>> = {
        [Tep2019FieldName.AUTO_NAVIGATION_POINTS]: `tep${postfix}."${g}Autonavigationpoints"`,
        [Tep2019FieldName.AUTO_NAVIGATION_POINTS_INDIVIDUAL]: `tep${postfix}."${g}Autonavigationpointsindividual"`,
        [Tep2019FieldName.AUTO_REPOSITIONING_POINTS]: `tep${postfix}."${g}Autorepositioningpoints"`,
        [Tep2019FieldName.AUTO_DELIVERY_POINTS]: `tep${postfix}."${g}Autodeliverypoints"`,
        [Tep2019FieldName.AUTO_PLACEMENT_POINTS]: `tep${postfix}."${g}Autoplacementpoints"`,
        [Tep2019FieldName.DC_DELIVERY_POINTS]: `tep${postfix}."${g}Dcdeliverypoints"`,
        [Tep2019FieldName.DC_PLACEMENT_POINTS]: `tep${postfix}."${g}Dcplacementpoints"`,
        [Tep2019FieldName.DC_SKYSCRAPER_POINTS]: `tep${postfix}."${g}Dcskyscraperbonuspoints"`,
        [Tep2019FieldName.CAPPING_POINTS]: `tep${postfix}."${g}Cappingpoints"`,
        [Tep2019FieldName.CAPPING_POINTS_INDIVIDUAL]: `tep${postfix}."${g}Cappingpointsindividual"`,
        [Tep2019FieldName.FOUNDATION_MOVED_POINTS]: `tep${postfix}."${g}Foundationmovedpoints"`,
        [Tep2019FieldName.ENDGAME_PARKING_POINTS]: `tep${postfix}."${g}Parkingpoints"`,
        [Tep2019FieldName.ENDGAME_PARKING_POINTS_INDIVIDUAL]: `tep${postfix}."${g}Parkingpointsindividual"`,
        [Tep2019FieldName.CAPPING_POINTS]: `tep${postfix}."${g}Cappingpoints"`,
        [Tep2019FieldName.AUTO_POINTS]: `tep${postfix}."${g}Autopoints"`,
        [Tep2019FieldName.DRIVER_CONTROLLED_POINTS]: `tep${postfix}."${g}Dcpoints"`,
        [Tep2019FieldName.ENDGAME_POINTS]: `tep${postfix}."${g}Endgamepoints"`,
        [Tep2019FieldName.TOTAL_POINTS]: `tep${postfix}."${g}Totalpoints"`,
        [Tep2019FieldName.TOTAL_POINTS_NP]: `tep${postfix}."${g}Totalpointsnp"`,
    };

    return map[fn] ?? null;
}

@InputType()
class Tep2019Field extends TepField(Tep2019Group, Tep2019FieldName, getFieldNameGroup, getFieldNameSingular) {}

@InputType()
class Tep2019Ordering extends TepOrdering<Tep2019Field, TeamEventParticipation2019>(Tep2019Field) {}

@InputType()
class Tep2019Value extends TepValue(Tep2019Field) {}

@InputType()
class Tep2019Condition extends TepCondition(Tep2019Value) {}

@InputType()
abstract class Tep2019Filter {
    @Field(() => [Tep2019Filter], { nullable: true })
    any!: Tep2019Filter[] | null;

    @Field(() => [Tep2019Filter], { nullable: true })
    all!: Tep2019Filter[] | null;

    @Field(() => Tep2019Condition, { nullable: true })
    condition!: Tep2019Condition | null;

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
export class TeamSeasonRecords2019Resolver {
    @Query(() => TepRecords)
    async teamRecords2019(
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [Tep2019Ordering]) orderIn: Tep2019Ordering[],
        @Arg("filter", () => Tep2019Filter, { nullable: true }) filter: Tep2019Filter | null,
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

        let preFilterQuery = DATA_SOURCE.getRepository(TeamEventParticipation2019)
            .createQueryBuilder("tep2")
            .leftJoin("event", "e2", 'e2.season = 2019 AND e2.code = tep2."eventCode"')
            .select([`RANK() OVER (ORDER BY ${orderByRaw2}) as pre_filter_rank`, '"eventCode"', '"teamNumber"'])
            .where("tep2.hasStats")
            .andWhere("e2.season = 2019");

        if (region != Region.ALL) {
            preFilterQuery = preFilterQuery.andWhere('e2."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) preFilterQuery = preFilterQuery.andWhere("e2.end >= :start", { start });
        if (end) preFilterQuery = preFilterQuery.andWhere("e2.end <= :end", { end });

        let query = DATA_SOURCE.getRepository(TeamEventParticipation2019)
            .createQueryBuilder("tep")
            .leftJoinAndSelect("event", "e", 'e.season = 2019 AND e.code = tep."eventCode"')
            .addSelect(`RANK() OVER (ORDER BY ${orderByRaw}) as post_filter_rank`)
            .leftJoin(
                "(" + preFilterQuery.getSql() + ")",
                "pre_rank",
                'pre_rank."eventCode" = tep."eventCode" AND pre_rank."teamNumber" = tep."teamNumber"'
            )
            .addSelect("pre_rank.pre_filter_rank", "pre_filter_rank")
            .where("tep.hasStats")
            .andWhere("e.season = 2019")
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
