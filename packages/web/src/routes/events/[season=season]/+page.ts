import type { Season } from "@ftc-scout/common";
import type { PageLoad } from "./$types";
import { getData } from "$lib/graphql/getData";
import { getClient } from "$lib/graphql/client";
import { EventsSearchDocument } from "$lib/graphql/generated/graphql-operations";

export const load: PageLoad = async ({ params, fetch }) => {
    let season = +params.season as Season;

    let events = await getData(getClient(fetch), EventsSearchDocument, { season });

    return { events };
};
