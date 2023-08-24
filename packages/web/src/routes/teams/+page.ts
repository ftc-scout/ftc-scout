import { getClient } from "../../lib/graphql/client";
import {
    RegionOption as RegionOptionGQL,
    TeamsRegionSearchDocument,
} from "../../lib/graphql/generated/graphql-operations";
import { getData } from "../../lib/graphql/getData";
import { REGION_EC_DC } from "../../lib/util/search-params/region";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, url }) => {
    let region = REGION_EC_DC.decode(url.searchParams.get("regions")) as RegionOptionGQL | null;
    if (region == RegionOptionGQL.All) region = null;

    return {
        teams: await getData(getClient(fetch), TeamsRegionSearchDocument, { region }),
    };
};
