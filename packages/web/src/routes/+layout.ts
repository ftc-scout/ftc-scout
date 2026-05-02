import type { LayoutLoad } from "./$types";
import { getClient } from "$lib/graphql/client";

export const ssr = false;

export const load: LayoutLoad = async ({ fetch }) => {
    getClient(fetch);
};
