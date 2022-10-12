import { Arg, Field, InputType, Int, Query, registerEnumType, Resolver } from "type-graphql";
import { DATA_SOURCE } from "../../../db/data-source";
import { EventTypes } from "./EventTypes";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";
import { TepCondition, TepField, TepOrdering, TepValue } from "./TepObjects";
import { Brackets } from "typeorm";
import { MatchGroup, MatchRecordRow, MatchRecords } from "./MatchObjects";
import { MatchScores2019 } from "../../../db/entities/MatchScores2019";
import { MatchScores2019AllianceGraphql } from "../../objects/MatchScores2019Graphql";

enum Match2019FieldName {
    AUTO_NAVIGATION_POINTS,
    AUTO_REPOSITIONING_POINTS,
    AUTO_DELIVERY_POINTS,
    DC_DELIVERY_POINTS,
    DC_PLACEMENT_POINTS,
    DC_SKYSCRAPER_BONUS_POINTS,
    CAPPING_POINTS,
    ENDGAME_PARKING_POINTS,
    FOUNDATION_MOVED_POINTS,
    MAJOR_PENALTY_POINTS,
    MINOR_PENALTY_POINTS,
    AUTO_POINTS,
    DRIVER_CONTROLLED_POINTS,
    ENDGAME_POINTS,
    PENALTY_POINTS,
    TOTAL_POINTS,
    TOTAL_POINTS_NP,
    //
    TEAM1_NUMBER,
    TEAM2_NUMBER,
    TEAM3_NUMBER,
    MATCH_NUMBER,
    ALLIANCE,
    EVENT_NAME,
}

registerEnumType(Match2019FieldName, { name: "Match2019FieldName" });

