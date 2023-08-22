import type { Season } from "@ftc-scout/common";
import type { PageLoad } from "./$types";
import { getData } from "$lib/graphql/getData";
import { getClient } from "$lib/graphql/client";
import { TepRecordsDocument } from "$lib/graphql/generated/graphql-operations";
import { PAGE_EC_DC } from "$lib/util/search-params/int";
import { PAGE_SIZE } from "./+page.svelte";

export const load: PageLoad = ({ fetch, params, url }) => {
    let season = +params.season as Season;

    if (params.tab == "teams") {
        let page = PAGE_EC_DC.decode(url.searchParams.get("page"));
        let skip = (page - 1) * PAGE_SIZE;
        let take = PAGE_SIZE;

        return {
            tepData: getData(getClient(fetch), TepRecordsDocument, { season, skip, take }),
        };
    } else {
        return {
            matchData: [],
        };
    }
};
