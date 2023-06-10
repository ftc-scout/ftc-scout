import "dotenv/config";

import { DATA_SOURCE } from "./db/data-source";
import { fetchPriorSeasons, watchApi } from "./ftc-api/watch";

async function main() {
    await DATA_SOURCE.initialize();

    await fetchPriorSeasons();
    await watchApi();
}

main();
