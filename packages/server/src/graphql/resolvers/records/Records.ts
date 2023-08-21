import {
    DESCRIPTORS,
    DateTy,
    IntTy,
    RegionOption,
    Season,
    SortDir,
    StrTy,
    getRegionCodes,
    getTepStatSet,
    listTy,
    nullTy,
    wr,
} from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { TeamEventParticipationGQL } from "../TeamEventParticipation";
import { TeamEventParticipation } from "../../../db/entities/dyn/team-event-participation";
import { DATA_SOURCE } from "../../../db/data-source";
import { NamingStrategyInterface } from "typeorm";
import { RegionOptionGQL, SortDirGQL } from "../enums";
import { FilterGQL, TyFilterGQL, filterGQLToSql } from "./filter-gql";

function RecordGqlTy(wrapped: GraphQLObjectType, namePrefix: string): GraphQLObjectType {
    let rowTy = new GraphQLObjectType({
        name: `${namePrefix}RecordRow`,
        fields: {
            data: { type: wrapped },
            noFilterRank: IntTy,
            filterRank: IntTy,
            noFilterSkipRank: IntTy,
            filterSkipRank: IntTy,
        },
    });

    return new GraphQLObjectType({
        name: `${namePrefix}Records`,
        fields: {
            data: listTy(wr(rowTy)),
            offset: IntTy,
            count: IntTy,
        },
    });
}

const TepRecordsGql = wr(RecordGqlTy(TeamEventParticipationGQL, "Tep"));

function name(ns: NamingStrategyInterface, exp: string): string {
    return exp.match(/^\w+$/) ? ns.columnName(exp, undefined, []) : exp;
}

export const RecordQueries: Record<string, GraphQLFieldConfig<any, any>> = {
    tepRecords: {
        ...TepRecordsGql,
        args: {
            season: IntTy,
            sortBy: nullTy(StrTy),
            sortDir: { type: SortDirGQL },
            filter: { type: FilterGQL },
            region: { type: RegionOptionGQL },
            start: nullTy(DateTy),
            end: nullTy(DateTy),
            skip: IntTy,
            take: IntTy,
        },
        async resolve(
            _,
            {
                season,
                sortBy,
                sortDir,
                filter,
                region,
                start,
                end,
                skip,
                take,
            }: {
                season: Season;
                sortBy: string | null;
                sortDir: SortDir | null;
                filter: TyFilterGQL;
                region: RegionOption | null;
                start: Date | null;
                end: Date | null;
                skip: number;
                take: number;
            }
        ) {
            let Tep = TeamEventParticipation[season];
            if (!Tep) return { data: [], offset: 0, count: 0 };

            take = Math.min(take, 50);

            let descriptor = DESCRIPTORS[season];
            let statSet = getTepStatSet(season, false);
            let ns = DATA_SOURCE.namingStrategy;

            // Sort Field
            let defaultRankerSqlName = descriptor.pensSubtract
                ? "oprTotalPointsNp"
                : "oprTotalPoints";
            let rankerExp = statSet.getStat(sortBy ?? "")?.sqlExpr ?? defaultRankerSqlName;
            let rankerSql = name(ns, rankerExp);

            // Sort Direction
            let sortDirSql = sortDir ?? SortDir.Desc;

            // Region
            let chosenRegion = region ?? RegionOption.All;

            let joinEvent = chosenRegion != RegionOption.All || start != null || end != null;

            let contextAddedQ = Tep.createQueryBuilder("tep")
                .select("tep.event_code", "tep_ec")
                .addSelect("tep.team_number", "tep_tn")
                .addSelect(
                    `ROW_NUMBER() OVER (PARTITION BY "team_number" ORDER BY ${rankerSql} ${sortDirSql} NULLS LAST)`,
                    "ranking"
                )
                .addSelect(`${rankerSql}`, "ranker");

            if (joinEvent) {
                contextAddedQ.leftJoin(
                    "event",
                    "e",
                    "tep.season = e.season AND tep.event_code = e.code"
                );
            }

            if (chosenRegion != RegionOption.All) {
                contextAddedQ.andWhere("region_code IN (:...regions)", {
                    regions: getRegionCodes(chosenRegion),
                });
            }

            if (start) {
                contextAddedQ.andWhere(`"start" >= :start`, { start });
            }

            if (end) {
                contextAddedQ.andWhere(`"end" <= :start`, { end });
            }

            if (filter) {
                let sql = filterGQLToSql(filter, statSet, (s) => name(ns, s));
                contextAddedQ.addSelect(sql, "is_in");
            }

            let rankedQ = DATA_SOURCE.createQueryBuilder()
                .from("context_added", "context_added")
                .addSelect("*")
                .addSelect(
                    `RANK() over (order by ranking, ranker ${sortDirSql} NULLS LAST)`,
                    "no_filter_skip_rank"
                )
                .addSelect(
                    `RANK() over (partition by is_in order by ranking, ranker ${sortDirSql} NULLS LAST)`,
                    "filter_skip_rank"
                )
                .addSelect(
                    `RANK() over (order by ranker ${sortDirSql} NULLS LAST)`,
                    "no_filter_rank"
                )
                .addSelect(
                    `RANK() over (partition by is_in order by ranker ${sortDirSql} NULLS LAST)`,
                    "filter_rank"
                )
                .orderBy("ranker", sortDir == SortDir.Asc ? "ASC" : "DESC", "NULLS LAST");

            let finalQ = await DATA_SOURCE.createQueryBuilder()
                .addCommonTableExpression(contextAddedQ, "context_added")
                .addCommonTableExpression(rankedQ, "ranked")
                .from("ranked", "ranked")
                .addSelect("filter_rank")
                .addSelect("no_filter_rank")
                .addSelect("CASE WHEN ranking = 1 THEN filter_skip_rank END", "filter_skip_rank")
                .addSelect(
                    "CASE WHEN ranking = 1 THEN no_filter_skip_rank END",
                    "no_filter_skip_rank"
                )
                .addSelect("tep_ec")
                .addSelect("tep_tn")
                .where("is_in")
                .limit(take)
                .offset(skip)
                .getRawMany();

            let where = finalQ.map((r) => ({
                season,
                eventCode: r.tep_ec,
                teamNumber: r.tep_tn,
            }));
            let entities = await Tep.find({ where });

            let data = finalQ.map((r) => ({
                data: entities.find((e) => e.eventCode == r.tep_ec && e.teamNumber == r.tep_tn)!,
                noFilterRank: r.no_filter_rank,
                filterRank: r.filter_rank,
                noFilterSkipRank: r.no_filter_skip_rank,
                filterSkipRank: r.filter_skip_rank,
            }));

            return { data, offset: skip, count: 0 };
        },
    },
};
