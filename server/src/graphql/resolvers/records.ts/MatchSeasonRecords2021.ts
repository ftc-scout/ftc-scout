import { Arg, Field, InputType, Int, Query, registerEnumType, Resolver } from "type-graphql";
import { DATA_SOURCE } from "../../../db/data-source";
import { EventTypes } from "./EventTypes";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";
import { TepCondition, TepField, TepOrdering, TepValue } from "./TepObjects";
import { Brackets } from "typeorm";
import { MatchScores2021 } from "../../../db/entities/MatchScores2021";
import { MatchGroup, MatchRecordRow, MatchRecords } from "./MatchObjects";
import { MatchScores2021TradAllianceGraphql } from "../../objects/MatchScores2021TradGraphql";
import { MatchScores2021RemoteGraphql } from "../../objects/MatchScores2021RemoteGraphql";

enum Match2021FieldName {
    AUTO_CAROUSEL_POINTS,
    AUTO_NAVIGATION_POINTS,
    AUTO_FREIGHT_POINTS,
    AUTO_FREIGHT_POINTS_LEVEL_1,
    AUTO_FREIGHT_POINTS_LEVEL_2,
    AUTO_FREIGHT_POINTS_LEVEL_3,
    AUTO_FREIGHT_POINTS_STORAGE,
    AUTO_BONUS_POINTS,
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
    // TEAM1_NUMBER,
    // TEAM2_NUMBER,
    MATCH_NUMBER,
    EVENT_NAME,
}

registerEnumType(Match2021FieldName, { name: "Match2021FieldName" });

