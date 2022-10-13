import { browser } from "$app/env";
import { ALL_SEASONS, CURRENT_SEASON, type Season } from "$lib/constants";
import { getMyClient } from "$lib/graphql/client";
import { getData } from "$lib/graphql/query-load";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import { TeamDocument } from "../../../lib/graphql/generated/graphql-operations";
import type { PageLoad } from "./$types";

export function getSeasonFromStr(str: string | null): Season {
    for (let season of ALL_SEASONS) {
        if (str == `${season}`) return season;
    }
    return CURRENT_SEASON;
}

export const load: PageLoad = async ({ params, url, fetch }) => {
    let season = getSeasonFromStr(url.searchParams.get("season"));

    let teamData = await getData(getMyClient(fetch), TeamDocument, { number: +params.number, season });

    let gotten = get(teamData);
    if (!browser && gotten && !gotten?.data?.teamByNumber) {
        throw error(404, `No team with number ${params.number}`);
    }

    return {
        team: teamData,
    };
};
