import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = ({ fetch }) => {
    return {
        f: fetch,
    };
};

// export function load({ fetch }: { fetch: NonNullable<HttpOptions["fetch"]> }) {
//     return {
//     f: fetch,
// };
// }