function getFieldNameSingular(fn: Match2021FieldName, postfix: string): string | null {
    let map: Partial<Record<Match2021FieldName, string>> = {
        // [Match2021FieldName.TEAM1_NUMBER]: `teamNumber`,
        // [Match2021FieldName.TEAM2_NUMBER]: `teamNumber`,
        [Match2021FieldName.MATCH_NUMBER]: `(s${postfix}."matchId" % 1000)`,
        [Match2021FieldName.EVENT_NAME]: `e${postfix}.name`,
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: Match2021FieldName, postfix: string, group: MatchGroup): string | null {
    let g = (group == MatchGroup.THIS ? "s" : "os") + postfix;

    let map: Partial<Record<Match2021FieldName, string>> = {
        [Match2021FieldName.AUTO_CAROUSEL_POINTS]: `${g}."autoCarouselPoints"`,
        [Match2021FieldName.AUTO_NAVIGATION_POINTS]: `${g}."autoNavigationPoints"`,
        [Match2021FieldName.AUTO_FREIGHT_POINTS]: `${g}."autoFreightPoints"`,
        [Match2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_1]: `(${g}."autoFreight1" * 6)`,
        [Match2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_2]: `(${g}."autoFreight2" * 6)`,
        [Match2021FieldName.AUTO_FREIGHT_POINTS_LEVEL_3]: `(${g}."autoFreight3" * 6)`,
        [Match2021FieldName.AUTO_FREIGHT_POINTS_STORAGE]: `(${g}."autoStorageFreight") * 2"`,
        [Match2021FieldName.AUTO_BONUS_POINTS]: `${g}."autoBonusPoints"`,
        [Match2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS]: `${g}."driverControlledAllianceHubPoints"`,
        [Match2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_1]: `(${g}."driverControlledFreight1" * 2)`,
        [Match2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_2]: `(${g}."driverControlledFreight2" * 4)`,
        [Match2021FieldName.DRIVER_CONTROLLED_ALLIANCE_HUB_POINTS_LEVEL_3]: `(${g}."driverControlledFreight3" * 6)`,
        [Match2021FieldName.DRIVER_CONTROLLED_SHARED_HUB_POINTS]: `${g}."driverControlledSharedHubPoints"`,
        [Match2021FieldName.DRIVER_CONTROLLED_STORAGE_POINTS]: `${g}."driverControlledStoragePoints"`,
        [Match2021FieldName.ENDGAME_DELIVERY_POINTS]: `${g}."endgameDeliveryPoints"`,
        [Match2021FieldName.ALLIANCE_BALANCED_POINTS]: `${g}."allianceBalancedPoints"`,
        [Match2021FieldName.SHARED_UNBALANCED_POINTS]: `${g}."sharedUnbalancedPoints"`,
        [Match2021FieldName.ENDGAME_PARKING_POINTS]: `${g}."endgameParkingPoints"`,
        [Match2021FieldName.CAPPING_POINTS]: `${g}."cappingPoints"`,
        [Match2021FieldName.MAJOR_PENALTY_POINTS]: `(${g}."majorPenalties" * -30)`,
        [Match2021FieldName.MINOR_PENALTY_POINTS]: `(${g}."minorPenalties" * -10)`,
        [Match2021FieldName.AUTO_POINTS]: `${g}."autoPoints"`,
        [Match2021FieldName.DRIVER_CONTROLLED_POINTS]: `${g}."driverControlledPoints"`,
        [Match2021FieldName.ENDGAME_POINTS]: `${g}."endgamePoints"`,
        [Match2021FieldName.PENALTY_POINTS]: `${g}."penaltyPoints"`,
        [Match2021FieldName.TOTAL_POINTS]: `${g}."totalPoints"`,
        [Match2021FieldName.TOTAL_POINTS_NP]: `${g}."totalPointsNp"`,
    };

    return map[fn] ?? null;
}

@InputType()
class Match2021Field extends TepField(MatchGroup, Match2021FieldName, getFieldNameGroup, getFieldNameSingular) {}

@InputType()
class Match2021Ordering extends TepOrdering<Match2021Field, MatchScores2021>(Match2021Field) {}

@InputType()
class Match2021Value extends TepValue(Match2021Field) {}

@InputType()
class Match2021Condition extends TepCondition(Match2021Value) {}

@InputType()
abstract class Match2021Filter {
    @Field(() => [Match2021Filter], { nullable: true })
    any!: Match2021Filter[] | null;

    @Field(() => [Match2021Filter], { nullable: true })
    all!: Match2021Filter[] | null;

    @Field(() => Match2021Filter, { nullable: true })
    condition!: Match2021Condition | null;

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
export class MatchSeasonRecords2021Resolver {
    @Query(() => MatchRecords)
    async matchRecords2021(
        @Arg("eventTypes", () => EventTypes) eventTypes: EventTypes,
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [Match2021Ordering]) orderIn: Match2021Ordering[],
        @Arg("filter", () => Match2021Filter, { nullable: true }) filter: Match2021Filter | null,
        @Arg("take", () => Int) takeIn: number,
        @Arg("skip", () => Int) skip: number
    ): Promise<MatchRecords> {
        let limit = Math.min(takeIn, 50);

        let regionCodes = getRegionCodes(region);

        let orderByRaw = orderIn
            .slice(0, 1)
            .map((o) => o.toRawSql(""))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw.length == 0) orderByRaw = 's."totalPoints" DESC';

        let orderByRaw2 = orderIn
            .slice(0, 1)
            .map((o) => o.toRawSql("2"))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw2.length == 0) orderByRaw2 = 's2."totalPoints" DESC';

        let preFilterQuery = DATA_SOURCE.getRepository(MatchScores2021)
            .createQueryBuilder("s2")
            .leftJoin("event", "e2", 'e2.season = 2021 AND e2.code = s2."eventCode"')
            .leftJoin(
                "match",
                "m2",
                'm2."eventSeason" = 2021 AND m2."eventCode" = s2."eventCode" AND m2.id = s2."matchId"'
            )
            .leftJoin(
                "match_scores2021",
                "os2",
                'os2."eventCode" = s2."eventCode" AND os2."matchId" = s2."matchId" AND os2.alliance <> s2.alliance'
            )
            .select([
                `RANK() OVER (ORDER BY ${orderByRaw2}) as pre_filter_rank`,
                's2."eventCode"',
                's2."matchId"',
                's2."alliance"',
            ])
            .where('m2."hasBeenPlayed"')
            .andWhere("e2.season = 2021");

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

        let query = DATA_SOURCE.getRepository(MatchScores2021)
            .createQueryBuilder("s")
            .leftJoin("event", "e", 'e.season = 2021 AND e.code = s."eventCode"')
            .leftJoin("match", "m", 'm."eventSeason" = 2021 AND m."eventCode" = s."eventCode" AND m.id = s."matchId"')
            .leftJoin(
                "match_scores2021",
                "os",
                'os."eventCode" = s."eventCode" AND os."matchId" = s."matchId" AND os.alliance <> s.alliance'
            )
            .addSelect(`RANK() OVER (ORDER BY ${orderByRaw}) as post_filter_rank`)
            .leftJoin(
                "(" + preFilterQuery.getSql() + ")",
                "pre_rank",
                'pre_rank."eventCode" = s."eventCode" AND pre_rank."matchId" = s."matchId" AND pre_rank.alliance = s.alliance'
            )
            .addSelect("pre_rank.pre_filter_rank", "pre_filter_rank")
            .addSelect("e.remote")
            .where('m."hasBeenPlayed"')
            .andWhere("e.season = 2021")
            .limit(limit)
            .offset(skip);

        if (region != Region.ALL) {
            query = query.andWhere('e."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) query = query.andWhere("e.end >= :start", { start });
        if (end) query = query.andWhere("e.end <= :end", { end });

        if (orderIn.length == 0) {
            // In case they didn't provide an order
            query = query.orderBy('s."totalPoints"', "DESC");
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

        let scores: MatchRecordRow[] = entities.map((e) => {
            let rawRow = raw.find((r) => r.s_eventCode == e.eventCode && r.s_matchId == e.matchId);
            return {
                score: rawRow.e_remote
                    ? new MatchScores2021RemoteGraphql(e)
                    : new MatchScores2021TradAllianceGraphql(e),
                rank: rawRow.post_filter_rank as number,
                preFilterRank: rawRow.pre_filter_rank as number,
            };
        });

        return {
            scores,
            count,
            offset: skip,
        };
    }
}
