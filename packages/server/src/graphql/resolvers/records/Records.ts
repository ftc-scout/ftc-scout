import {
    DESCRIPTORS,
    DateTy,
    IntTy,
    RegionOption,
    RemoteOption,
    Season,
    SortDir,
    StrTy,
    getRegionCodes,
    getTepStatSet,
    listTy,
    nn,
    nullTy,
    wr,
} from "@ftc-scout/common";
import { GraphQLFieldConfig, GraphQLObjectType } from "graphql";
import { TeamEventParticipationGQL } from "../TeamEventParticipation";
import { TeamEventParticipation } from "../../../db/entities/dyn/team-event-participation";
import { DATA_SOURCE } from "../../../db/data-source";
import { NamingStrategyInterface } from "typeorm";
import { RegionOptionGQL, RemoteOptionGQL, SortDirGQL } from "../enums";
import { FilterGQL, TyFilterGQL, filterGQLToSql } from "./filter-gql";

function RecordGqlTy(wrapped: GraphQLObjectType, namePrefix: string): GraphQLObjectType {
    let rowTy = new GraphQLObjectType({
        name: `${namePrefix}RecordRow`,
        fields: {
            data: { type: nn(wrapped) },
            noFilterRank: IntTy,
            filterRank: IntTy,
            noFilterSkipRank: IntTy,
            filterSkipRank: IntTy,
        },
    });

    return new GraphQLObjectType({
        name: `${namePrefix}Records`,
        fields: {
            data: listTy(wr(nn(rowTy))),
            offset: IntTy,
            count: IntTy,
        },
    });
}

const TepRecordsGql = wr(nn(RecordGqlTy(TeamEventParticipationGQL, "Tep")));

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
            remote: { type: RemoteOptionGQL },
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
                remote,
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
                remote: RemoteOption | null;
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
                ? "oprTotalPoints"
                : "oprTotalPointsNp";
            let rankerExp = statSet.getStat(sortBy ?? "")?.sqlExpr ?? defaultRankerSqlName;
            let rankerSql = name(ns, rankerExp);

            let defaultSortSql = name(ns, defaultRankerSqlName) + " DESC NULLS LAST";

            // Sort Direction
            let sortDirSql = sortDir ?? SortDir.Desc;

            // Region
            let chosenRegion = region ?? RegionOption.All;

            // Filter
            let filterSql = filter ? filterGQLToSql(filter, statSet, (s) => name(ns, s)) : "true";

            let joinEvent =
                chosenRegion != RegionOption.All ||
                start != null ||
                end != null ||
                remote != RemoteOption.All ||
                sortBy == "event";

            let contextAddedQ = Tep.createQueryBuilder("tep")
                .select("tep.event_code", "tep_ec")
                .addSelect("tep.team_number", "tep_tn")
                .addSelect(
                    `ROW_NUMBER() OVER (PARTITION BY "team_number" ORDER BY ${rankerSql} ${sortDirSql} NULLS LAST, ${defaultSortSql})`,
                    "ranking"
                )
                .addSelect(
                    `ROW_NUMBER() OVER (PARTITION BY "team_number", ${filterSql} ORDER BY ${rankerSql} ${sortDirSql} NULLS LAST, ${defaultSortSql})`,
                    "filter_ranking"
                )
                .addSelect(`${rankerSql}`, "ranker")
                .addSelect(name(ns, defaultRankerSqlName))
                .andWhere("has_stats");

            let countQ = Tep.createQueryBuilder("tep").where("has_stats");

            if (joinEvent) {
                contextAddedQ.leftJoin(
                    "event",
                    "e",
                    "tep.season = e.season AND tep.event_code = e.code"
                );
                countQ.leftJoin("event", "e", "tep.season = e.season AND tep.event_code = e.code");
            }

            if (chosenRegion != RegionOption.All) {
                contextAddedQ.andWhere("region_code IN (:...regions)", {
                    regions: getRegionCodes(chosenRegion),
                });
                countQ.andWhere("region_code IN (:...regions)", {
                    regions: getRegionCodes(chosenRegion),
                });
            }

            if (remote == RemoteOption.Trad) {
                contextAddedQ.andWhere("NOT remote");
                countQ.andWhere("NOT remote");
            } else if (remote == RemoteOption.Remote) {
                contextAddedQ.andWhere("remote");
                countQ.andWhere("remote");
            }

            if (start) {
                contextAddedQ.andWhere(`"start" >= :start`, { start });
                countQ.andWhere(`"start" >= :start`, { start });
            }

            if (end) {
                contextAddedQ.andWhere(`"end" <= :end`, { end });
                countQ.andWhere(`"end" <= :end`, { end });
            }

            contextAddedQ.addSelect(filterSql, "is_in");

            let count = await countQ.andWhere(filterSql).getCount();

            if (skip >= count) {
                return { data: [], offset: skip, count };
            }

            let rankedQ = DATA_SOURCE.createQueryBuilder()
                .from("context_added", "context_added")
                .addSelect("*")
                .addSelect(
                    `RANK() over (order by ranking, ranker ${sortDirSql} NULLS LAST, ${defaultSortSql})`,
                    "no_filter_skip_rank"
                )
                .addSelect(
                    `RANK() over (partition by is_in order by filter_ranking, ranker ${sortDirSql} NULLS LAST, ${defaultSortSql})`,
                    "filter_skip_rank"
                )
                .addSelect(
                    `RANK() over (order by ranker ${sortDirSql} NULLS LAST, ${defaultSortSql})`,
                    "no_filter_rank"
                )
                .addSelect(
                    `RANK() over (partition by is_in order by ranker ${sortDirSql} NULLS LAST, ${defaultSortSql})`,
                    "filter_rank"
                )
                .orderBy("ranker", sortDir == SortDir.Asc ? "ASC" : "DESC", "NULLS LAST")
                .addOrderBy(name(ns, defaultRankerSqlName), "DESC", "NULLS LAST");

            let finalQ = await DATA_SOURCE.createQueryBuilder()
                .addCommonTableExpression(contextAddedQ, "context_added")
                .addCommonTableExpression(rankedQ, "ranked")
                .from("ranked", "ranked")
                .addSelect("filter_rank")
                .addSelect("no_filter_rank")
                .addSelect(
                    "CASE WHEN filter_ranking = 1 THEN filter_skip_rank END",
                    "filter_skip_rank"
                )
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
                noFilterRank: +r.no_filter_rank,
                filterRank: +r.filter_rank,
                noFilterSkipRank: +r.no_filter_skip_rank,
                filterSkipRank: +r.filter_skip_rank,
            }));

            return { data, offset: skip, count };
        },
    },
};
