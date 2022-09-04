import { getMyClient } from "../lib/graphql/client";
import { HomePageDocument } from "../lib/graphql/generated/graphql-operations";
import { getData } from "../lib/graphql/query-load";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    return await getData(getMyClient(fetch), HomePageDocument, {});
};
