import { browser } from "$app/environment";
import { get } from "svelte/store";
import { getClient } from "$lib/graphql/client";
import { EventPageDocument } from "$lib/graphql/generated/graphql-operations";
import { getData } from "$lib/graphql/getData";
import type { PageLoad } from "./$types";
import { error } from "@sveltejs/kit";
import { DESCRIPTORS, Season } from "@ftc-scout/common";
import { currentlyWatchedEvent, ongoingEvents } from "./watchEvent";

export const load: PageLoad = async ({ params, fetch }) => {
    let season = +params.season as Season;
    let args = {
        season,
        code: params.code,
    };

    let noCache =
        ongoingEvents.has(JSON.stringify(args)) &&
        (args.season != currentlyWatchedEvent?.season || args.code != currentlyWatchedEvent.code);

    let eventData = await getData(getClient(fetch), EventPageDocument, args, undefined, noCache);

    if (!browser && !get(eventData)?.data?.eventByCode)
        throw error(404, `No ${DESCRIPTORS[season].seasonName} event with code ${params.code}`);

    return {
        event: eventData,
    };
};
