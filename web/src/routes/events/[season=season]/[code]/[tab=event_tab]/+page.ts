import { browser } from "$app/env";
import { getMyClient } from "$lib/graphql/client";
import { error } from "@sveltejs/kit";
import { get } from "svelte/store";
import { EventPageDocument } from "../../../../../lib/graphql/generated/graphql-operations";
import { getData } from "../../../../../lib/graphql/query-load";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
    let eventData = await getData(getMyClient(fetch), EventPageDocument, {
        season: +params.season,
        code: params.code,
    });

    let gotten = get(eventData);
    if (!browser && gotten && !gotten?.data?.eventByCode) {
        throw error(404, `No event with code "${params.code}"`);
    }

    return {
        event: eventData,
    };
};
