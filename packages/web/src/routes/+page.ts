import { getClient } from "$lib/graphql/client";
import { HomePageDocument } from "$lib/graphql/generated/graphql-operations";
import { getData } from "$lib/graphql/getData";
import { CURRENT_SEASON } from "@ftc-scout/common";
import type { Load } from "@sveltejs/kit";

export const load: Load = async ({ fetch }) => {
    let home = await getData(getClient(fetch), HomePageDocument, { season: CURRENT_SEASON });
    return { home };
};
