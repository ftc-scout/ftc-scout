import type { LayoutLoad } from "./$types";
import { getClient } from "$lib/graphql/client";

export const load: LayoutLoad = async ({ fetch }) => {
    getClient(fetch);
};
