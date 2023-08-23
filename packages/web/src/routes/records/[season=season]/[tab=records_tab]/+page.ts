import { DESCRIPTORS, getTepStatSet, type Season } from "@ftc-scout/common";
import type { PageLoad } from "./$types";
import { getData } from "$lib/graphql/getData";
import { getClient } from "$lib/graphql/client";
import {
    SortDir as SortDirGQL,
    TepRecordsDocument,
} from "$lib/graphql/generated/graphql-operations";
import { PAGE_EC_DC } from "$lib/util/search-params/int";
import { PAGE_SIZE } from "./+page.svelte";
import { FILTER_EC_DC, SORT_DIR_EC_DC, STAT_EC_DC } from "../../../../lib/util/search-params/stats";
import { filterGroupToGql } from "../../../../lib/components/stats/filter/filterToGql";

export const load: PageLoad = ({ fetch, params, url }) => {
    let season = +params.season as Season;

    if (params.tab == "teams") {
        let stats = getTepStatSet(season, false);
        let descriptor = DESCRIPTORS[season];

        let sortBy = STAT_EC_DC(
            stats,
            descriptor.pensSubtract ? "totalPointsOpr" : "totalPointsNpOpr"
        ).decode(url.searchParams.get("sort"));
        let sortDir = SORT_DIR_EC_DC.decode(url.searchParams.get("sort-dir")) as SortDirGQL;

        let filterLoc = FILTER_EC_DC(stats).decode(url.searchParams.get("filter"));
        let filter = filterLoc ? { group: filterGroupToGql(filterLoc) } : null;

        let page = PAGE_EC_DC.decode(url.searchParams.get("page"));
        let skip = (page - 1) * PAGE_SIZE;
        let take = PAGE_SIZE;

        return {
            tepData: getData(getClient(fetch), TepRecordsDocument, {
                season,
                skip,
                take,
                sortBy,
                sortDir,
                filter,
            }),
        };
    } else {
        return {
            matchData: [],
        };
    }
};
