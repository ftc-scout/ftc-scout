import { CURRENT_SEASON } from "$lib/constants";
import { getMyClient } from "$lib/graphql/client";
import { getData } from "$lib/graphql/query-load";
import { TeamDocument } from "../../../lib/graphql/generated/graphql-operations";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    let teamData = await getData(getMyClient(fetch), TeamDocument, { number: +params.number, season: CURRENT_SEASON });

    return {
        team: teamData,
    };
};
