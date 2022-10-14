import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    throw redirect(
        301,
        `https://ftcscout.org/records/2021/teams?region=California&filter=%7B%22all%22%3A%5B%7B%22lhs%22%3A%22Team%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A16321%7D%5D%7D&sort=Auto+Points+OPR)`
    );
};
