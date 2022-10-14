import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
    throw redirect(
        301,
        `https://ftcscout.org/records/2021/matches?filter=%7B%22all%22%3A%5B%7B%22lhs%22%3A%22Total+Points+No+Penalties%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A10%7D%2C%7B%22lhs%22%3A%22Endgame+Alliance+Hub+Balanced+Points%22%2C%22op%22%3A%22%3D%22%2C%22rhs%22%3A10%7D%2C%7B%22lhs%22%3A%22Total+Points%22%2C%22op%22%3A%22%3E%22%2C%22rhs%22%3A%22Total+Points+Opponent%22%7D%5D%7D&shown-stats=%5B%22Team+1%22%2C%22Team+2%22%2C%22Total+Points%22%2C%22Total+Points+No+Penalties%22%2C%22Endgame+Alliance+Hub+Balanced+Points%22%2C%22Total+Points+Opponent%22%2C%22Match+Number%22%2C%22Alliance%22%2C%22Event%22%5D`
    );
};
