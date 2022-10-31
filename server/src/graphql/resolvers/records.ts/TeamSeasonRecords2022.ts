import { Arg, Field, InputType, Int, Query, registerEnumType, Resolver } from "type-graphql";
import { DATA_SOURCE } from "../../../db/data-source";
import { Event } from "../../../db/entities/Event";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";
import { TeamEventParticipation } from "../../objects/TeamEventParticipation";
import { TepCondition, TepField, TepOrdering, TepRecordRow, TepRecords, TepValue } from "./TepObjects";
import { Brackets } from "typeorm";
import { TeamEventParticipation2022 } from "../../../db/entities/team-event-participation/TeamEventParticipation2022";

enum Tep2022Group {
    TOTAL,
    AVG,
    OPR,
    MIN,
    MAX,
    DEV,
}

function getGroupName(group: Tep2022Group): string {
    return {
        [Tep2022Group.TOTAL]: "tot",
        [Tep2022Group.AVG]: "avg",
        [Tep2022Group.OPR]: "opr",
        [Tep2022Group.MIN]: "min",
        [Tep2022Group.MAX]: "max",
        [Tep2022Group.DEV]: "dev",
    }[group];
}

registerEnumType(Tep2022Group, { name: "Tep2022Group" });

enum Tep2022FieldName {
    AUTO_NAVIGATION_POINTS,
    AUTO_NAVIGATION_POINTS_INDIVIDUAL,
    AUTO_CONE_POINTS,
    AUTO_TERMINAL_POINTS,
    AUTO_GROUND_POINTS,
    AUTO_LOW_POINTS,
    AUTO_MEDIUM_POINTS,
    AUTO_HIGH_POINTS,
    DC_TERMINAL_POINTS,
    DC_GROUND_POINTS,
    DC_LOW_POINTS,
    DC_MEDIUM_POINTS,
    DC_HIGH_POINTS,
    ENDGAME_NAVIGATION_POINTS,
    ENDGAME_NAVIGATION_POINTS_INDIVIDUAL,
    OWNERSHIP_POINTS,
    CONE_OWNERSHIP_POINTS,
    BEACON_OWNERSHIP_POINTS,
    CIRCUIT_POINTS,
    AUTO_POINTS,
    DRIVER_CONTROLLED_POINTS,
    ENDGAME_POINTS,
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

registerEnumType(Tep2022FieldName, { name: "TEP2022FieldName" });

function getFieldNameSingular(fn: Tep2022FieldName, postfix: string): string | null {
    let map: Partial<Record<Tep2022FieldName, keyof TeamEventParticipation2022 | `e.${keyof Event}` | string>> = {
        [Tep2022FieldName.RP]: `tep${postfix}.rp`,
        [Tep2022FieldName.TB1]: `tep${postfix}.tb1`,
        [Tep2022FieldName.TB2]: `tep${postfix}.tb2`,
        [Tep2022FieldName.RANK]: `tep${postfix}.rank`,
        [Tep2022FieldName.WINS]: `tep${postfix}.wins`,
        [Tep2022FieldName.LOSSES]: `tep${postfix}.losses`,
        [Tep2022FieldName.TIES]: `tep${postfix}.ties`,
        [Tep2022FieldName.DQ]: `tep${postfix}.dq`,
        [Tep2022FieldName.QUAL_MATCHES_PLAYED]: `tep${postfix}.qualMatchesPlayed`,
        [Tep2022FieldName.TEAM_NUMBER]: `tep${postfix}.teamNumber`,
        [Tep2022FieldName.EVENT_NAME]: `e${postfix}.name`,
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: Tep2022FieldName, postfix: string, group: Tep2022Group): string | null {
    let g = getGroupName(group);

    let map: Partial<Record<Tep2022FieldName, string>> = {
        [Tep2022FieldName.AUTO_NAVIGATION_POINTS]: `tep${postfix}."${g}Autonavigationpoints"`,
        [Tep2022FieldName.AUTO_NAVIGATION_POINTS_INDIVIDUAL]: `tep${postfix}."${g}Autonavigationpointsindividual"`,
        [Tep2022FieldName.AUTO_CONE_POINTS]: `tep${postfix}."${g}Autoconepoints"`,
        [Tep2022FieldName.AUTO_TERMINAL_POINTS]: `tep${postfix}."${g}Autoterminalpoints"`,
        [Tep2022FieldName.AUTO_GROUND_POINTS]: `tep${postfix}."${g}Autogroundpoints"`,
        [Tep2022FieldName.AUTO_LOW_POINTS]: `tep${postfix}."${g}Autolowpoints"`,
        [Tep2022FieldName.AUTO_MEDIUM_POINTS]: `tep${postfix}."${g}Automediumpoints"`,
        [Tep2022FieldName.AUTO_HIGH_POINTS]: `tep${postfix}."${g}Autohighpoints"`,
        [Tep2022FieldName.DC_TERMINAL_POINTS]: `tep${postfix}."${g}Dcterminalpoints"`,
        [Tep2022FieldName.DC_GROUND_POINTS]: `tep${postfix}."${g}Dcgroundpoints"`,
        [Tep2022FieldName.DC_LOW_POINTS]: `tep${postfix}."${g}Dclowpoints"`,
        [Tep2022FieldName.DC_MEDIUM_POINTS]: `tep${postfix}."${g}Dcmediumpoints"`,
        [Tep2022FieldName.DC_HIGH_POINTS]: `tep${postfix}."${g}Dchighpoints"`,
        [Tep2022FieldName.ENDGAME_NAVIGATION_POINTS]: `tep${postfix}."${g}Endgamenavigationpoints"`,
        [Tep2022FieldName.ENDGAME_NAVIGATION_POINTS_INDIVIDUAL]: `tep${postfix}."${g}Endgamenavigationpointsindividual"`,
        [Tep2022FieldName.OWNERSHIP_POINTS]: `tep${postfix}."${g}Ownershippoints"`,
        [Tep2022FieldName.CONE_OWNERSHIP_POINTS]: `tep${postfix}."${g}Coneownershippoints"`,
        [Tep2022FieldName.BEACON_OWNERSHIP_POINTS]: `tep${postfix}."${g}Beaconownershippoints"`,
        [Tep2022FieldName.CIRCUIT_POINTS]: `tep${postfix}."${g}Circuitpoints"`,
        [Tep2022FieldName.AUTO_POINTS]: `tep${postfix}."${g}Autopoints"`,
        [Tep2022FieldName.DRIVER_CONTROLLED_POINTS]: `tep${postfix}."${g}Dcpoints"`,
        [Tep2022FieldName.ENDGAME_POINTS]: `tep${postfix}."${g}Endgamepoints"`,
        [Tep2022FieldName.TOTAL_POINTS]: `tep${postfix}."${g}Totalpoints"`,
        [Tep2022FieldName.TOTAL_POINTS_NP]: `tep${postfix}."${g}Totalpointsnp"`,
    };

    return map[fn] ?? null;
}

@InputType()
class Tep2022Field extends TepField(
    Tep2022Group,
    Tep2022FieldName,
    getFieldNameGroup,
    getFieldNameSingular,
    (_, fn) => fn == Tep2022FieldName.EVENT_NAME
) {}

@InputType()
class Tep2022Ordering extends TepOrdering<Tep2022Field, TeamEventParticipation2022>(Tep2022Field) {}

@InputType()
class Tep2022Value extends TepValue(Tep2022Field) {}

@InputType()
class Tep2022Condition extends TepCondition(Tep2022Value) {}

@InputType()
abstract class Tep2022Filter {
    @Field(() => [Tep2022Filter], { nullable: true })
    any!: Tep2022Filter[] | null;

    @Field(() => [Tep2022Filter], { nullable: true })
    all!: Tep2022Filter[] | null;

    @Field(() => Tep2022Condition, { nullable: true })
    condition!: Tep2022Condition | null;

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
export class TeamSeasonRecords2022Resolver {
    @Query(() => TepRecords)
    async teamRecords2022(
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [Tep2022Ordering]) orderIn: Tep2022Ordering[],
        @Arg("filter", () => Tep2022Filter, { nullable: true }) filter: Tep2022Filter | null,
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
        if (orderByRaw.length == 0) orderByRaw = 'tep."oprTotalpointsnp" DESC';

        let orderByRaw2 = orderIn
            .slice(0, 1)
            .map((o) => o.toRawSql("2"))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw2.length == 0) orderByRaw2 = 'tep2."oprTotalpointsnp" DESC';

        let preFilterQuery = DATA_SOURCE.getRepository(TeamEventParticipation2022)
            .createQueryBuilder("tep2")
            .leftJoin("event", "e2", 'e2.season = 2022 AND e2.code = tep2."eventCode"')
            .select([`RANK() OVER (ORDER BY ${orderByRaw2}) as pre_filter_rank`, '"eventCode"', '"teamNumber"'])
            .where("tep2.hasStats")
            .andWhere("e2.season = 2022");

        if (region != Region.ALL) {
            preFilterQuery = preFilterQuery.andWhere('e2."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) preFilterQuery = preFilterQuery.andWhere("e2.end >= :start", { start });
        if (end) preFilterQuery = preFilterQuery.andWhere("e2.end <= :end", { end });

        let query = DATA_SOURCE.getRepository(TeamEventParticipation2022)
            .createQueryBuilder("tep")
            .leftJoinAndSelect("event", "e", 'e.season = 2022 AND e.code = tep."eventCode"')
            .addSelect(`RANK() OVER (ORDER BY ${orderByRaw}) as post_filter_rank`)
            .leftJoin(
                "(" + preFilterQuery.getSql() + ")",
                "pre_rank",
                'pre_rank."eventCode" = tep."eventCode" AND pre_rank."teamNumber" = tep."teamNumber"'
            )
            .addSelect("pre_rank.pre_filter_rank", "pre_filter_rank")
            .where("tep.hasStats")
            .andWhere("e.season = 2022")
            .limit(limit)
            .offset(skip);

        if (region != Region.ALL) {
            query = query.andWhere('e."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) query = query.andWhere("e.end >= :start", { start });
        if (end) query = query.andWhere("e.end <= :end", { end });

        if (orderIn.length == 0) {
            // In case they didn't provide an order
            query = query.orderBy('tep."oprTotalpointsnp"', "DESC", "NULLS LAST");
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
