import { Arg, Field, InputType, Int, Query, registerEnumType, Resolver } from "type-graphql";
import { DATA_SOURCE } from "../../../db/data-source";
import { getRegionCodes, Region } from "../../../db/entities/types/Region";
import { TepCondition, TepField, TepOrdering, TepValue } from "./TepObjects";
import { Brackets } from "typeorm";
import { MatchGroup, MatchRecordRow, MatchRecords } from "./MatchObjects";
import { MatchScores2022 } from "../../../db/entities/MatchScores2022";
import { MatchScores2022AllianceGraphql } from "../../objects/MatchScores2022Graphql";

enum Match2022FieldName {
    AUTO_NAVIGATION_POINTS,
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
    OWNERSHIP_POINTS,
    CONE_OWNERSHIP_POINTS,
    BEACON_OWNERSHIP_POINTS,
    CIRCUIT_POINTS,
    //
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

registerEnumType(Match2022FieldName, { name: "Match2022FieldName" });

function getFieldNameSingular(fn: Match2022FieldName, postfix: string): string | null {
    let map: Partial<Record<Match2022FieldName, string>> = {
        [Match2022FieldName.MATCH_NUMBER]: `s${postfix}."matchId"`,
        [Match2022FieldName.ALLIANCE]: `s${postfix}."alliance"`,
        [Match2022FieldName.EVENT_NAME]: `e${postfix}.name`,
    };

    return map[fn] ?? null;
}

function getFieldNameGroup(fn: Match2022FieldName, postfix: string, group: MatchGroup): string | null {
    let g = (group == MatchGroup.THIS ? "s" : "os") + postfix;

    let map: Partial<Record<Match2022FieldName, string>> = {
        [Match2022FieldName.AUTO_NAVIGATION_POINTS]: `${g}."autoNavigationPoints"`,
        [Match2022FieldName.AUTO_CONE_POINTS]: `${g}."autoConePoints"`,
        [Match2022FieldName.AUTO_TERMINAL_POINTS]: `(${g}."autoTerminalCones")`,
        [Match2022FieldName.AUTO_GROUND_POINTS]: `(${g}."autoGroundCones" * 2)`,
        [Match2022FieldName.AUTO_LOW_POINTS]: `(${g}."autoLowCones" * 3)`,
        [Match2022FieldName.AUTO_MEDIUM_POINTS]: `(${g}."autoMediumCones" * 4)`,
        [Match2022FieldName.AUTO_HIGH_POINTS]: `(${g}."autoHighCones" * 5)`,
        [Match2022FieldName.DC_TERMINAL_POINTS]: `(${g}."dcTerminalCones")`,
        [Match2022FieldName.DC_GROUND_POINTS]: `(${g}."dcGroundCones" * 2)`,
        [Match2022FieldName.DC_LOW_POINTS]: `(${g}."dcLowCones" * 3)`,
        [Match2022FieldName.DC_MEDIUM_POINTS]: `(${g}."dcMediumCones" * 4)`,
        [Match2022FieldName.DC_HIGH_POINTS]: `(${g}."dcHighCones" * 5)`,
        [Match2022FieldName.ENDGAME_NAVIGATION_POINTS]: `${g}."endgameNavigationPoints"`,
        [Match2022FieldName.OWNERSHIP_POINTS]: `${g}."ownershipPoints"`,
        [Match2022FieldName.CONE_OWNERSHIP_POINTS]: `(${g}."coneOwnedJunctions" * 3)`,
        [Match2022FieldName.BEACON_OWNERSHIP_POINTS]: `(${g}."beaconOwnedJunctions" * 10)`,
        [Match2022FieldName.CIRCUIT_POINTS]: `${g}."circuitPoints"`,

        [Match2022FieldName.MAJOR_PENALTY_POINTS]: `(${g}."majorPenalties" * -30)`,
        [Match2022FieldName.MINOR_PENALTY_POINTS]: `(${g}."minorPenalties" * -10)`,
        [Match2022FieldName.AUTO_POINTS]: `${g}."autoPoints"`,
        [Match2022FieldName.DRIVER_CONTROLLED_POINTS]: `${g}."dcPoints"`,
        [Match2022FieldName.ENDGAME_POINTS]: `${g}."endgamePoints"`,
        [Match2022FieldName.PENALTY_POINTS]: `${g}."penaltyPoints"`,
        [Match2022FieldName.TOTAL_POINTS]: `${g}."totalPoints"`,
        [Match2022FieldName.TOTAL_POINTS_NP]: `${g}."totalPointsNp"`,

        [Match2022FieldName.TEAM1_NUMBER]: `${g}t1."teamNumber"`,
        [Match2022FieldName.TEAM2_NUMBER]: `${g}t2."teamNumber"`,
        [Match2022FieldName.TEAM3_NUMBER]: `${g}t3."teamNumber"`,
    };

    return map[fn] ?? null;
}

@InputType()
class Match2022Field extends TepField(
    MatchGroup,
    Match2022FieldName,
    getFieldNameGroup,
    getFieldNameSingular,
    (_, f) => f == Match2022FieldName.EVENT_NAME || f == Match2022FieldName.ALLIANCE
) {}

@InputType()
class Match2022Ordering extends TepOrdering<Match2022Field, MatchScores2022>(Match2022Field) {}

@InputType()
class Match2022Value extends TepValue(Match2022Field) {}

function isTeamField(field: Match2022Field | null): boolean {
    return (
        field?.fieldName == Match2022FieldName.TEAM1_NUMBER ||
        field?.fieldName == Match2022FieldName.TEAM2_NUMBER ||
        field?.fieldName == Match2022FieldName.TEAM3_NUMBER
    );
}

@InputType()
class Match2022Condition extends TepCondition(Match2022Value) {
    hasTeam(): boolean {
        return this.lhs != null && isTeamField(this.lhs.field);
    }
}

@InputType()
abstract class Match2022Filter {
    @Field(() => [Match2022Filter], { nullable: true })
    any!: Match2022Filter[] | null;

