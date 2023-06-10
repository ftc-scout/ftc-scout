import { DataSource } from "typeorm";
import { DATABASE_URL, LOGGING, SYNC } from "../constants";
import { ENTITIES } from "./entities";

export const DATA_SOURCE = new DataSource({
    type: "postgres",
    url: DATABASE_URL,
    synchronize: SYNC,
    logging: LOGGING,
    entities: ENTITIES,
});