function getFieldNameSingular(fn: Match2019FieldName, postfix: string): string | null {
    let map: Partial<Record<Match2019FieldName, string>> = {
        [Match2019FieldName.MATCH_NUMBER]: `s${postfix}."matchId"`,
        [Match2019FieldName.ALLIANCE]: `s${postfix}."alliance"`,
        [Match2019FieldName.EVENT_NAME]: `e${postfix}.name`,
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: Match2019FieldName, postfix: string, group: MatchGroup): string | null {
    let g = (group == MatchGroup.THIS ? "s" : "os") + postfix;

    let map: Partial<Record<Match2019FieldName, string>> = {
        [Match2019FieldName.AUTO_NAVIGATION_POINTS]: `${g}."autoNavigationPoints"`,
        [Match2019FieldName.AUTO_REPOSITIONING_POINTS]: `${g}."autoRepositioningPoints"`,
        [Match2019FieldName.AUTO_DELIVERY_POINTS]: `${g}."autoDeliveryPoints"`,
        [Match2019FieldName.DC_DELIVERY_POINTS]: `${g}."dcDeliveryPoints"`,
        [Match2019FieldName.DC_PLACEMENT_POINTS]: `${g}."dcPlacementPoints"`,
        [Match2019FieldName.DC_SKYSCRAPER_BONUS_POINTS]: `${g}."dcSkyscraperBonusPoints"`,
        [Match2019FieldName.CAPPING_POINTS]: `${g}."cappingPoints"`,
        [Match2019FieldName.ENDGAME_PARKING_POINTS]: `${g}."parkingPoints"`,
        [Match2019FieldName.FOUNDATION_MOVED_POINTS]: `${g}."foundationMovedPoints"`,

        [Match2019FieldName.MAJOR_PENALTY_POINTS]: `(${g}."majorPenalties" * -30)`,
        [Match2019FieldName.MINOR_PENALTY_POINTS]: `(${g}."minorPenalties" * -10)`,
        [Match2019FieldName.AUTO_POINTS]: `${g}."autoPoints"`,
        [Match2019FieldName.DRIVER_CONTROLLED_POINTS]: `${g}."driverControlledPoints"`,
        [Match2019FieldName.ENDGAME_POINTS]: `${g}."endgamePoints"`,
        [Match2019FieldName.PENALTY_POINTS]: `${g}."penaltyPoints"`,
        [Match2019FieldName.TOTAL_POINTS]: `${g}."totalPoints"`,
        [Match2019FieldName.TOTAL_POINTS_NP]: `${g}."totalPointsNp"`,

        [Match2019FieldName.TEAM1_NUMBER]: `${g}t1."teamNumber"`,
        [Match2019FieldName.TEAM2_NUMBER]: `${g}t2."teamNumber"`,
        [Match2019FieldName.TEAM3_NUMBER]: `${g}t3."teamNumber"`,
    };

    return map[fn] ?? null;
}

@InputType()
class Match2019Field extends TepField(
    MatchGroup,
    Match2019FieldName,
    getFieldNameGroup,
    getFieldNameSingular,
    (_, f) => f == Match2019FieldName.EVENT_NAME || f == Match2019FieldName.ALLIANCE
) {}

@InputType()
class Match2019Ordering extends TepOrdering<Match2019Field, MatchScores2019>(Match2019Field) {}

@InputType()
class Match2019Value extends TepValue(Match2019Field) {}

function isTeamField(field: Match2019Field | null): boolean {
    return (
        field?.fieldName == Match2019FieldName.TEAM1_NUMBER ||
        field?.fieldName == Match2019FieldName.TEAM2_NUMBER ||
        field?.fieldName == Match2019FieldName.TEAM3_NUMBER
    );
}

@InputType()
class Match2019Condition extends TepCondition(Match2019Value) {
    hasTeam(): boolean {
        return this.lhs != null && isTeamField(this.lhs.field);
    }
}

@InputType()
abstract class Match2019Filter {
    @Field(() => [Match2019Filter], { nullable: true })
    any!: Match2019Filter[] | null;

    @Field(() => [Match2019Filter], { nullable: true })
    all!: Match2019Filter[] | null;

    @Field(() => Match2019Condition, { nullable: true })
    condition!: Match2019Condition | null;

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

    hasTeam(): boolean {
        return (
            !!this.condition?.hasTeam() || !!this.all?.some((c) => c.hasTeam()) || !!this.any?.some((c) => c.hasTeam())
        );
    }
}

@Resolver()
export class MatchSeasonRecords2019Resolver {
    @Query(() => MatchRecords)
    async matchRecords2019(
        @Arg("eventTypes", () => EventTypes) eventTypes: EventTypes,
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [Match2019Ordering]) orderIn: Match2019Ordering[],
        @Arg("filter", () => Match2019Filter, { nullable: true }) filter: Match2019Filter | null,
        @Arg("take", () => Int) takeIn: number,
        @Arg("skip", () => Int) skip: number
    ): Promise<MatchRecords> {
        let order: Match2019Ordering[] = [];
        for (let i = 0; i < orderIn.length && i < 5; i++) {
            let o = orderIn[i];
            // Don't duplicate order clauses.
            if (
                orderIn
                    .slice(0, i)
                    .every((o2) => o2.field.fieldName != o.field.fieldName || o2.field.group != o.field.group)
            ) {
                order.push(o);
            }
        }

        let filterHasTeam = !!filter?.hasTeam();
        let orderHasTeam = order.some((o) => isTeamField(o.field));

        let limit = Math.min(takeIn, 50);

        let regionCodes = getRegionCodes(region);

        let orderByRaw = order
            .slice(0, 1)
            .map((o) => o.toRawSql(""))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw.length == 0) orderByRaw = 's."totalPoints" DESC';

        let orderByRaw2 = order
            .slice(0, 1)
            .map((o) => o.toRawSql("2"))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw2.length == 0) orderByRaw2 = 's2."totalPoints" DESC';

        let preFilterQuery = DATA_SOURCE.getRepository(MatchScores2019)
            .createQueryBuilder("s2")
            .leftJoin("event", "e2", 'e2.season = 2019 AND e2.code = s2."eventCode"')
            .leftJoin(
                "match",
                "m2",
                'm2."eventSeason" = 2019 AND m2."eventCode" = s2."eventCode" AND m2.id = s2."matchId"'
            )
            .leftJoin(
                "match_scores2019",
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
            .andWhere("e2.season = 2019");

        if (orderHasTeam || filterHasTeam) {
            preFilterQuery = preFilterQuery
                .leftJoin(
                    "team_match_participation",
                    "s2t1",
                    `s2.season = s2t1.season AND s2."eventCode" = s2t1."eventCode" AND s2."matchId" = s2t1."matchId" AND s2t1.station = (CASE WHEN s2.alliance = '0' THEN '0' ELSE '3' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "s2t2",
                    `s2.season = s2t2.season AND s2."eventCode" = s2t2."eventCode" AND s2."matchId" = s2t2."matchId" AND s2t2.station = (CASE WHEN s2.alliance = '0' THEN '1' ELSE '4' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "s2t3",
                    `s2.season = s2t3.season AND s2."eventCode" = s2t3."eventCode" AND s2."matchId" = s2t3."matchId" AND s2t3.station = (CASE WHEN s2.alliance = '0' THEN '2' ELSE '5' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "os2t1",
                    `s2.season = os2t1.season AND s2."eventCode" = os2t1."eventCode" AND s2."matchId" = os2t1."matchId" AND os2t1.station = (CASE WHEN s2.alliance = '0' THEN '3' ELSE '0' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "os2t2",
                    `s2.season = os2t2.season AND s2."eventCode" = os2t2."eventCode" AND s2."matchId" = os2t2."matchId" AND os2t2.station = (CASE WHEN s2.alliance = '0' THEN '4' ELSE '1' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "os2t3",
                    `s2.season = os2t3.season AND s2."eventCode" = os2t3."eventCode" AND s2."matchId" = os2t3."matchId" AND os2t3.station = (CASE WHEN s2.alliance = '0' THEN '5' ELSE '2' END)::team_match_participation_station_enum`
                );
        }

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

        let query = DATA_SOURCE.getRepository(MatchScores2019)
            .createQueryBuilder("s")
            .leftJoin("event", "e", 'e.season = 2019 AND e.code = s."eventCode"')
            .leftJoin("match", "m", 'm."eventSeason" = 2019 AND m."eventCode" = s."eventCode" AND m.id = s."matchId"')
            .leftJoin(
                "match_scores2019",
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
            .andWhere("e.season = 2019")
            .limit(limit)
            .offset(skip);

        if (orderHasTeam || filterHasTeam) {
            query = query
                .leftJoin(
                    "team_match_participation",
                    "st1",
                    `s.season = st1.season AND s."eventCode" = st1."eventCode" AND s."matchId" = st1."matchId" AND st1.station = (CASE WHEN s.alliance = '0' THEN '0' ELSE '3' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "st2",
                    `s.season = st2.season AND s."eventCode" = st2."eventCode" AND s."matchId" = st2."matchId" AND st2.station = (CASE WHEN s.alliance = '0' THEN '1' ELSE '4' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "st3",
                    `s.season = st3.season AND s."eventCode" = st3."eventCode" AND s."matchId" = st3."matchId" AND st3.station = (CASE WHEN s.alliance = '0' THEN '2' ELSE '5' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "ost1",
                    `s.season = ost1.season AND s."eventCode" = ost1."eventCode" AND s."matchId" = ost1."matchId" AND ost1.station = (CASE WHEN s.alliance = '0' THEN '3' ELSE '0' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "ost2",
                    `s.season = ost2.season AND s."eventCode" = ost2."eventCode" AND s."matchId" = ost2."matchId" AND ost2.station = (CASE WHEN s.alliance = '0' THEN '4' ELSE '1' END)::team_match_participation_station_enum`
                )
                .leftJoin(
                    "team_match_participation",
                    "ost3",
                    `s.season = ost3.season AND s."eventCode" = ost3."eventCode" AND s."matchId" = ost3."matchId" AND ost3.station = (CASE WHEN s.alliance = '0' THEN '5' ELSE '2' END)::team_match_participation_station_enum`
                );
        }

        if (region != Region.ALL) {
            query = query.andWhere('e."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) query = query.andWhere("e.end >= :start", { start });
        if (end) query = query.andWhere("e.end <= :end", { end });

        if (order.length == 0) {
            // In case they didn't provide an order
            query = query.orderBy('s."totalPoints"', "DESC");
        }

        if (eventTypes == EventTypes.REMOTE) {
            query = query.andWhere("e.remote");
        } else if (eventTypes == EventTypes.TRAD) {
            query = query.andWhere("NOT e.remote");
        }

        for (let o of order) {
            query = o.addSelfToQuery(query);
        }

        if (filter != null) {
            query = query.andWhere(filter.toBrackets());
        }

        let [{ entities, raw }, count] = await Promise.all([await query.getRawAndEntities(), await query.getCount()]);

        let scores: MatchRecordRow[] = entities.map((e) => {
            let rawRow = raw.find(
                (r) => r.s_eventCode == e.eventCode && r.s_matchId == e.matchId && r.s_alliance == e.alliance
            );
            return {
                score: new MatchScores2019AllianceGraphql(e),
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
