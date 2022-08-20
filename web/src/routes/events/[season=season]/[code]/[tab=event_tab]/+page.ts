import { getMyClient } from "$lib/graphql/client";
import { EventPageDocument } from "../../../../../lib/graphql/generated/graphql-operations";
import { getData } from "../../../../../lib/graphql/query-load";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    let eventData = await getData(getMyClient(fetch), EventPageDocument, {
        season: +params.season,
        code: params.code,
    });

    return {
        event: eventData,
    };
};