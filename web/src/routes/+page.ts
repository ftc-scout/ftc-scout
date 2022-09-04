import { getMyClient } from "../lib/graphql/client";
import { HomePageDocument } from "../lib/graphql/generated/graphql-operations";
import { getData } from "../lib/graphql/query-load";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    let today = new Date();
    // Round to the hour to avoid pointless refetching.
    today.setMinutes(0, 0, 0);
    console.log(today.toISOString());
    return await getData(getMyClient(fetch), HomePageDocument, { date: today });
};
