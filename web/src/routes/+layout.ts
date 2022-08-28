import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ fetch }) => {
    return {
        f: fetch,
    };
};
