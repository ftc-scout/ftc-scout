import { browser } from "$app/env";
import { CURRENT_SEASON } from "$lib/constants";
import { getMyClient } from "$lib/graphql/client";
import { getData } from "$lib/graphql/query-load";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import { TeamDocument } from "../../../lib/graphql/generated/graphql-operations";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
    let teamData = await getData(getMyClient(fetch), TeamDocument, { number: +params.number, season: CURRENT_SEASON });

    let gotten = get(teamData);
    if (!browser && gotten && !gotten?.data?.teamByNumber) {
        throw error(404, `No team with number ${params.number}`);
    }

    return {
        team: teamData,
    };
};