    @Field(() => [Match2022Filter], { nullable: true })
    all!: Match2022Filter[] | null;

    @Field(() => Match2022Condition, { nullable: true })
    condition!: Match2022Condition | null;

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
export class MatchSeasonRecords2022Resolver {
    @Query(() => MatchRecords)
    async matchRecords2022(
        @Arg("region", () => Region) region: Region,
        @Arg("start", () => Date, { nullable: true }) start: Date | null,
        @Arg("end", () => Date, { nullable: true }) end: Date | null,
        @Arg("order", () => [Match2022Ordering]) orderIn: Match2022Ordering[],
        @Arg("filter", () => Match2022Filter, { nullable: true }) filter: Match2022Filter | null,
        @Arg("take", () => Int) takeIn: number,
        @Arg("skip", () => Int) skip: number
    ): Promise<MatchRecords> {
        let order: Match2022Ordering[] = [];
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
        if (orderByRaw.length == 0) orderByRaw = 's."totalPointsNp" DESC';

        let orderByRaw2 = order
            .slice(0, 1)
            .map((o) => o.toRawSql("2"))
            .filter((o) => o != null)
            .join(", ");
        if (orderByRaw2.length == 0) orderByRaw2 = 's2."totalPointsNp" DESC';

        let preFilterQuery = DATA_SOURCE.getRepository(MatchScores2022)
            .createQueryBuilder("s2")
            .leftJoin("event", "e2", 'e2.season = 2022 AND e2.code = s2."eventCode"')
            .leftJoin(
                "match",
                "m2",
                'm2."eventSeason" = 2022 AND m2."eventCode" = s2."eventCode" AND m2.id = s2."matchId"'
            )
            .leftJoin(
                "match_scores2022",
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
            .andWhere("e2.season = 2022");

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

        let query = DATA_SOURCE.getRepository(MatchScores2022)
            .createQueryBuilder("s")
            .leftJoin("event", "e", 'e.season = 2022 AND e.code = s."eventCode"')
            .leftJoin("match", "m", 'm."eventSeason" = 2022 AND m."eventCode" = s."eventCode" AND m.id = s."matchId"')
            .leftJoin(
                "match_scores2022",
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
            .andWhere("e.season = 2022")
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
            query = query.orderBy('s."totalPointsNp"', "DESC");
        }

        for (let o of order) {
            query = o.addSelfToQuery(query);
        }

        if (filter != null) {
            query = query.andWhere(filter.toBrackets());
        }

        let countQuery = DATA_SOURCE.getRepository(MatchScores2022)
            .createQueryBuilder("s")
            .leftJoin("event", "e", 'e.season = 2022 AND e.code = s."eventCode"')
            .leftJoin("match", "m", 'm."eventSeason" = 2022 AND m."eventCode" = s."eventCode" AND m.id = s."matchId"')
            .leftJoin(
                "match_scores2022",
                "os",
                'os."eventCode" = s."eventCode" AND os."matchId" = s."matchId" AND os.alliance <> s.alliance'
            )
            .addSelect("e.remote")
            .where('m."hasBeenPlayed"')
            .andWhere("e.season = 2022")
            .limit(limit)
            .offset(skip);

        if (filterHasTeam) {
            countQuery = countQuery
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
            countQuery = countQuery.andWhere('e."regionCode" IN (:...regionCodes)', { regionCodes });
        }

        if (start) countQuery = countQuery.andWhere("e.end >= :start", { start });
        if (end) countQuery = countQuery.andWhere("e.end <= :end", { end });

        if (filter != null) {
            countQuery = countQuery.andWhere(filter.toBrackets());
        }

        // console.log("start query");
        // console.log(query.getSql());
        let [{ entities, raw }, count] = await Promise.all([query.getRawAndEntities(), countQuery.getCount()]);
        // console.log("end query");

        let scores: MatchRecordRow[] = entities.map((e) => {
            let rawRow = raw.find(
                (r) => r.s_eventCode == e.eventCode && r.s_matchId == e.matchId && r.s_alliance == e.alliance
            );
            return {
                score: new MatchScores2022AllianceGraphql(e),
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
