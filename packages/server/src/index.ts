import "dotenv/config";

import { DATA_SOURCE } from "./db/data-source";
import { fetchPriorSeasons, watchApi } from "./ftc-api/watch";
import { initDynamicEntities } from "./db/entities/dyn/init";

async function main() {
    await DATA_SOURCE.initialize();
    initDynamicEntities();

    await fetchPriorSeasons();
    await watchApi();
}

main();
